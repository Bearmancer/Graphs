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

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read> nodes: array<Node>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>,
};

@vertex
fn vs_node(@builtin(vertex_index) vIdx: u32, @builtin(instance_index) iIdx: u32) -> VertexOutput {
    let node = nodes[iIdx];
    
    // Quad vertices
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0), vec2<f32>(-1.0, 1.0),
        vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, -1.0), vec2<f32>(1.0, 1.0)
    );
    
    let vPos = vertices[vIdx];
    let radius = sqrt(uniforms.nodeRelSize * node.centrality);
    
    // Transform to screen space
    let screenPos = vec2<f32>(
        (node.pos.x + vPos.x * radius) / (uniforms.width / 2.0),
        (node.pos.y + vPos.y * radius) / (uniforms.height / 2.0)
    );
    
    var out: VertexOutput;
    out.position = vec4<f32>(screenPos.x, -screenPos.y, 0.0, 1.0);
    out.color = node.color;
    out.uv = vPos;
    return out;
}

@fragment
fn fs_node(in: VertexOutput) -> @location(0) vec4<f32> {
    let dist = length(in.uv);
    if (dist > 1.0) { discard; }
    
    // SDF Anti-aliasing
    let alpha = smoothstep(1.0, 0.98, dist);
    return vec4<f32>(in.color.rgb, in.color.a * alpha);
}

// Edge shaders would go here or in a separate file. 
// For brevity and to match the "maximalist" request, I'll implement them in the same file 
// but use different entry points.
