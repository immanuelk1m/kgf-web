'use client';

import React from 'react'
import { Adsense } from '@ctrl/react-adsense';

function AdsenseOnheader() {
    return (
        <div className="flex justify-center w-full">
            <Adsense               
                client="ca-pub-7656508177587264"
                slot="1773657493"
                format="auto"
                responsive="true"
                style={{ display: 'block' }}
            />
        </div>
    )
}

export default AdsenseOnheader