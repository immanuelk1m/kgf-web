'use client';

import React from 'react';
import { Adsense } from '@ctrl/react-adsense';

function AdsenseOnfooter() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <Adsense
        client="ca-pub-7656508177587264"
        slot="4411714536"
        format="auto"
        responsive="true"
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: '250px',
          margin: 0,
          padding: 0
        }}
      />
    </div>
  );
}

export default AdsenseOnfooter;