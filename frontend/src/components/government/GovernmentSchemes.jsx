import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import MSPCard from './MSPCard'
import SchemeCard from './SchemeCard'
import SearchBar from './SearchBar'

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
}

function SchemeSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-2 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function GovernmentSchemes() {
  const [msp,           setMsp]           = useState([])
  const [schemes,       setSchemes]       = useState([])
  const [mspLoading,    setMspLoading]    = useState(true)
  const [schemesLoading,setSchemesLoading]= useState(true)
  const [mspError,      setMspError]      = useState(false)
  const [schemesError,  setSchemesError]  = useState(false)
  const [query,         setQuery]         = useState('')
  const [category,      setCategory]      = useState('All Categories')
  const [state,         setState]         = useState('All States')

  useEffect(() => {
    axios.get('/api/government/msp')
      .then((r) => setMsp(r.data))
      .catch(() => setMspError(true))
      .finally(() => setMspLoading(false))
  }, [])

  const fetchSchemes = useCallback(() => {
    setSchemesLoading(true)
    setSchemesError(false)
    const params = {}
    if (query)                              params.q        = query
    if (category !== 'All Categories')      params.category = category
    if (state    !== 'All States')          params.state    = state

    const endpoint = (query || category !== 'All Categories' || state !== 'All States')
      ? '/api/government/search'
      : '/api/government/schemes'

    axios.get(endpoint, { params })
      .then((r) => setSchemes(r.data))
      .catch(() => setSchemesError(true))
      .finally(() => setSchemesLoading(false))
  }, [query, category, state])

  useEffect(() => {
    const t = setTimeout(fetchSchemes, 350)
    return () => clearTimeout(t)
  }, [fetchSchemes])

  return (
    <div className="space-y-6">

      {/* MSP Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Government Prices</p>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Minimum Support Prices <span className="text-green-600 dark:text-green-400">(MSP)</span>
            </h3>
          </div>
          <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
            2024–25
          </span>
        </div>

        {mspLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        )}

        {!mspLoading && mspError && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Unable to load MSP data.</p>
          </div>
        )}

        {!mspLoading && !mspError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {msp.map((item) => <MSPCard key={item.commodity} {...item} />)}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* Schemes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Central & State</p>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Government <span className="text-blue-600 dark:text-blue-400">Schemes</span>
            </h3>
          </div>
          {!schemesLoading && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
              {schemes.length} Scheme{schemes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="space-y-5">
          <SearchBar
            query={query} state={state} category={category}
            onQuery={setQuery} onState={setState} onCategory={setCategory}
          />

          {schemesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SchemeSkeleton key={i} />)}
            </div>
          )}

          {!schemesLoading && schemesError && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <span className="text-4xl">⚠️</span>
              <p className="text-base font-bold text-red-500">Unable to fetch scheme information.</p>
              <p className="text-sm text-gray-400">Make sure the backend is running and database is seeded.</p>
              <button
                onClick={fetchSchemes}
                className="mt-1 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!schemesLoading && !schemesError && schemes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <span className="text-5xl">🔍</span>
              <p className="text-base font-bold text-gray-700 dark:text-gray-300">No schemes found.</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}

          {!schemesLoading && !schemesError && schemes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
