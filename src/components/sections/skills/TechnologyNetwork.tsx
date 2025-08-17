'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TechNode {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tool'
  proficiency: number
  connections: string[]
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface Connection {
  source: string
  target: string
  strength: number
}

const techNodes: TechNode[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', proficiency: 9, connections: ['nextjs', 'typescript', 'tailwind', 'nodejs'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 9, connections: ['react', 'typescript', 'vercel', 'prisma'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 9, connections: ['react', 'nextjs', 'nodejs', 'prisma'] },
  { id: 'tailwind', name: 'Tailwind', category: 'frontend', proficiency: 9, connections: ['react', 'nextjs', 'vue'] },
  { id: 'vue', name: 'Vue.js', category: 'frontend', proficiency: 7, connections: ['tailwind', 'nodejs'] },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 8, connections: ['react', 'typescript', 'express', 'mongodb', 'postgresql'] },
  { id: 'python', name: 'Python', category: 'backend', proficiency: 9, connections: ['selenium', 'beautifulsoup', 'scrapy', 'fastapi', 'postgresql'] },
  { id: 'express', name: 'Express.js', category: 'backend', proficiency: 8, connections: ['nodejs', 'mongodb', 'postgresql'] },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', proficiency: 7, connections: ['python', 'postgresql'] },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', proficiency: 8, connections: ['nodejs', 'python', 'prisma', 'docker'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', proficiency: 7, connections: ['nodejs', 'express'] },
  { id: 'redis', name: 'Redis', category: 'database', proficiency: 7, connections: ['nodejs', 'docker'] },
  { id: 'prisma', name: 'Prisma', category: 'database', proficiency: 8, connections: ['nextjs', 'typescript', 'postgresql'] },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'cloud', proficiency: 7, connections: ['docker', 'postgresql'] },
  { id: 'vercel', name: 'Vercel', category: 'cloud', proficiency: 8, connections: ['nextjs', 'react'] },
  { id: 'docker', name: 'Docker', category: 'cloud', proficiency: 8, connections: ['postgresql', 'redis', 'aws'] },

  // Tools & Automation
  { id: 'selenium', name: 'Selenium', category: 'tool', proficiency: 8, connections: ['python', 'puppeteer'] },
  { id: 'beautifulsoup', name: 'BeautifulSoup', category: 'tool', proficiency: 9, connections: ['python', 'scrapy'] },
  { id: 'scrapy', name: 'Scrapy', category: 'tool', proficiency: 8, connections: ['python', 'beautifulsoup'] },
  { id: 'puppeteer', name: 'Puppeteer', category: 'tool', proficiency: 8, connections: ['nodejs', 'selenium'] }
]

const categoryColors = {
  frontend: '#3B82F6',
  backend: '#10B981',
  database: '#8B5CF6',
  cloud: '#F59E0B',
  tool: '#EF4444'
}

interface TechnologyNetworkProps {
  className?: string
}

