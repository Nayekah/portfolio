import katex from 'katex'

type BlogEquationProps = {
  expression: string
}

function BlogEquation({ expression }: BlogEquationProps) {
  const html = katex.renderToString(expression, {
    displayMode: true,
    throwOnError: false,
  })

  return <div className="blog-equation" dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default BlogEquation
