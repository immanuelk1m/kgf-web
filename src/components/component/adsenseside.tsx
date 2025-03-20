'use client';

import React from 'react'
import { Adsense } from '@ctrl/react-adsense';

function AdsenseSide() {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <Adsense               
        client="ca-pub-7656508177587264"
        slot="1266676447"
        format="auto"
        responsive="true"
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: '600px'
        }}
      />
    </div>
  )
}

export default AdsenseSide