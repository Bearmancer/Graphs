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
@group(0) @binding(2) var msdfTexture: texture_2d<f32>;
@group(0) @binding(3) var msdfSampler: sampler;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) color: vec4<f32>,
};

@vertex
fn vs_text(@builtin(vertex_index) vIdx: u32, @builtin(instance_index) iIdx: u32) -> VertexOutput {
    let node = nodes[iIdx];
    
    // Text quad vertices
    var vertices = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 0.0), vec2<f32>(0.0, 1.0),
        vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 0.0), vec2<f32>(1.0, 1.0)
    );
    
    let vPos = vertices[vIdx];
    let fontSize = 12.0; // Base size
    
    let screenPos = vec2<f32>(
        (node.pos.x + vPos.x * fontSize, node.pos.y + vPos.y * fontSize)
    );
    
    var out: VertexOutput;
    out.position = vec4<f32>(screenPos.x / (uniforms.width / 2.0), -screenPos.y / (uniforms.height / 2.0), 0.0, 1.0);
    out.uv = vPos;
    out.color = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    return out;
}

@fragment
fn fs_text(in: VertexOutput) -> @location(0) vec4<f32> {
    let sample = textureSample(msdfTexture, msdfSampler, in.uv).rgb;
    
    // MSDF distance calculation: median of RGB
    let dist = max(min(sample.r, sample.g), min(max(sample.r, sample.g), sample.b));
    
    // Anti-aliasing
    let screenPxRange = fwidth(in.uv);
    let alpha = smoothstep(0.5 - screenPxRange, 0.5 + screenPxRange, dist);
    
    return vec4<f32>(in.color.rgb, alpha * in.color.a);
}
