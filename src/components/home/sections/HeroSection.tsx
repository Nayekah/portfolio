import { FiGithub, FiLinkedin } from 'react-icons/fi'
import HeroPolaroid from '../HeroPolaroid'
import { RevealBlock, TypingHeroTitle } from '../home-primitives'

function HeroSection() {
  return (
    <section className="section hero-section">
      <div className="blog-breadcrumbs">
        <span>Main</span>
      </div>

      <div className="hero-simple">
        <RevealBlock className="hero-copy hero-copy-simple" amount={0.5}>
          <TypingHeroTitle />
          <div className="hero-rule"></div>
          <p>
            A third-year Informatics Engineering student at Bandung Institute of Technology,
            passionate about cybersecurity, low-level systems, machine learning, and blockchain
            stuff. I enjoy playing with cryptography, PWN challenges, and blockchain security.
          </p>
          <div className="button-row">
            <a className="button-outline button-with-icon" href="/projects">
              <FiGithub aria-hidden="true" />
              <span>View projects</span>
            </a>
            <a
              className="button-outline button-with-icon"
              href="https://www.linkedin.com/in/nayaka-ghana-subrata/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiLinkedin aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
          </div>
        </RevealBlock>

        <RevealBlock amount={0.45} delay={0.08}>
          <HeroPolaroid />
        </RevealBlock>
      </div>
    </section>
  )
}

export default HeroSection
