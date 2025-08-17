import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sampleProjects as staticProjects } from '@/data/projects'
import { Project } from '@/types'

// In-memory storage for demo purposes
// In production, this would use a database
const projects: Project[] = [...staticProjects]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectData = await request.json()
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      ...projectData,
      caseStudy: {
        challenge: '',
        solution: '',
        results: [],
        testimonial: null
      }
    }

    projects.push(newProject)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}