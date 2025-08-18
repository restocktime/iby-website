'use client'

import { useEffect, useRef, useState } from 'react'

// WebGPU type declarations (since they may not be available in all environments)
declare global {
  interface Navigator {
    gpu?: GPU
  }
  
  interface GPU {
    requestAdapter(options?: any): Promise<GPUAdapter | null>
    getPreferredCanvasFormat(): any
  }
  
  interface GPUAdapter {
    requestDevice(descriptor?: any): Promise<GPUDevice>
  }
  
  type GPUDevice = any
  type GPUCanvasContext = any
  type GPUComputePipeline = any
  type GPURenderPipeline = any
  type GPUBuffer = any
  type GPUBindGroup = any
  type GPUCommandEncoder = any
  type GPURenderPassEncoder = any
  type GPUComputePassEncoder = any
  type GPUBindGroupLayout = any
  type GPUShaderModule = any
  
  var GPUBufferUsage: {
    STORAGE: number
    COPY_DST: number
    COPY_SRC: number
    UNIFORM: number
    VERTEX: number
    INDEX: number
    MAP_READ: number
    MAP_WRITE: number
  }
}

// WebGPU Compute Shader for Boids
const COMPUTE_SHADER_SOURCE = `
struct Boid {
  position: vec2<f32>,
  velocity: vec2<f32>
}

struct SimParams {
  deltaTime: f32,
  rule1Distance: f32,    // separation
  rule2Distance: f32,    // alignment  
  rule3Distance: f32,    // cohesion
  rule1Scale: f32,       // separation weight
  rule2Scale: f32,       // alignment weight
  rule3Scale: f32,       // cohesion weight
  maxSpeed: f32,
  mouseX: f32,
  mouseY: f32,
  mouseActive: f32,
  mouseRadius: f32,
  mouseForce: f32,
  canvasWidth: f32,
  canvasHeight: f32,
  padding: f32
}

@group(0) @binding(0) var<uniform> params: SimParams;
@group(0) @binding(1) var<storage, read> boidsIn: array<Boid>;
@group(0) @binding(2) var<storage, read_write> boidsOut: array<Boid>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  if (index >= arrayLength(&boidsIn)) {
    return;
  }

  let boid = boidsIn[index];
  var pos = boid.position;
  var vel = boid.velocity;

  // Boids algorithm
  var sep = vec2<f32>(0.0, 0.0);
  var ali = vec2<f32>(0.0, 0.0);
  var coh = vec2<f32>(0.0, 0.0);
  
  var sepCount = 0u;
  var aliCount = 0u;
  var cohCount = 0u;

  // Check all other boids
  for (var i = 0u; i < arrayLength(&boidsIn); i++) {
    if (i == index) {
      continue;
    }

    let other = boidsIn[i];
    let dist = distance(pos, other.position);

    // Separation
    if (dist < params.rule1Distance && dist > 0.0) {
      let diff = normalize(pos - other.position);
      sep = sep + diff / dist;
      sepCount++;
    }

    // Alignment
    if (dist < params.rule2Distance && dist > 0.0) {
      ali = ali + other.velocity;
      aliCount++;
    }

    // Cohesion
    if (dist < params.rule3Distance && dist > 0.0) {
      coh = coh + other.position;
      cohCount++;
    }
  }

  // Apply separation
  if (sepCount > 0u) {
    sep = sep / f32(sepCount);
    sep = normalize(sep) * params.maxSpeed - vel;
    sep = normalize(sep) * min(length(sep), 0.03);
  }

  // Apply alignment
  if (aliCount > 0u) {
    ali = ali / f32(aliCount);
    ali = normalize(ali) * params.maxSpeed - vel;
    ali = normalize(ali) * min(length(ali), 0.03);
  }

  // Apply cohesion
  if (cohCount > 0u) {
    coh = coh / f32(cohCount);
    coh = coh - pos;
    coh = normalize(coh) * params.maxSpeed - vel;
    coh = normalize(coh) * min(length(coh), 0.03);
  }

  // Mouse interaction
  var mouseForce = vec2<f32>(0.0, 0.0);
  if (params.mouseActive > 0.5) {
    let mousePos = vec2<f32>(params.mouseX, params.mouseY);
    let mouseDist = distance(pos, mousePos);
    if (mouseDist < params.mouseRadius && mouseDist > 0.0) {
      let seek = normalize(mousePos - pos) * params.maxSpeed - vel;
      mouseForce = normalize(seek) * min(length(seek), params.mouseForce);
    }
  }

  // Apply forces with weights
  vel = vel + sep * params.rule1Scale + ali * params.rule2Scale + coh * params.rule3Scale + mouseForce;

  // Limit velocity
  if (length(vel) > params.maxSpeed) {
    vel = normalize(vel) * params.maxSpeed;
  }

  // Update position
  pos = pos + vel * params.deltaTime;

  // Wrap around edges
  if (pos.x < 0.0) {
    pos.x = params.canvasWidth;
  } else if (pos.x > params.canvasWidth) {
    pos.x = 0.0;
  }

  if (pos.y < 0.0) {
    pos.y = params.canvasHeight;
  } else if (pos.y > params.canvasHeight) {
    pos.y = 0.0;
  }

  boidsOut[index] = Boid(pos, vel);
}
`

