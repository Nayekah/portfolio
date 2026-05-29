import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { BsInstagram, BsTwitterX } from 'react-icons/bs'
import ContactForm from '../components/contact/ContactForm'
import SiteShell from '../components/SiteShell'

type ContactPageProps = {
  year: number
}

const contactChannels = [
  {
    href: 'https://x.com/Katounasai',
    icon: BsTwitterX,
    label: 'X',
  },
  {
    href: 'https://www.instagram.com/nayaka.env',
    icon: BsInstagram,
    label: 'Instagram',
  },
  {
    href: 'https://linkedin.com/in/nayaka-ghana-subrata',
    icon: FiLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/Nayekah',
    icon: FiGithub,
    label: 'GitHub',
  },
  {
    href: 'mailto:nayakghana39@gmail.com',
    icon: FiMail,
    label: 'Email',
  },
]

function ContactPage({ year }: ContactPageProps) {
  return (
    <SiteShell isHomePage={false} mainClassName="contact-page-main" year={year}>
      <section className="section contact-page-section">
        <div className="section-divider"></div>

        <div className="contact-layout">
          <div className="contact-copy">
            <h1 className="contact-title">Let&apos;s build something deliberate.</h1>
            <div className="contact-copy-rule"></div>
            <p className="contact-summary">
              If you need a sharper portfolio, a security-aware build, or a technical collaborator
              for research and writing, send the brief here. Keep it concrete and I can respond
              faster.
            </p>

            <div className="contact-channel-list" aria-label="Direct contact links">
              {contactChannels.map((channel) => {
                const Icon = channel.icon

                return (
                  <a
                    className="contact-channel-link"
                    href={channel.href}
                    key={channel.label}
                    aria-label={channel.label}
                    target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={channel.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                    title={channel.label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="contact-form-column">
            <ContactForm />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default ContactPage
