'use client';

import React from 'react'
import { Adsense } from '@ctrl/react-adsense';

function AdsenseOnheader() {
    return (
        <div style={{
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
        }}>
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