// Vertex shader for rendering
const VERTEX_SHADER_SOURCE = `
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>
}

struct Boid {
  position: vec2<f32>,
  velocity: vec2<f32>
}

struct RenderParams {
  canvasWidth: f32,
  canvasHeight: f32,
  pointSize: f32,
  opacity: f32
}

@group(0) @binding(0) var<uniform> renderParams: RenderParams;
@group(0) @binding(1) var<storage, read> boids: array<Boid>;

@vertex
fn vs_main(@builtin(instance_index) instanceIdx: u32) -> VertexOutput {
  let boid = boids[instanceIdx];
  
  // Convert to NDC coordinates
  let x = (boid.position.x / renderParams.canvasWidth) * 2.0 - 1.0;
  let y = -((boid.position.y / renderParams.canvasHeight) * 2.0 - 1.0);
  
  var output: VertexOutput;
  output.position = vec4<f32>(x, y, 0.0, 1.0);
  
  // Color based on velocity
  let speed = length(boid.velocity);
  let normalizedSpeed = min(speed / 2.0, 1.0);
  output.color = vec4<f32>(1.0, 1.0 - normalizedSpeed * 0.3, 1.0 - normalizedSpeed * 0.5, renderParams.opacity);
  
  return output;
}
`

// Fragment shader
const FRAGMENT_SHADER_SOURCE = `
@fragment
fn fs_main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
  return color;
}
`

interface WebGPUBoidsProps {
  particleCount?: number
  color?: string
  opacity?: number
  followMouse?: boolean
  onInitError?: () => void
}

interface WebGPUBoids {
  device: GPUDevice
  context: GPUCanvasContext
  computePipeline: GPUComputePipeline
  renderPipeline: GPURenderPipeline
  buffers: {
    boids: [GPUBuffer, GPUBuffer]
    simParams: GPUBuffer
    renderParams: GPUBuffer
  }
  bindGroups: {
    compute: [GPUBindGroup, GPUBindGroup]
    render: [GPUBindGroup, GPUBindGroup]
  }
  currentBufferIndex: number
}

