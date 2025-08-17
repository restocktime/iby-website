'use client'

import { useState, useEffect } from 'react'
import { ABTest, ABTestVariant } from '@/types/analytics'
import { getABTesting } from '@/lib/abTesting'

interface ABTestFormData {
  name: string
  description: string
  component: string
  targetMetric: string
  variants: Array<{
    name: string
    description: string
    traffic: number
    isControl: boolean
  }>
}

export function ABTestManager() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<ABTestFormData>({
    name: '',
    description: '',
    component: '',
    targetMetric: 'conversion_rate',
    variants: [
      { name: 'Control', description: '', traffic: 50, isControl: true },
      { name: 'Variant A', description: '', traffic: 50, isControl: false }
    ]
  })

  const abTesting = getABTesting()

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const testsData = await abTesting.getAllTests()
      setTests(testsData)
    } catch (error) {
      console.error('Failed to fetch A/B tests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const testId = await abTesting.createTest({
        name: formData.name,
        description: formData.description,
        component: formData.component,
        startDate: new Date(),
        status: 'draft',
        variants: formData.variants.map((v, index) => ({
          id: `variant_${index + 1}`,
          name: v.name,
          description: v.description,
          traffic: v.traffic,
          conversions: 0,
          conversionRate: 0,
          isControl: v.isControl,
          isActive: true
        })),
        targetMetric: formData.targetMetric,
        significance: 0
      })

      await fetchTests()
      setShowCreateForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create A/B test:', error)
    }
  }

  const handleStartTest = async (testId: string) => {
    try {
      await abTesting.updateTest(testId, { 
        status: 'running',
        startDate: new Date()
      })
      await fetchTests()
    } catch (error) {
      console.error('Failed to start test:', error)
    }
  }

  const handlePauseTest = async (testId: string) => {
    try {
      await abTesting.updateTest(testId, { status: 'paused' })
      await fetchTests()
    } catch (error) {
      console.error('Failed to pause test:', error)
    }
  }

  const handleCompleteTest = async (testId: string) => {
    try {
      await abTesting.updateTest(testId, { 
        status: 'completed',
        endDate: new Date()
      })
      await fetchTests()
    } catch (error) {
      console.error('Failed to complete test:', error)
    }
  }

  const addVariant = () => {
    const newVariant = {
      name: `Variant ${String.fromCharCode(65 + formData.variants.length - 1)}`,
      description: '',
      traffic: 0,
      isControl: false
    }
    
    // Redistribute traffic equally
    const totalVariants = formData.variants.length + 1
    const equalTraffic = Math.floor(100 / totalVariants)
    const remainder = 100 - (equalTraffic * totalVariants)
    
    const updatedVariants = formData.variants.map((v, index) => ({
      ...v,
      traffic: equalTraffic + (index === 0 ? remainder : 0)
    }))
    
    setFormData({
      ...formData,
      variants: [...updatedVariants, { ...newVariant, traffic: equalTraffic }]
    })
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 2) return // Minimum 2 variants
    
    const updatedVariants = formData.variants.filter((_, i) => i !== index)
    
    // Redistribute traffic
    const totalVariants = updatedVariants.length
    const equalTraffic = Math.floor(100 / totalVariants)
    const remainder = 100 - (equalTraffic * totalVariants)
    
    const redistributedVariants = updatedVariants.map((v, i) => ({
      ...v,
      traffic: equalTraffic + (i === 0 ? remainder : 0)
    }))
    
    setFormData({
      ...formData,
      variants: redistributedVariants
    })
  }

  const updateVariantTraffic = (index: number, traffic: number) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[index].traffic = traffic
    
    setFormData({
      ...formData,
      variants: updatedVariants
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      component: '',
      targetMetric: 'conversion_rate',
      variants: [
        { name: 'Control', description: '', traffic: 50, isControl: true },
        { name: 'Variant A', description: '', traffic: 50, isControl: false }
      ]
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">A/B Test Manager</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create New Test
        </button>
      </div>

      {/* Test List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Active Tests</h3>
        </div>
        
        {tests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No A/B tests found. Create your first test to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tests.map((test) => (
              <div key={test.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium">{test.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{test.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Component: {test.component}</span>
                      <span>Target: {test.targetMetric}</span>
                      <span>Variants: {test.variants.length}</span>
                      {test.significance > 0 && (
                        <span>Significance: {(test.significance * 100).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {test.status === 'draft' && (
                      <button
                        onClick={() => handleStartTest(test.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Start
                      </button>
                    )}
                    
                    {test.status === 'running' && (
                      <>
                        <button
                          onClick={() => handlePauseTest(test.id)}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => handleCompleteTest(test.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    
                    {test.status === 'paused' && (
                      <button
                        onClick={() => handleStartTest(test.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Resume
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      View Results
                    </button>
                  </div>
                </div>
                
                {/* Variant Performance */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {test.variants.map((variant) => (
                    <div key={variant.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{variant.name}</h5>
                        {variant.isControl && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Control</span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <p>Traffic: {variant.traffic}%</p>
                        <p>Conversions: {variant.conversions}</p>
                        <p>Rate: {variant.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New A/B Test</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Test Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Component</label>
                  <select
                    value={formData.component}
                    onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Component</option>
                    <option value="HeroSection">Hero Section</option>
                    <option value="ContactForm">Contact Form</option>
                    <option value="ProjectCard">Project Card</option>
                    <option value="Navigation">Navigation</option>
                    <option value="CallToAction">Call to Action</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Metric</label>
                  <select
                    value={formData.targetMetric}
                    onChange={(e) => setFormData({ ...formData, targetMetric: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="conversion_rate">Conversion Rate</option>
                    <option value="click_through_rate">Click Through Rate</option>
                    <option value="engagement_rate">Engagement Rate</option>
                    <option value="form_completion_rate">Form Completion Rate</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Variants</label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    Add Variant
                  </button>
                </div>
                
                <div className="mt-2 space-y-3">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => {
                            const updatedVariants = [...formData.variants]
                            updatedVariants[index].name = e.target.value
                            setFormData({ ...formData, variants: updatedVariants })
                          }}
                          className="font-medium bg-transparent border-none focus:outline-none"
                          placeholder="Variant name"
                        />
                        
                        <div className="flex items-center space-x-2">
                          {variant.isControl && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Control</span>
                          )}
                          {formData.variants.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <textarea
                        value={variant.description}
                        onChange={(e) => {
                          const updatedVariants = [...formData.variants]
                          updatedVariants[index].description = e.target.value
                          setFormData({ ...formData, variants: updatedVariants })
                        }}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Variant description"
                        rows={2}
                      />
                      
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500">Traffic Allocation (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={variant.traffic}
                          onChange={(e) => updateVariantTraffic(index, parseInt(e.target.value) || 0)}
                          className="mt-1 w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  Total traffic allocation: {formData.variants.reduce((sum, v) => sum + v.traffic, 0)}%
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Results Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{selectedTest.name} - Results</h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium">Status</h4>
                  <p className={`text-lg font-bold ${selectedTest.status === 'running' ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedTest.status.toUpperCase()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium">Statistical Significance</h4>
                  <p className="text-lg font-bold">{(selectedTest.significance * 100).toFixed(1)}%</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium">Winner</h4>
                  <p className="text-lg font-bold">
                    {selectedTest.winner || 'No clear winner yet'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Variant Performance</h4>
                <div className="space-y-3">
                  {selectedTest.variants.map((variant) => (
                    <div key={variant.id} className="border border-gray-200 rounded p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{variant.name}</h5>
                          {variant.isControl && (
                            <span className="text-sm text-blue-600">Control Group</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{variant.conversionRate.toFixed(2)}%</p>
                          <p className="text-sm text-gray-500">{variant.conversions} conversions</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${variant.traffic}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Traffic: {variant.traffic}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}