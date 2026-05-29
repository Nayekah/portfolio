type BrandMarkProps = {
  light?: boolean
}

function BrandMark({ light = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark${light ? ' brand-mark-light' : ''}`} aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <span key={index} className={`brand-mark-ray ray-${index + 1}`}></span>
      ))}
    </span>
  )
}

export default BrandMark
