import Hero from '../components/Hero'
import Features from '../components/Features'
import About from '../components/About'

function HomePage({ onGetStarted, onExploreFeatures }) {
  return (
    <main id="home" className="home-page">
      <Hero onGetStarted={onGetStarted} onExploreFeatures={onExploreFeatures} />
      <Features />
      <About />
    </main>
  )
}

export default HomePage
