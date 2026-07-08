import { useState } from 'react'
import { saveAs } from 'file-saver'
import api from '../../services/api'

const STATUS = { idle: 'idle', loading: 'loading', success: 'success', error: 'error' }

const FORMAT_META = {
  pdf:   { icon: 'Report', label: 'PDF',   color: 'bg-red-500 hover:bg-red-600',   ring: 'focus-visible:ring-red-400'   },
  excel: { icon: 'Chart', label: 'Excel', color: 'bg-emerald-600 hover:bg-emerald-700', ring: 'focus-visible:ring-emerald-400' },
  csv:   { icon: 'List', label: 'CSV',   color: 'bg-blue-500 hover:bg-blue-600', ring: 'focus-visible:ring-blue-400'  },
}

const MIME = {
  pdf:   'application/pdf',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv:   'text/csv',
}

const EXT = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' }

export default function ExportButton({ endpoint, format, filename }) {
  const [status, setStatus] = useState(STATUS.idle)
  const meta = FORMAT_META[format]

  const handleDownload = async () => {
    if (status === STATUS.loading) return
    setStatus(STATUS.loading)
    try {
      const res = await api.get(endpoint, { responseType: 'blob' })
      saveAs(new Blob([res.data], { type: MIME[format] }), `${filename}.${EXT[format]}`)
      setStatus(STATUS.success)
      setTimeout(() => setStatus(STATUS.idle), 2500)
    } catch {
      setStatus(STATUS.error)
      setTimeout(() => setStatus(STATUS.idle), 3000)
    }
  }

  const isLoading = status === STATUS.loading
  const isSuccess = status === STATUS.success
  const isError   = status === STATUS.error

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        disabled:opacity-70 disabled:cursor-not-allowed select-none
        ${isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : meta.color}
        ${meta.ring}
      `}
    >
      {isLoading ? (
        <>
          <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
          Generating...
        </>
      ) : isSuccess ? (
        <>Yes Downloaded</>
      ) : isError ? (
        <>Warning Failed</>
      ) : (
        <>{meta.icon} {meta.label}</>
      )}
    </button>
  )
}
