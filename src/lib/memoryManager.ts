import * as THREE from 'three'

interface ManagedResource {
  id: string
  resource: THREE.Object3D | THREE.Material | THREE.Texture | THREE.BufferGeometry
  lastUsed: number
  priority: 'low' | 'medium' | 'high'
  size?: number
}

class MemoryManager {
  private resources = new Map<string, ManagedResource>()
  private maxMemoryUsage = 100 * 1024 * 1024 // 100MB default
  private cleanupInterval: NodeJS.Timeout | null = null
  private isCleanupRunning = false

  constructor(maxMemoryMB = 100) {
    this.maxMemoryUsage = maxMemoryMB * 1024 * 1024
    this.startCleanupInterval()
  }

  // Register a resource for management
  register(
    id: string, 
    resource: THREE.Object3D | THREE.Material | THREE.Texture | THREE.BufferGeometry,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): void {
    const size = this.estimateResourceSize(resource)
    
    this.resources.set(id, {
      id,
      resource,
      lastUsed: Date.now(),
      priority,
      size
    })

    // Trigger cleanup if memory usage is high
    this.checkMemoryUsage()
  }

  // Mark a resource as recently used
  touch(id: string): void {
    const resource = this.resources.get(id)
    if (resource) {
      resource.lastUsed = Date.now()
    }
  }

  // Manually dispose of a resource
  dispose(id: string): boolean {
    const managedResource = this.resources.get(id)
    if (!managedResource) return false

    this.disposeResource(managedResource.resource)
    this.resources.delete(id)
    return true
  }

  // Get current memory usage estimate
  getMemoryUsage(): number {
    let totalSize = 0
    this.resources.forEach(resource => {
      totalSize += resource.size || 0
    })
    return totalSize
  }

  // Force cleanup of unused resources
  cleanup(force = false): number {
    if (this.isCleanupRunning && !force) return 0

    this.isCleanupRunning = true
    let freedMemory = 0
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes

    // Sort resources by priority and last used time
    const sortedResources = Array.from(this.resources.values()).sort((a, b) => {
      const priorityWeight = { low: 1, medium: 2, high: 3 }
      const aPriority = priorityWeight[a.priority]
      const bPriority = priorityWeight[b.priority]
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority // Lower priority first
      }
      
      return a.lastUsed - b.lastUsed // Older first
    })

    // Remove old, low-priority resources
    for (const resource of sortedResources) {
      const age = now - resource.lastUsed
      const shouldRemove = force || 
        (age > maxAge && resource.priority === 'low') ||
        (age > maxAge * 2 && resource.priority === 'medium') ||
        this.getMemoryUsage() > this.maxMemoryUsage

      if (shouldRemove) {
        this.disposeResource(resource.resource)
        freedMemory += resource.size || 0
        this.resources.delete(resource.id)

        // Stop if we've freed enough memory
        if (!force && this.getMemoryUsage() < this.maxMemoryUsage * 0.8) {
          break
        }
      }
    }

    this.isCleanupRunning = false
    return freedMemory
  }

  // Dispose of all resources
  disposeAll(): void {
    this.resources.forEach(resource => {
      this.disposeResource(resource.resource)
    })
    this.resources.clear()
  }

  // Start automatic cleanup interval
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 30000) // Cleanup every 30 seconds
  }

  // Stop automatic cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.disposeAll()
  }

  // Check if memory usage is too high and trigger cleanup
  private checkMemoryUsage(): void {
    if (this.getMemoryUsage() > this.maxMemoryUsage) {
      this.cleanup()
    }
  }

  // Dispose of a Three.js resource properly
  private disposeResource(resource: THREE.Object3D | THREE.Material | THREE.Texture | THREE.BufferGeometry): void {
    if (resource instanceof THREE.Object3D) {
      // Dispose of object3D and its children
      resource.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        }
      })
      
      // Remove from parent
      if (resource.parent) {
        resource.parent.remove(resource)
      }
    } else if (resource instanceof THREE.Material) {
      resource.dispose()
    } else if (resource instanceof THREE.Texture) {
      resource.dispose()
    } else if (resource instanceof THREE.BufferGeometry) {
      resource.dispose()
    }
  }

  // Estimate the memory size of a resource
  private estimateResourceSize(resource: THREE.Object3D | THREE.Material | THREE.Texture | THREE.BufferGeometry): number {
    if (resource instanceof THREE.Texture) {
      const { width, height } = resource.image || { width: 512, height: 512 }
      return width * height * 4 // Assuming RGBA
    }
    
    if (resource instanceof THREE.BufferGeometry) {
      let size = 0
      const attributes = resource.attributes
      for (const key in attributes) {
        const attribute = attributes[key]
        size += attribute.array.byteLength
      }
      return size
    }
    
    if (resource instanceof THREE.Object3D) {
      let size = 0
      resource.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            size += this.estimateResourceSize(child.geometry)
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => {
                size += this.estimateResourceSize(material)
              })
            } else {
              size += this.estimateResourceSize(child.material)
            }
          }
        }
      })
      return size
    }
    
    // Default estimate for materials and other resources
    return 1024 // 1KB default
  }
}

// Global memory manager instance
export const memoryManager = new MemoryManager()

// Hook for using memory manager in React components
export function useMemoryManager() {
  return {
    register: memoryManager.register.bind(memoryManager),
    touch: memoryManager.touch.bind(memoryManager),
    dispose: memoryManager.dispose.bind(memoryManager),
    cleanup: memoryManager.cleanup.bind(memoryManager),
    getMemoryUsage: memoryManager.getMemoryUsage.bind(memoryManager)
  }
}

// Utility for creating managed Three.js scenes
export class ManagedScene extends THREE.Scene {
  private sceneId: string
  private managedObjects = new Set<string>()

  constructor(id: string) {
    super()
    this.sceneId = id
    memoryManager.register(id, this, 'high')
  }

  addManagedObject(object: THREE.Object3D, id?: string, priority: 'low' | 'medium' | 'high' = 'medium'): string {
    const objectId = id || `${this.sceneId}_${Date.now()}_${Math.random()}`
    
    this.add(object)
    memoryManager.register(objectId, object, priority)
    this.managedObjects.add(objectId)
    
    return objectId
  }

  removeManagedObject(id: string): boolean {
    if (this.managedObjects.has(id)) {
      memoryManager.dispose(id)
      this.managedObjects.delete(id)
      return true
    }
    return false
  }

  dispose(): void {
    // Dispose all managed objects
    this.managedObjects.forEach(id => {
      memoryManager.dispose(id)
    })
    this.managedObjects.clear()
    
    // Dispose the scene itself
    memoryManager.dispose(this.sceneId)
  }
}

// Cleanup function to be called when the app unmounts
export function cleanupMemoryManager(): void {
  memoryManager.destroy()
}