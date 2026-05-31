import { useRef } from 'react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { BsInstagram } from 'react-icons/bs'
import { SiGmail, SiGitlab, SiSpotify } from 'react-icons/si'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from './theme'

const socialLinks = [
  {
    href: 'https://github.com/Nayekah',
    icon: FiGithub,
    label: 'GitHub',
    toneClassName: 'tone-github',
  },
  {
    href: 'https://gitlab-edu.itb.ac.id/Nayekah',
    icon: SiGitlab,
    label: 'GitLab',
    toneClassName: 'tone-gitlab',
  },
  {
    href: 'https://www.linkedin.com/in/nayaka-ghana-subrata/',
    icon: FiLinkedin,
    label: 'LinkedIn',
    toneClassName: 'tone-linkedin',
  },
  {
    href: 'mailto:nayakghana39@gmail.com',
    icon: SiGmail,
    label: 'Gmail',
    toneClassName: 'tone-gmail',
  },
  {
    href: 'https://www.instagram.com/nayaka.env',
    icon: BsInstagram,
    label: 'Instagram',
    toneClassName: 'tone-instagram',
  },
  {
    href: 'https://open.spotify.com/user/31b3d2s2tmv3w4fnhncyjdypxd3q',
    icon: SiSpotify,
    label: 'Spotify',
    toneClassName: 'tone-spotify',
  },
]

function SocialOverlay() {
  const { isTransitioning, theme, toggleTheme } = useTheme()
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  const handleThemeToggle = () => {
    const bounds = toggleRef.current?.getBoundingClientRect()

    toggleTheme(
      bounds
        ? {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          }
        : undefined
    )
  }

  return (
    <div className="floating-overlay-dock">
      <div className="social-overlay" aria-label="Social links">
        {socialLinks.map((link) => {
          const Icon = link.icon

          return (
            <a
              key={link.label}
              className={`social-overlay-link ${link.toneClassName}`}
              href={link.href}
              aria-label={link.label}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              title={link.label}
            >
              <Icon aria-hidden="true" />
            </a>
          )
        })}
      </div>

      <button
        ref={toggleRef}
        className="theme-overlay-toggle"
        type="button"
        aria-label={`Switch to ${nextTheme} mode`}
        aria-pressed={theme === 'dark'}
        disabled={isTransitioning}
        onClick={handleThemeToggle}
        title={`Switch to ${nextTheme} mode`}
      >
        <span className="theme-toggle-icon-stack" aria-hidden="true">
          <span className="theme-toggle-icon theme-toggle-icon-sun">
            <FiSun />
          </span>
          <span className="theme-toggle-icon theme-toggle-icon-moon">
            <FiMoon />
          </span>
        </span>
      </button>
    </div>
  )
}

export default SocialOverlay
