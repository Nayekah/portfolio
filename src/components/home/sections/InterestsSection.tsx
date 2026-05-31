import { useState } from 'react'
import { motion } from 'motion/react'
import { specializations, valueCards } from '../../../content/home'
import { RevealBlock, ScrambleText, StaggerGroup, StaggerItem } from '../home-primitives'

function ValueInterestCard({ card, index }: { card: (typeof valueCards)[number]; index: number }) {
  const [isScrambleActive, setIsScrambleActive] = useState(false)

  return (
    <motion.article
      className={`value-card tone-${card.tone}`}
      onViewportEnter={() => setIsScrambleActive(true)}
      viewport={{ once: true, amount: 0.6 }}
    >
      <h3>
        <ScrambleText active={isScrambleActive} settleDelay={22 + index * 4} text={card.title} />
      </h3>
      <p>{card.body}</p>
    </motion.article>
  )
}

function InterestsSection() {
  return (
    <section className="section values-section" id="projects">
      <div className="section-divider"></div>
      <RevealBlock className="values-head">
        <h2>Interests.</h2>
      </RevealBlock>

      <StaggerGroup className="value-card-grid">
        {valueCards.map((card, index) => (
          <StaggerItem key={card.title}>
            <ValueInterestCard card={card} index={index} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <RevealBlock className="specializations-block" id="miscellaneous">
        <h2 className="small-section-title">Related areas I keep exploring</h2>
        <StaggerGroup className="specializations-grid" amount={0.18} stagger={0.08}>
          {specializations.map((column, columnIndex) => (
            <StaggerItem className="specialization-column" key={columnIndex}>
              {column.map((item) => (
                <button className="specialization-item" type="button" key={item}>
                  <span>{item}</span>
                </button>
              ))}
            </StaggerItem>
          ))}
        </StaggerGroup>
        <a className="button-outline specializations-link" href="/miscellaneous">
          Open miscellaneous
        </a>
      </RevealBlock>
    </section>
  )
}

export default InterestsSection
