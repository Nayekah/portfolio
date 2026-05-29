import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { BsInstagram } from 'react-icons/bs'
import { SiGmail, SiGitlab, SiSpotify } from 'react-icons/si'

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
  return (
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
            rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            title={link.label}
          >
            <Icon aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}

export default SocialOverlay
