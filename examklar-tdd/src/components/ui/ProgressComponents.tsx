interface ProgressMetricCardProps {
  title: string
  value: string | number
  bgColor: string
  textColor: string
  subtitle?: string
  dataTestId?: string
}

/**
 * Reusable metric card component for displaying progress statistics
 */
const ProgressMetricCard = ({ 
  title, 
  value, 
  bgColor, 
  textColor, 
  subtitle,
  dataTestId 
}: ProgressMetricCardProps) => (
  <div className={`${bgColor} rounded-lg p-4`} data-testid={dataTestId}>
    <h3 className={`text-sm font-medium ${textColor} mb-2`}>
      {title}
    </h3>
    <p className={`text-2xl font-bold ${textColor}`}>
      {value}
    </p>
    {subtitle && (
      <p className={`text-xs ${textColor} mt-1`}>
        {subtitle}
      </p>
    )}
  </div>
)

interface ProgressBarProps {
  percentage: number
  label: string
  current: number
  target: number
  unit: string
}

/**
 * Reusable progress bar component
 */
const ProgressBar = ({ percentage, label, current, target, unit }: ProgressBarProps) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium">{current} / {target} {unit}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${Math.round(percentage)}% complete`}
      />
    </div>
  </div>
)

export { ProgressMetricCard, ProgressBar }
