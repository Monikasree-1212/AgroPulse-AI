import { Brain, CloudSun, Calculator, BarChart3, ClipboardList, Bell, Info } from 'lucide-react'
import ReportCard from './ReportCard'

const REPORTS = [
  {
    icon: Brain,
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
    icon: CloudSun,
    title: 'Weather Report',
    description: 'Weather check history and agricultural impact logs.',
    color: '#f59e0b',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/weather/pdf', filename: 'AgroPulse_Weather' },
    ],
  },
  {
    icon: Calculator,
    title: 'Profit Simulation Report',
    description: 'All profit simulations with ROI and recommendations.',
    color: '#8b5cf6',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/profit/pdf', filename: 'AgroPulse_Profit' },
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics Report',
    description: 'Full platform usage summary, commodity stats, and insights.',
    color: '#16a34a',
    exports: [
      { format: 'pdf',   endpoint: '/api/reports/analytics/pdf',     filename: 'AgroPulse_Analytics' },
      { format: 'excel', endpoint: '/api/reports/predictions/excel', filename: 'AgroPulse_Report'     },
    ],
  },
  {
    icon: ClipboardList,
    title: 'Activity History Report',
    description: 'Complete farmer activity log across all modules.',
    color: '#06b6d4',
    exports: [
      { format: 'pdf', endpoint: '/api/reports/activity/pdf', filename: 'AgroPulse_Activity' },
    ],
  },
  {
    icon: Bell,
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
        <Info size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Reports use your live MongoDB data
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            All reports are generated in real-time from your activity, predictions, and platform usage. No placeholder data.
          </p>
        </div>
      </div>

      {/* Report cards grid  items-stretch so all cards are equal height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {REPORTS.map(r => (
          <ReportCard key={r.title} {...r} />
        ))}
      </div>

      {/* Format legend */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Formats:</p>
        {[
          { dot: 'bg-red-400',     label: 'PDF - Printable report with tables & summary' },
          { dot: 'bg-emerald-500', label: 'Excel - Multi-sheet workbook for analysis'    },
          { dot: 'bg-blue-400',    label: 'CSV - Raw data for spreadsheet import'        },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
