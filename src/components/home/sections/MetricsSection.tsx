import type { FocusEvent } from 'react'
import { metrics } from '../../../content/home'
import { RevealBlock } from '../home-primitives'
import { MetricCellStyle, createPattern } from '../home-utils'

const metricPatterns = metrics.map((metric) => createPattern(metric.seed))

type MetricsSectionProps = {
  activeMetric: number
  onActiveMetricChange: (index: number) => void
  onAutoplayPauseChange: (paused: boolean) => void
}

function MetricsSection({
  activeMetric,
  onActiveMetricChange,
  onAutoplayPauseChange,
}: MetricsSectionProps) {
  const currentMetric = metrics[activeMetric]

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onAutoplayPauseChange(false)
    }
  }

  return (
    <section className="section metrics-section">
      <div className="section-divider"></div>
      <RevealBlock className="metrics-head">
        <div>
          <h2>Work that ships.</h2>
          <p>Let the numbers do the talking. A quick snapshot of the work so far:</p>
        </div>
      </RevealBlock>

      <div
        className="metrics-grid"
        onMouseEnter={() => onAutoplayPauseChange(true)}
        onMouseLeave={() => onAutoplayPauseChange(false)}
        onFocusCapture={() => onAutoplayPauseChange(true)}
        onBlurCapture={handleBlurCapture}
      >
        <RevealBlock className="metrics-art" delay={0.04}>
          <div
            className={`metrics-pattern tone-${currentMetric.tone}`}
            key={`pattern-${activeMetric}`}
          >
            {metricPatterns[activeMetric].map((cell, index) => {
              const style: MetricCellStyle = {
                '--cell-opacity': cell.opacity,
                '--cell-delay': `${cell.delay}ms`,
                '--cell-scale': cell.scale,
              }

              return (
                <span
                  className={cell.animate ? 'is-animated' : undefined}
                  key={`${activeMetric}-${index}`}
                  style={style}
                ></span>
              )
            })}
          </div>
        </RevealBlock>

        <RevealBlock className="metrics-list" delay={0.1}>
          <div>
            {metrics.map((metric, index) => (
              <article
                className={`metric-row${index === activeMetric ? ' is-active' : ' is-inactive'}`}
                key={metric.label}
                onMouseEnter={() => onActiveMetricChange(index)}
              >
                <div className={`metric-index${index === activeMetric ? ' is-active' : ''}`}>
                  {index + 1}
                </div>
                <div className="metric-number">
                  <strong>{metric.number}</strong>
                  <span>{metric.label}</span>
                </div>
                <p>{metric.body}</p>
              </article>
            ))}
          </div>
        </RevealBlock>
      </div>
    </section>
  )
}

export default MetricsSection
