import React from 'react'
import Navigation from '../components/layout/Navigation'
import GovernmentSchemes from '../components/government/GovernmentSchemes'

export default function SchemesPage() {
  return (
    <div className="min-h-screen bg-farmland text-gray-900 dark:text-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Government Schemes & Subsidies</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore all available agricultural support programs, subsidies, and MSPs.</p>
        </div>
        <GovernmentSchemes isDashboard={false} />
      </main>
    </div>
  )
}
