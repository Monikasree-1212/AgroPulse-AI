import ExportButton from './ExportButton'

export default function ReportCard({ icon: Icon, title, description, color, exports }) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden h-full">

      {/* Icon + Title row */}
      <div className="flex items-center gap-4 mb-3">
        {/* Icon circle  fixed 64x64, overflow-hidden so nothing spills */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
            border: `1.5px solid ${color}33`,
          }}
        >
          <Icon size={30} style={{ color }} strokeWidth={1.75} />
        </div>

        {/* Title + description */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>

      {/* Export buttons pushed to bottom */}
      <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
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
