import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

type UseAutoplayIndexOptions = {
  count: number
  intervalMs: number
  paused: boolean
}

function getNextIndex(current: number, count: number) {
  return current === count - 1 ? 0 : current + 1
}

function getPreviousIndex(current: number, count: number) {
  return current === 0 ? count - 1 : current - 1
}

export function useAutoplayIndex({ count, intervalMs, paused }: UseAutoplayIndexOptions) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (shouldReduceMotion || paused || count < 2) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => getNextIndex(current, count))
    }, intervalMs)

    return () => {
      window.clearInterval(timer)
    }
  }, [count, intervalMs, paused, shouldReduceMotion])

  const next = useCallback(() => {
    setActiveIndex((current) => getNextIndex(current, count))
  }, [count])

  const previous = useCallback(() => {
    setActiveIndex((current) => getPreviousIndex(current, count))
  }, [count])

  return { activeIndex, next, previous, setActiveIndex }
}
