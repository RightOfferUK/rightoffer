import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RightOffer - Transparent Real Estate Offers',
    short_name: 'RightOffer',
    description: 'Revolutionary real estate platform connecting agents, sellers, and buyers with complete transparency. View all property offers in real-time.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
    categories: ['business', 'productivity', 'real estate'],
    lang: 'en-GB',
  }
}

