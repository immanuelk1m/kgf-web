'use client';

import React from 'react';
import { Adsense } from '@ctrl/react-adsense';

function AdsenseOnfooter() {
  return (
    <div className="w-full h-full">
      <Adsense
        client="ca-pub-7656508177587264"
        slot="4411714536"
        format="auto"
        responsive="true"
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: '300px'
        }}
      />
    </div>
  );
}

export default AdsenseOnfooter;