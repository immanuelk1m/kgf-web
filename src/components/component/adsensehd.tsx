'use client';

import React from 'react'
import { Adsense } from '@ctrl/react-adsense';

function AdsenseOnheader() {
    return (
        <div className="w-full max-w-[728px] bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
            <Adsense               
                client="ca-pub-7656508177587264"
                slot="1773657493"
                format="auto"
                responsive="true"
                style={{ 
                    display: 'block',
                    width: '100%',
                    minHeight: '90px'
                }}
            />
        </div>
    )
}

export default AdsenseOnheader