import { GraphNode, GraphLink, GraphData } from "./types";

export interface RendererOptions {
  width: number;
  height: number;
  nodeRelSize: number;
  collisionPad: number;
  charge: number;
  linkDistance: number;
  linkStrength: number;
  centerStrength: number;
}

export class WebGPURenderer {
  private device: GPUDevice;
  private context: GPUCanvasContext;
  private format: GPUTextureFormat;
  
  private nodeBuffer: GPUBuffer;
  private edgeBuffer: GPUBuffer;
  private uniformBuffer: GPUBuffer;
  
  private physicsPipeline: GPUComputePipeline;
  private renderPipeline: GPURenderPipeline;
  private textPipeline: GPURenderPipeline;
  
  private nodeCount: number = 0;
  private edgeCount: number = 0;
  
  private physicsBindGroup: GPUBindGroup;
  private renderBindGroup: GPUBindGroup;

  constructor(
    canvas: HTMLCanvasElement,
    device: GPUDevice,
    options: RendererOptions
  ) {
    this.device = device;
    this.context = canvas.getContext("webgpu")!;
    this.format = navigator.gpu.getPreferredCanvasFormat();
    
    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: "premultiplied",
    });

    this.initBuffers(options);
    this.initPipelines();
  }

  private initBuffers(options: RendererOptions) {
    // Uniforms: [width, height, charge, linkDistance, linkStrength, centerStrength, nodeRelSize, collisionPad]
    const uniformData = new Float32Array([
      options.width, options.height, 
      options.charge, options.linkDistance, 
      options.linkStrength, options.centerStrength, 
      options.nodeRelSize, options.collisionPad
    ]);
    
    this.uniformBuffer = this.device.createBuffer({
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.uniformBuffer.getMappedRange()).set(uniformData);
    this.uniformBuffer.unmap();
  }

  public async setData(data: GraphData) {
    this.nodeCount = data.nodes.length;
    this.edgeCount = data.links.length;

    // Node data: [x, y, vx, vy, mass, centrality, r, g, b, a, padding, padding]
    // 12 floats per node = 48 bytes (aligned to 16)
    const nodeData = new Float32Array(this.nodeCount * 12);
    data.nodes.forEach((node, i) => {
      const offset = i * 12;
      nodeData[offset] = node.x ?? 0;
      nodeData[offset + 1] = node.y ?? 0;
      nodeData[offset + 2] = 0; // vx
      nodeData[offset + 3] = 0; // vy
      nodeData[offset + 4] = 1.0; // mass
      nodeData[offset + 5] = node.centrality;
      
      // Convert hex color to normalized RGB
      const color = this.hexToRgb(node.faction); // This needs to be passed in or imported
      nodeData[offset + 6] = color[0];
      nodeData[offset + 7] = color[1];
      nodeData[offset + 8] = color[2];
      nodeData[offset + 9] = 1.0;
    });

    this.nodeBuffer = this.device.createBuffer({
      size: nodeData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(this.nodeBuffer.getMappedRange()).set(nodeData);
    this.nodeBuffer.unmap();

    // Edge data: [src, tgt, weight, r, g, b, a, padding]
    // 8 floats per edge = 32 bytes
    const edgeData = new Float32Array(this.edgeCount * 8);
    data.links.forEach((link, i) => {
      const offset = i * 8;
      // We need indices, not IDs. This requires a map.
      const srcIdx = data.nodes.findIndex(n => n.id === (link as any).source.id || (link as any).source === link.source);
      const tgtIdx = data.nodes.findIndex(n => n.id === (link as any).target.id || (link as any).target === link.target);
      
      edgeData[offset] = srcIdx;
      edgeData[offset + 1] = tgtIdx;
      edgeData[offset + 2] = link.weight ?? 1.0;
      
      const color = this.hexToRgb(link.type); // Needs mapping
      edgeData[offset + 3] = color[0];
      edgeData[offset + 4] = color[1];
      edgeData[offset + 5] = color[2];
      edgeData[offset + 6] = 0.7; // alpha
    });

    this.edgeBuffer = this.device.createBuffer({
      size: edgeData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.edgeBuffer.getMappedRange()).set(edgeData);
    this.edgeBuffer.unmap();

    this.updateBindGroups();
  }

  private updateBindGroups() {
    this.physicsBindGroup = this.device.createBindGroup({
      layout: this.physicsPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: this.nodeBuffer } },
        { binding: 2, resource: { buffer: this.edgeBuffer } },
      ],
    });

    this.renderBindGroup = this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: this.nodeBuffer } },
      ],
    });
  }

  private async initPipelines() {
    const physicsShader = await (await fetch("src/features/stalin/shaders/physics.wgsl")).text();
    const renderShader = await (await fetch("src/features/stalin/shaders/render.wgsl")).text();
    const textShader = await (await fetch("src/features/stalin/shaders/text.wgsl")).text();

    this.physicsPipeline = this.device.createComputePipeline({
      layout: "auto",
      compute: {
        module: this.device.createShaderModule({ code: physicsShader }),
        entryPoint: "main",
      },
    });

    this.renderPipeline = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: this.device.createShaderModule({ code: renderShader }),
        entryPoint: "vs_node",
      },
      fragment: {
        module: this.device.createShaderModule({ code: renderShader }),
        entryPoint: "fs_node",
        targets: [{ format: this.format }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    this.textPipeline = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: this.device.createShaderModule({ code: textShader }),
        entryPoint: "vs_text",
      },
      fragment: {
        module: this.device.createShaderModule({ code: textShader }),
        entryPoint: "fs_text",
        targets: [{ format: this.format }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  private hexToRgb(colorStr: string): [number, number, number] {
    // Simplified hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorStr);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0.5, 0.5, 0.5];
  }

  public render() {
    const commandEncoder = this.device.createCommandEncoder();
    
    // Physics Pass
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.physicsPipeline);
    computePass.setBindGroup(0, this.physicsBindGroup);
    computePass.dispatchWorkgroups(Math.ceil(this.nodeCount / 64));
    computePass.end();

    // Render Pass
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: this.context.getCurrentTexture().createView(),
        clearValue: { r: 0.05, g: 0.05, b: 0.05, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    
    renderPass.setPipeline(this.renderPipeline);
    renderPass.setBindGroup(0, this.renderBindGroup);
    renderPass.draw(6, this.nodeCount); // Draw nodes as quads
    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }
}
