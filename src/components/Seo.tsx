import Head from 'next/head';

export const SITE_NAME = 'Best Qualities Industrial Equipment';
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bestqualities.ng'
).replace(/\/$/, '');

const DEFAULT_DESCRIPTION =
  'Genuine and OEM-quality vehicle parts in Nigeria: brakes, engine parts, filters, suspension, electrical and more. Guaranteed fitment, fast nationwide delivery.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const absoluteUrl = (src?: string) => {
  if (!src) return DEFAULT_IMAGE;
  return src.startsWith('http') ? src : `${SITE_URL}${src}`;
};

// Per-page SEO tags. Uses keyed meta tags so page values override the
// defaults set in _app.
export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image,
  type = 'website',
  noIndex = false,
  jsonLd,
}: SeoProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Vehicle Parts & Accessories in Nigeria`;
  const url = `${SITE_URL}${path}`;
  const ogImage = absoluteUrl(image);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title key='title'>{fullTitle}</title>
      <meta name='description' content={description} key='description' />
      <link rel='canonical' href={url} key='canonical' />
      {noIndex && <meta name='robots' content='noindex, nofollow' key='robots' />}

      <meta property='og:site_name' content={SITE_NAME} key='og:site_name' />
      <meta property='og:title' content={fullTitle} key='og:title' />
      <meta property='og:description' content={description} key='og:description' />
      <meta property='og:url' content={url} key='og:url' />
      <meta property='og:type' content={type === 'product' ? 'product' : type} key='og:type' />
      <meta property='og:image' content={ogImage} key='og:image' />
      <meta property='og:locale' content='en_NG' key='og:locale' />

      <meta name='twitter:card' content='summary_large_image' key='twitter:card' />
      <meta name='twitter:title' content={fullTitle} key='twitter:title' />
      <meta name='twitter:description' content={description} key='twitter:description' />
      <meta name='twitter:image' content={ogImage} key='twitter:image' />

      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }),
          }}
        />
      ))}
    </Head>
  );
};

export default Seo;