const TechnologyNetwork: React.FC<TechnologyNetworkProps> = ({ className = '' }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState<TechNode[]>([])
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    setIsClient(true)
    initializeNodes()
    startAnimation()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const initializeNodes = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 100

    const initializedNodes = techNodes.map((node, index) => {
      const angle = (index / techNodes.length) * 2 * Math.PI
      // Use deterministic positioning based on index
      const randomFactor = 0.5 + (Math.sin(index * 2.5) + 1) * 0.25
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius * randomFactor,
        y: centerY + Math.sin(angle) * radius * randomFactor,
        vx: 0,
        vy: 0
      }
    })

    setNodes(initializedNodes)
  }

  const startAnimation = () => {
    const animate = () => {
      updatePhysics()
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const updatePhysics = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setNodes(prevNodes => {
      const newNodes = [...prevNodes]
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Apply forces
      newNodes.forEach((node, i) => {
        if (typeof node.x !== 'number' || typeof node.y !== 'number') return
        
        const nodeX = node.x
        const nodeY = node.y

        let fx = 0
        let fy = 0

        // Repulsion from other nodes
        newNodes.forEach((other, j) => {
          if (i === j || typeof other.x !== 'number' || typeof other.y !== 'number') return
          
          const dx = nodeX - other.x
          const dy = nodeY - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance > 0 && distance < 150) {
            const force = 1000 / (distance * distance)
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        })

        // Attraction to connected nodes
        node.connections.forEach(connectedId => {
          const connectedNode = newNodes.find(n => n.id === connectedId)
          if (!connectedNode || typeof connectedNode.x !== 'number' || typeof connectedNode.y !== 'number') return

          const dx = connectedNode.x - nodeX
          const dy = connectedNode.y - nodeY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const idealDistance = 120

          if (distance > 0) {
            const force = (distance - idealDistance) * 0.01
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        })

        // Attraction to center
        const centerDx = centerX - nodeX
        const centerDy = centerY - nodeY
        const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy)
        
        if (centerDistance > 200) {
          fx += centerDx * 0.001
          fy += centerDy * 0.001
        }

        // Update velocity and position
        node.vx = (node.vx || 0) * 0.8 + fx * 0.1
        node.vy = (node.vy || 0) * 0.8 + fy * 0.1

        node.x += node.vx
        node.y += node.vy

        // Keep nodes within bounds
        const margin = 50
        node.x = Math.max(margin, Math.min(canvas.width - margin, node.x))
        node.y = Math.max(margin, Math.min(canvas.height - margin, node.y))
      })

      return newNodes
    })
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    nodes.forEach(node => {
      if (typeof node.x !== 'number' || typeof node.y !== 'number') return
      
      const nodeX = node.x
      const nodeY = node.y

      node.connections.forEach(connectedId => {
        const connectedNode = nodes.find(n => n.id === connectedId)
        if (!connectedNode || typeof connectedNode.x !== 'number' || typeof connectedNode.y !== 'number') return

        const isHighlighted = selectedNode === node.id || selectedNode === connectedId ||
                             hoveredNode === node.id || hoveredNode === connectedId

        ctx.strokeStyle = isHighlighted ? '#60A5FA' : '#374151'
        ctx.lineWidth = isHighlighted ? 2 : 1
        ctx.globalAlpha = isHighlighted ? 0.8 : 0.3

        ctx.beginPath()
        ctx.moveTo(nodeX, nodeY)
        ctx.lineTo(connectedNode.x, connectedNode.y)
        ctx.stroke()
      })
    })

    // Draw nodes
    nodes.forEach(node => {
      if (typeof node.x !== 'number' || typeof node.y !== 'number') return
      
      const nodeX = node.x
      const nodeY = node.y

      const isSelected = selectedNode === node.id
      const isHovered = hoveredNode === node.id
      const isHighlighted = isSelected || isHovered || 
                           (selectedNode && node.connections.includes(selectedNode))

      const radius = isHighlighted ? 25 : 20
      const color = categoryColors[node.category]

      // Node background
      ctx.globalAlpha = isHighlighted ? 1 : 0.8
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(nodeX, nodeY, radius, 0, 2 * Math.PI)
      ctx.fill()

      // Node border
      ctx.strokeStyle = isSelected ? '#FFFFFF' : color
      ctx.lineWidth = isSelected ? 3 : 1
      ctx.stroke()

      // Node text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `${isHighlighted ? '12px' : '10px'} Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalAlpha = 1

      // Wrap text for longer names
      const words = node.name.split(' ')
      if (words.length > 1 && node.name.length > 8) {
        ctx.fillText(words[0], nodeX, nodeY - 4)
        ctx.fillText(words.slice(1).join(' '), nodeX, nodeY + 6)
      } else {
        ctx.fillText(node.name, nodeX, nodeY)
      }
    })

    ctx.globalAlpha = 1
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked node
    const clickedNode = nodes.find(node => {
      if (typeof node.x !== 'number' || typeof node.y !== 'number') return false
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= 25
    })

    setSelectedNode(clickedNode ? clickedNode.id : null)
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find hovered node
    const hoveredNode = nodes.find(node => {
      if (typeof node.x !== 'number' || typeof node.y !== 'number') return false
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= 25
    })

    setHoveredNode(hoveredNode ? hoveredNode.id : null)
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default'
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Technology Network</h3>
        <p className="text-gray-400">Interactive network showing relationships between technologies</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Network Visualization */}
        <div className="flex-1">
          <div className="relative bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
            {isClient ? (
              <canvas
                ref={canvasRef}
                width={600}
                height={500}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                className="w-full h-auto cursor-pointer"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-800/30 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading network visualization...</div>
              </div>
            )}
            
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-2">Categories</div>
              {Object.entries(categoryColors).map(([category, color]) => (
                <div key={category} className="flex items-center space-x-2 text-xs text-gray-300 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <span className="capitalize">{category}</span>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
              <div className="text-xs text-gray-400">
                Click nodes to explore connections
              </div>
            </div>
          </div>
        </div>

        {/* Node Details */}
        <div className="lg:w-80">
          <h4 className="text-lg font-semibold text-white mb-4">
            {selectedNodeData ? 'Technology Details' : 'Technology Overview'}
          </h4>
          
          {selectedNodeData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: categoryColors[selectedNodeData.category] }}
                  ></div>
                  <div>
                    <div className="text-white font-medium">{selectedNodeData.name}</div>
                    <div className="text-sm text-gray-400 capitalize">{selectedNodeData.category}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Proficiency</span>
                    <span className="text-white">{selectedNodeData.proficiency}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${selectedNodeData.proficiency * 10}%`,
                        backgroundColor: categoryColors[selectedNodeData.category]
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">Connected Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeData.connections.map(connId => {
                      const connectedNode = nodes.find(n => n.id === connId)
                      return connectedNode ? (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(connId)}
                          className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs hover:bg-gray-600/50 transition-colors"
                        >
                          {connectedNode.name}
                        </button>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-3">Network Statistics</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Technologies</span>
                    <span className="text-white">{techNodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Categories</span>
                    <span className="text-white">{Object.keys(categoryColors).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Connections</span>
                    <span className="text-white">
                      {techNodes.reduce((sum, node) => sum + node.connections.length, 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                This network shows the relationships between technologies in my stack. 
                Connected technologies are often used together in projects. Click any node to explore its connections.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TechnologyNetwork