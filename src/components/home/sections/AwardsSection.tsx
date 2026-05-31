import type { FocusEvent } from 'react'
import { motion } from 'motion/react'
import { featuredAwards } from '../../../content/awards'
import AwardPolaroidCard from '../AwardPolaroidCard'
import { RevealBlock } from '../home-primitives'

type AwardsSectionProps = {
  activeAward: number
  onActiveAwardChange: (index: number) => void
  onAutoplayPauseChange: (paused: boolean) => void
  onNextAward: () => void
  onPreviousAward: () => void
}

function AwardsSection({
  activeAward,
  onActiveAwardChange,
  onAutoplayPauseChange,
  onNextAward,
  onPreviousAward,
}: AwardsSectionProps) {
  const currentAward = featuredAwards[activeAward]

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onAutoplayPauseChange(false)
    }
  }

  return (
    <section className="section awards-section" id="awards">
      <div className="section-divider"></div>
      <RevealBlock className="section-head awards-head">
        <div>
          <h2>Awards and competition highlights.</h2>
          <p className="section-summary">
            Selected milestones from cybersecurity competitions and student technology events.
          </p>
        </div>
        <a className="button-outline" href="/awards">
          View all awards
        </a>
      </RevealBlock>

      <RevealBlock
        className="awards-spotlight"
        onMouseEnter={() => onAutoplayPauseChange(true)}
        onMouseLeave={() => onAutoplayPauseChange(false)}
        onFocusCapture={() => onAutoplayPauseChange(true)}
        onBlurCapture={handleBlurCapture}
      >
        <button
          className="testimonial-nav"
          type="button"
          onClick={onPreviousAward}
          aria-label="Previous award"
        >
          &larr;
        </button>

        <motion.div
          className="awards-stage"
          key={currentAward.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <AwardPolaroidCard award={currentAward} />
          <div className="award-tabs" aria-label="Award navigation">
            {featuredAwards.map((award, index) => (
              <button
                type="button"
                key={award.title}
                aria-label={`Show award ${index + 1}: ${award.title}`}
                aria-pressed={index === activeAward}
                className={index === activeAward ? 'is-active' : ''}
                onClick={() => onActiveAwardChange(index)}
              ></button>
            ))}
          </div>
        </motion.div>

        <button
          className="testimonial-nav"
          type="button"
          onClick={onNextAward}
          aria-label="Next award"
        >
          &rarr;
        </button>
      </RevealBlock>
    </section>
  )
}

export default AwardsSection
