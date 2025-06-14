'use client'

import dynamic from 'next/dynamic'

// Dynamically import GISMap with SSR disabled
const GISMap = dynamic(() => import('../components/GISMap'), {
  ssr: false,
})

export default function GISMapWrapper() {
  return <GISMap />
}
