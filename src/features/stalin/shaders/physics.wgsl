struct Uniforms {
    width: f32,
    height: f32,
    charge: f32,
    linkDistance: f32,
    linkStrength: f32,
    centerStrength: f32,
    nodeRelSize: f32,
    collisionPad: f32,
};

struct Node {
    pos: vec2<f32>,
    vel: vec2<f32>,
    mass: f32,
    centrality: f32,
    color: vec4<f32>,
    padding: vec2<f32>,
};

struct Edge {
    source: u32,
    target: u32,
    weight: f32,
    color: vec4<f32>,
    padding: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> nodes: array<Node>;
@group(0) @binding(2) var<storage, read> edges: array<Edge>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let i = id.x;
    if (i >= arrayLength(&nodes)) { return; }

    var node = nodes[i];
    var force = vec2<f32>(0.0, 0.0);

    // 1. Repulsion (Many-body) - O(n^2) for now, Barnes-Hut is next
    for (var j: u32 = 0u; j < u32(arrayLength(&nodes)); j++) {
        if (i == j) { continue; }
        let other = nodes[j];
        let delta = node.pos - other.pos;
        let distSq = dot(delta, delta) + 0.01;
        let dist = sqrt(distSq);
        
        // Coulomb-like repulsion
        let repulsion = (uniforms.charge * node.mass * other.mass) / distSq;
        force += (delta / dist) * repulsion;
    }

    // 2. Attraction (Springs)
    // Note: This is inefficient in a node-centric shader. 
    // Ideally, this is a separate pass over edges.
    // For now, we'll iterate edges and check if this node is involved.
    for (var k: u32 = 0u; k < u32(arrayLength(&edges)); k++) {
        let edge = edges[k];
        if (edge.source == i || edge.target == i) {
            let otherIdx = (edge.source == i) ? edge.target : edge.source;
            let other = nodes[otherIdx];
            let delta = other.pos - node.pos;
            let dist = sqrt(dot(delta, delta)) + 0.01;
            
            // Hooke's Law: F = k * (dist - L)
            let springForce = uniforms.linkStrength * (dist - uniforms.linkDistance);
            force += (delta / dist) * springForce * edge.weight;
        }
    }

    // 3. Center Gravity
    let center = vec2<f32>(uniforms.width / 2.0, uniforms.height / 2.0);
    let centerDelta = center - node.pos;
    force += centerDelta * uniforms.centerStrength;

    // 4. Integration
    let accel = force / node.mass;
    let damping = 0.95;
    node.vel = (node.vel + accel * 0.016) * damping;
    node.pos += node.vel * 0.016;

    nodes[i] = node;
}
