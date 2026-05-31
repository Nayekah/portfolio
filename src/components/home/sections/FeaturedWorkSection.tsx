import { FiGithub } from 'react-icons/fi'
import { featuredProjects } from '../../../content/projects'
import { RevealBlock, StaggerGroup, StaggerItem } from '../home-primitives'

function FeaturedWorkSection() {
  return (
    <section className="section featured-work-section">
      <div className="section-divider"></div>
      <div className="featured-work-grid">
        <RevealBlock className="featured-work-copy">
          <h2>Selected projects.</h2>
          <p>
            Two builds that reflect what I spend most of my time on: Convo, a secure messaging
            app, and Keossku Band, a custom operating system built close to the hardware.
          </p>
          <a className="button-outline" href="/projects">
            Explore the projects
          </a>
        </RevealBlock>

        <StaggerGroup className="featured-card-grid">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.title}>
              <article className="project-card">
                <a
                  className={`project-visual tone-${project.tone}`}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="project-image"
                    src={project.image}
                    alt={project.imageAlt}
                    loading="lazy"
                  />
                  <span>{project.subtitle}</span>
                </a>
                <div className="project-meta">
                  <span className="project-dot" aria-hidden="true">
                    <FiGithub />
                  </span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.subtitle}</p>
                  </div>
                </div>
                <p className="project-description">{project.description}</p>
                <a
                  className="button-outline button-with-icon project-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiGithub aria-hidden="true" />
                  <span>View on GitHub</span>
                </a>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

export default FeaturedWorkSection
