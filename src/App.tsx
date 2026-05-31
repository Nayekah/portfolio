import './App.css'
import BlogPage from './components/blogs/BlogPage'
import HomePage from './components/home/HomePage'
import { getCurrentPathname, resolveAppRoute } from './lib/routes'
import { useAppSeo } from './lib/app-seo'
import AwardsPage from './pages/AwardsPage'
import BlogsPage from './pages/BlogsPage'
import ContactPage from './pages/ContactPage'
import MiscellaneousPage from './pages/MiscellaneousPage'
import ProjectsPage from './pages/ProjectsPage'

function App() {
  const pathname = getCurrentPathname()
  const year = new Date().getFullYear()
  const activeRoute = resolveAppRoute(pathname)

  useAppSeo(activeRoute, pathname)

  if (activeRoute.type === 'blog') {
    return <BlogPage entry={activeRoute.entry} year={year} />
  }

  if (activeRoute.type === 'contact') {
    return <ContactPage year={year} />
  }

  if (activeRoute.type === 'blogs') {
    return <BlogsPage year={year} />
  }

  if (activeRoute.type === 'projects') {
    return <ProjectsPage year={year} />
  }

  if (activeRoute.type === 'awards') {
    return <AwardsPage year={year} />
  }

  if (activeRoute.type === 'miscellaneous') {
    return <MiscellaneousPage year={year} />
  }

  return <HomePage year={year} />
}

export default App
