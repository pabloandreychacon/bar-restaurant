import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

export function SEO({
  title = 'Barracos Bar | Sports Bar & Restaurant',
  description = 'The ultimate sports bar & restaurant experience. Enjoy craft beers, delicious food, live sports on big screens, and a vibrant atmosphere.',
  keywords,
  image = '/og-image.jpg',
  url = 'https://barracosbar.netlify.app/',
}: SEOProps) {
  useEffect(() => {
    document.title = title

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let meta = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:image', image, true)
    setMeta('og:url', url, true)
    setMeta('og:type', 'website', true)
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:card', 'summary_large_image')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, keywords, image, url])

  return null
}
