import ExportButton from './ExportButton'

export default function ReportCard({ icon, title, description, color, exports }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden relative">
      <div
        className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-10 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${color}18` }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{title}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {exports.map(({ format, endpoint, filename }) => (
          <ExportButton
            key={format}
            format={format}
            endpoint={endpoint}
            filename={filename}
          />
        ))}
      </div>
    </div>
  )
}
