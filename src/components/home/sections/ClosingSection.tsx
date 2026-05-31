import { StaggerGroup, StaggerItem } from '../home-primitives'

function ClosingSection() {
  return (
    <section className="section closing-section" id="contact">
      <div className="section-divider"></div>
      <StaggerGroup className="closing-grid">
        <StaggerItem>
          <div className="closing-panel">
            <h2>Build with clarity.</h2>
            <p>
              I build software too, not just portfolios. If you need a stronger digital presence, a
              writing archive, or a product interface that feels sharper and more deliberate, this
              is where the work can begin to take a clearer shape.
            </p>
            <a className="button-solid" href="/contacts">
              Start a conversation
            </a>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="closing-panel">
            <h2>See how I build.</h2>
            <p>
              I build editorial portfolios, developer-facing interfaces, and systems that turn
              scattered ideas into something coherent, usable, and ready to publish.
            </p>
            <a className="button-outline" href="/projects">
              See selected work
            </a>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </section>
  )
}

export default ClosingSection
