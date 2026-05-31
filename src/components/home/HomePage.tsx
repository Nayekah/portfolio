import { useState } from 'react'
import { featuredAwards } from '../../content/awards'
import { metrics } from '../../content/home'
import SiteShell from '../SiteShell'
import AwardsSection from './sections/AwardsSection'
import ArticlesSection from './sections/ArticlesSection'
import ClosingSection from './sections/ClosingSection'
import FeaturedWorkSection from './sections/FeaturedWorkSection'
import HeroSection from './sections/HeroSection'
import InterestsSection from './sections/InterestsSection'
import MetricsSection from './sections/MetricsSection'
import ProofSection from './sections/ProofSection'
import { useAutoplayIndex } from './useAutoplayIndex'

type HomePageProps = {
  year: number
}

function HomePage({ year }: HomePageProps) {
  const [isMetricAutoplayPaused, setIsMetricAutoplayPaused] = useState(false)
  const [isAwardAutoplayPaused, setIsAwardAutoplayPaused] = useState(false)
  const metricCarousel = useAutoplayIndex({
    count: metrics.length,
    intervalMs: 2600,
    paused: isMetricAutoplayPaused,
  })
  const awardCarousel = useAutoplayIndex({
    count: featuredAwards.length,
    intervalMs: 3200,
    paused: isAwardAutoplayPaused,
  })

  return (
    <SiteShell isHomePage year={year}>
      <HeroSection />
      <ProofSection />
      <MetricsSection
        activeMetric={metricCarousel.activeIndex}
        onActiveMetricChange={metricCarousel.setActiveIndex}
        onAutoplayPauseChange={setIsMetricAutoplayPaused}
      />
      <AwardsSection
        activeAward={awardCarousel.activeIndex}
        onActiveAwardChange={awardCarousel.setActiveIndex}
        onAutoplayPauseChange={setIsAwardAutoplayPaused}
        onNextAward={awardCarousel.next}
        onPreviousAward={awardCarousel.previous}
      />
      <InterestsSection />
      <FeaturedWorkSection />
      <ArticlesSection />
      <ClosingSection />
    </SiteShell>
  )
}

export default HomePage
