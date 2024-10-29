import { FunctionComponent } from 'react';

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

interface IStructureData {
    nonce?: string | undefined;
}

const StructuredData: FunctionComponent<IStructureData> = ({ nonce }) => {
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