export default function WebGPUBoids({ 
  particleCount = 1500,
  color = '#ffffff',
  opacity = 0.8,
  followMouse = true,
  onInitError
}: WebGPUBoidsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const webGPURef = useRef<WebGPUBoids | null>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const [initialized, setInitialized] = useState(false)

  // Mouse tracking
  useEffect(() => {
    if (!followMouse || !canvasRef.current) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      mouseRef.current.x = event.clientX - rect.left
      mouseRef.current.y = event.clientY - rect.top
      mouseRef.current.isActive = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    const canvas = canvasRef.current
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [followMouse])

  // Initialize WebGPU
  useEffect(() => {
    const initWebGPU = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        if (!navigator.gpu) {
          throw new Error('WebGPU not supported')
        }

        const adapter = await navigator.gpu.requestAdapter()
        if (!adapter) {
          throw new Error('Failed to get WebGPU adapter')
        }

        const device = await adapter.requestDevice()
        const context = canvas.getContext('webgpu') as GPUCanvasContext
        
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
        context.configure({
          device,
          format: canvasFormat,
          alphaMode: 'premultiplied'
        })

        // Create compute shader module
        const computeShaderModule = device.createShaderModule({
          label: 'Boids Compute Shader',
          code: COMPUTE_SHADER_SOURCE
        })

        // Create render shader modules
        const vertexShaderModule = device.createShaderModule({
          label: 'Boids Vertex Shader', 
          code: VERTEX_SHADER_SOURCE
        })

        const fragmentShaderModule = device.createShaderModule({
          label: 'Boids Fragment Shader',
          code: FRAGMENT_SHADER_SOURCE
        })

        // Create buffers
        const boidStride = 4 * 4 // 2 vec2f32 = 4 floats * 4 bytes
        const boidBufferSize = particleCount * boidStride

        const boidBufferA = device.createBuffer({
          label: 'Boid Buffer A',
          size: boidBufferSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        })

        const boidBufferB = device.createBuffer({
          label: 'Boid Buffer B', 
          size: boidBufferSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        })

        // Initialize boids data
        const initialBoidData = new Float32Array(particleCount * 4)
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 4
          initialBoidData[idx] = Math.random() * canvas.width     // position.x
          initialBoidData[idx + 1] = Math.random() * canvas.height // position.y
          initialBoidData[idx + 2] = (Math.random() - 0.5) * 2    // velocity.x
          initialBoidData[idx + 3] = (Math.random() - 0.5) * 2    // velocity.y
        }

        device.queue.writeBuffer(boidBufferA, 0, initialBoidData)
        device.queue.writeBuffer(boidBufferB, 0, initialBoidData)

        // Simulation parameters buffer
        const simParamsBuffer = device.createBuffer({
          label: 'Simulation Params',
          size: 16 * 4, // 16 floats
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })

        // Render parameters buffer
        const renderParamsBuffer = device.createBuffer({
          label: 'Render Params',
          size: 4 * 4, // 4 floats
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })

        // Create compute pipeline
        const computePipeline = device.createComputePipeline({
          label: 'Boids Compute Pipeline',
          layout: 'auto',
          compute: {
            module: computeShaderModule,
            entryPoint: 'main'
          }
        })

        // Create render pipeline
        const renderPipeline = device.createRenderPipeline({
          label: 'Boids Render Pipeline',
          layout: 'auto',
          vertex: {
            module: vertexShaderModule,
            entryPoint: 'vs_main'
          },
          fragment: {
            module: fragmentShaderModule,
            entryPoint: 'fs_main',
            targets: [{
              format: canvasFormat,
              blend: {
                color: {
                  srcFactor: 'src-alpha',
                  dstFactor: 'one-minus-src-alpha'
                },
                alpha: {
                  srcFactor: 'one',
                  dstFactor: 'one-minus-src-alpha'
                }
              }
            }]
          },
          primitive: {
            topology: 'point-list'
          }
        })

        // Create bind groups for ping-pong buffers
        const computeBindGroupA = device.createBindGroup({
          label: 'Compute Bind Group A',
          layout: computePipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: simParamsBuffer } },
            { binding: 1, resource: { buffer: boidBufferA } },
            { binding: 2, resource: { buffer: boidBufferB } }
          ]
        })

        const computeBindGroupB = device.createBindGroup({
          label: 'Compute Bind Group B',
          layout: computePipeline.getBindGroupLayout(0), 
          entries: [
            { binding: 0, resource: { buffer: simParamsBuffer } },
            { binding: 1, resource: { buffer: boidBufferB } },
            { binding: 2, resource: { buffer: boidBufferA } }
          ]
        })

        const renderBindGroupA = device.createBindGroup({
          label: 'Render Bind Group A',
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: renderParamsBuffer } },
            { binding: 1, resource: { buffer: boidBufferA } }
          ]
        })

        const renderBindGroupB = device.createBindGroup({
          label: 'Render Bind Group B',
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: renderParamsBuffer } },
            { binding: 1, resource: { buffer: boidBufferB } }
          ]
        })

        webGPURef.current = {
          device,
          context,
          computePipeline,
          renderPipeline,
          buffers: {
            boids: [boidBufferA, boidBufferB],
            simParams: simParamsBuffer,
            renderParams: renderParamsBuffer
          },
          bindGroups: {
            compute: [computeBindGroupA, computeBindGroupB],
            render: [renderBindGroupA, renderBindGroupB]
          },
          currentBufferIndex: 0
        }

        setInitialized(true)

      } catch (error) {
        console.error('Failed to initialize WebGPU:', error)
        if (onInitError) {
          onInitError()
        }
      }
    }

    initWebGPU()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, onInitError])

  // Animation loop
  useEffect(() => {
    if (!initialized || !webGPURef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const webgpu = webGPURef.current

    const animate = (time: number) => {
      // Update simulation parameters
      const simParams = new Float32Array([
        0.016,                    // deltaTime (60 FPS)
        25.0,                     // rule1Distance (separation)
        50.0,                     // rule2Distance (alignment)
        50.0,                     // rule3Distance (cohesion)
        2.0,                      // rule1Scale (separation weight)
        1.0,                      // rule2Scale (alignment weight)
        1.0,                      // rule3Scale (cohesion weight)
        2.0,                      // maxSpeed
        mouseRef.current.x,       // mouseX
        mouseRef.current.y,       // mouseY
        mouseRef.current.isActive ? 1.0 : 0.0, // mouseActive
        100.0,                    // mouseRadius
        0.5,                      // mouseForce
        canvas.width,             // canvasWidth
        canvas.height,            // canvasHeight
        0.0                       // padding
      ])

      webgpu.device.queue.writeBuffer(webgpu.buffers.simParams, 0, simParams)

      // Update render parameters
      const renderParams = new Float32Array([
        canvas.width,
        canvas.height,
        2.0,      // point size
        opacity
      ])

      webgpu.device.queue.writeBuffer(webgpu.buffers.renderParams, 0, renderParams)

      // Create command encoder
      const commandEncoder = webgpu.device.createCommandEncoder()

      // Compute pass
      const computePass = commandEncoder.beginComputePass()
      computePass.setPipeline(webgpu.computePipeline)
      computePass.setBindGroup(0, webgpu.bindGroups.compute[webgpu.currentBufferIndex])
      
      const workgroupCount = Math.ceil(particleCount / 64)
      computePass.dispatchWorkgroups(workgroupCount)
      computePass.end()

      // Render pass
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: webgpu.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear' as const,
          storeOp: 'store' as const
        }]
      })

      renderPass.setPipeline(webgpu.renderPipeline)
      renderPass.setBindGroup(0, webgpu.bindGroups.render[1 - webgpu.currentBufferIndex])
      renderPass.draw(1, particleCount)
      renderPass.end()

      // Submit commands
      webgpu.device.queue.submit([commandEncoder.finish()])

      // Ping-pong buffers
      webgpu.currentBufferIndex = 1 - webgpu.currentBufferIndex

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initialized, opacity, particleCount])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const canvas = entry.target as HTMLCanvasElement
        canvas.width = entry.contentBoxSize[0].inlineSize * window.devicePixelRatio
        canvas.height = entry.contentBoxSize[0].blockSize * window.devicePixelRatio
      }
    })

    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        mixBlendMode: 'screen'
      }}
    />
  )
}