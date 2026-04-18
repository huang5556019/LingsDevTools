import React, { ReactNode } from 'react'

interface ToolContainerProps {
  title: string
  children: ReactNode
  description?: string
}

function ToolContainer({ title, children, description }: ToolContainerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolContainer
