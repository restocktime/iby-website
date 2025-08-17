'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Project } from '@/types'

interface ProjectNetworkProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

interface NetworkNode {
  id: string
  project: Project
  x: number
  y: number
  connections: string[]
}

interface NetworkConnection {
  from: string
  to: string
  strength: number
}

export function ProjectNetwork({ projects, onProjectClick }: ProjectNetworkProps) {
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [connections, setConnections] = useState<NetworkConnection[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(rect.width, rect.height) * 0.35

    // Create nodes with circular positioning
    const newNodes: NetworkNode[] = projects.map((project, index) => {
      const angle = (index / projects.length) * 2 * Math.PI
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      return {
        id: project.id,
        project,
        x,
        y,
        connections: []
      }
    })

    // Calculate connections based on shared technologies
    const newConnections: NetworkConnection[] = []
    
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const nodeA = newNodes[i]
        const nodeB = newNodes[j]
        
        const sharedTechs = nodeA.project.technologies.filter(techA =>
          nodeB.project.technologies.some(techB => techA.name === techB.name)
        )
        
        if (sharedTechs.length > 0) {
          const strength = sharedTechs.length / Math.max(
            nodeA.project.technologies.length,
            nodeB.project.technologies.length
          )
          
          newConnections.push({
            from: nodeA.id,
            to: nodeB.id,
            strength
          })
          
          nodeA.connections.push(nodeB.id)
          nodeB.connections.push(nodeA.id)
        }
      }
    }

    setNodes(newNodes)
    setConnections(newConnections)
  }, [projects])

  const getNodeSize = (project: Project) => {
    const baseSize = 60
    const complexityMultiplier = project.metrics.technicalComplexity / 10
    const featuredMultiplier = project.featured ? 1.3 : 1
    return baseSize * (0.7 + complexityMultiplier * 0.3) * featuredMultiplier
  }

  const getConnectionOpacity = (connection: NetworkConnection) => {
    if (!hoveredNode) return 0.1
    if (connection.from === hoveredNode || connection.to === hoveredNode) {
      return Math.max(0.3, connection.strength)
    }
    return 0.05
  }

  const getNodeOpacity = (nodeId: string) => {
    if (!hoveredNode) return 1
    if (nodeId === hoveredNode) return 1
    
    const hoveredConnections = connections.filter(
      conn => conn.from === hoveredNode || conn.to === hoveredNode
    )
    const isConnected = hoveredConnections.some(
      conn => conn.from === nodeId || conn.to === nodeId
    )
    
    return isConnected ? 1 : 0.3
  }

  const getCategoryColor = (category: Project['category']) => {
    const colors = {
      'web-development': 'from-blue-500 to-cyan-500',
      'automation': 'from-green-500 to-emerald-500',
      'crm': 'from-purple-500 to-violet-500',
      'analytics': 'from-orange-500 to-red-500',
      'e-commerce': 'from-pink-500 to-rose-500',
      'scraping': 'from-yellow-500 to-amber-500',
      'monitoring': 'from-indigo-500 to-blue-500'
    }
    return colors[category] || 'from-slate-500 to-slate-600'
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => {
          const fromNode = nodes.find(n => n.id === connection.from)
          const toNode = nodes.find(n => n.id === connection.to)
          
          if (!fromNode || !toNode) return null
          
          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="url(#connectionGradient)"
              strokeWidth={2 + connection.strength * 3}
              opacity={getConnectionOpacity(connection)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            />
          )
        })}
        
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          className="absolute cursor-pointer group"
          style={{
            left: node.x - getNodeSize(node.project) / 2,
            top: node.y - getNodeSize(node.project) / 2,
            width: getNodeSize(node.project),
            height: getNodeSize(node.project)
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: getNodeOpacity(node.id)
          }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => onProjectClick(node.project)}
        >
          {/* Node Circle */}
          <div className={`
            w-full h-full rounded-full bg-gradient-to-br ${getCategoryColor(node.project.category)}
            shadow-lg group-hover:shadow-2xl transition-all duration-300
            flex items-center justify-center relative overflow-hidden
          `}>
            {/* Project Image */}
            {node.project.screenshots[0] && (
              <img
                src={node.project.screenshots[0].url}
                alt={node.project.screenshots[0].alt}
                className="w-full h-full object-cover rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-full" />
            
            {/* Featured Badge */}
            {node.project.featured && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                ⭐
              </div>
            )}
            
            {/* Status Indicator */}
            <div className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
              ${node.project.status === 'active' ? 'bg-green-500' : 
                node.project.status === 'ongoing' ? 'bg-blue-500' : 'bg-slate-400'}
            `} />
          </div>

          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 whitespace-nowrap">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {node.project.title}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {node.project.technologies.slice(0, 3).map(tech => tech.name).join(', ')}
                {node.project.technologies.length > 3 && '...'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Complexity: {node.project.metrics.technicalComplexity}/10
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-900 dark:text-white mb-2">Network Legend</div>
        <div className="space-y-1 text-slate-600 dark:text-slate-400">
          <div>• Node size = Technical complexity</div>
          <div>• Connections = Shared technologies</div>
          <div>• Hover to highlight connections</div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="font-semibold text-slate-900 dark:text-white mb-2">Categories</div>
        <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <span>Web Dev</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
            <span>Automation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
            <span>CRM</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
            <span>Analytics</span>
          </div>
        </div>
      </div>
    </div>
  )
}