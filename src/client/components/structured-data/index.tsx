import React, { FunctionComponent, useContext } from 'react';
import { AppStateContext } from 'src/client/contexts/app-state';

const buildJsonLd = () => {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Christian Oberhamberger',
        description:
            'My name is Christian. I am a Frontend Developer at Netconomy. I mainly work with React and Node.js on online commerce platforms. *sipping coffee*',
        url: 'https://cohbrgr.com',
    });
};

const jsonLd = buildJsonLd();

const StructuredData: FunctionComponent = () => {
    const { nonce } = useContext(AppStateContext);
    return (
        <script
            nonce={nonce}
            type="application/ld+json"
            suppressHydrationWarning={true}
            dangerouslySetInnerHTML={{
                __html: jsonLd,
            }}
        />
    );
};

StructuredData.displayName = 'StrucuredData';

export default StructuredData;
