import ReportCard from './ReportCard'

const REPORTS = [
  {
    icon: '🤖',
    title: 'Prediction Report',
    description: 'AI price predictions, commodity history, confidence scores.',
    color: '#3b82f6',
    exports: [
      { format: 'pdf',   endpoint: '/api/reports/predictions/pdf',   filename: 'AgroPulse_Predictions' },
      { format: 'excel', endpoint: '/api/reports/predictions/excel', filename: 'AgroPulse_Report'       },
      { format: 'csv',   endpoint: '/api/reports/predictions/csv',   filename: 'AgroPulse_Predictions'  },
    ],
  },
  {
    icon: '🌤️',
    title: 'Weather Report',
    description: 'Weather check history and agricultural impact logs.',
    color: '#f59e0b',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/weather/pdf', filename: 'AgroPulse_Weather' },
    ],
  },
  {
    icon: '🧮',
    title: 'Profit Simulation Report',
    description: 'All profit simulations with ROI and recommendations.',
    color: '#8b5cf6',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/profit/pdf', filename: 'AgroPulse_Profit' },
    ],
  },
  {
    icon: '📊',
    title: 'Analytics Report',
    description: 'Full platform usage summary, commodity stats, and insights.',
    color: '#16a34a',
    exports: [
      { format: 'pdf',   endpoint: '/api/reports/analytics/pdf',     filename: 'AgroPulse_Analytics' },
      { format: 'excel', endpoint: '/api/reports/predictions/excel', filename: 'AgroPulse_Report'     },
    ],
  },
  {
    icon: '📋',
    title: 'Activity History Report',
    description: 'Complete farmer activity log across all modules.',
    color: '#06b6d4',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/activity/pdf', filename: 'AgroPulse_Activity' },
    ],
  },
  {
    icon: '🔔',
    title: 'Notifications Report',
    description: 'All alerts and notifications with priority and read status.',
    color: '#ec4899',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/notifications/pdf', filename: 'AgroPulse_Notifications' },
    ],
  },
]

export default function ReportsCenter() {
  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-5 py-4">
        <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Reports use your live MongoDB data</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            All reports are generated in real-time from your activity, predictions, and platform usage. No placeholder data.
          </p>
        </div>
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map(r => (
          <ReportCard key={r.title} {...r} />
        ))}
      </div>

      {/* Format legend */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Formats:</p>
        {[
          { icon: '📄', label: 'PDF — Printable report with tables & summary', dot: 'bg-red-400'     },
          { icon: '📊', label: 'Excel — Multi-sheet workbook for analysis',    dot: 'bg-emerald-500' },
          { icon: '📋', label: 'CSV — Raw data for spreadsheet import',        dot: 'bg-blue-400'    },
        ].map(({ icon, label, dot }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{icon} {label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
