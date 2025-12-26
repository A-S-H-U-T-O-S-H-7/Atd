  'use client';

  import Script from 'next/script';
  import { useState } from 'react';

  export default function ScriptLoader() {
    const [jqueryLoaded, setJqueryLoaded] = useState(false);

    return (
      <>
        {/* Paynimo jQuery Library */}
        <Script
          src="https://www.paynimo.com/paynimocheckout/client/lib/jquery.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            setJqueryLoaded(true);
          }}
          onError={(e) => {
            console.error('[Paynimo] Failed to load jQuery:', e);
          }}
        />
        
        {/* Paynimo Checkout Library - Load after jQuery */}
        {jqueryLoaded && (
          <Script
            src="https://www.paynimo.com/Paynimocheckout/server/lib/checkout.js"
            strategy="afterInteractive"
            onLoad={() => {
              // Give it a moment to initialize
              setTimeout(() => {
                if (typeof window !== 'undefined' && window.$?.pnCheckout) {
                } else {
                  console.error('[Paynimo] ✗ pnCheckout not found on window.$');
                  console.log('[Paynimo] Available on window.$:', Object.keys(window.$ || {}));
                }
              }, 100);
            }}
            onError={(e) => {
              console.error('[Paynimo] Failed to load checkout library:', e);
            }}
          />
        )}
      </>
    );
  }
