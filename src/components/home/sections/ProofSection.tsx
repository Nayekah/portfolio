import TechStackCarousel from '../TechStackCarousel'
import { RevealBlock } from '../home-primitives'

function ProofSection() {
  return (
    <section className="section proof-section">
      <div className="section-divider"></div>
      <div className="proof-section-body">
        <RevealBlock className="proof-copy">
          <h2>Tech stack I use.</h2>
          <p>
            This stack reflects the work I spend most of my time on: smart contracts, low-level
            programming, backend systems, security-oriented engineering, and product tooling. It is
            the mix I rely on to build, test, document, and ship technical work across both software
            and blockchain environments.
          </p>
        </RevealBlock>

        <RevealBlock className="stack-carousel-wrap" amount={0.18}>
          <TechStackCarousel />
        </RevealBlock>
      </div>
    </section>
  )
}

export default ProofSection
