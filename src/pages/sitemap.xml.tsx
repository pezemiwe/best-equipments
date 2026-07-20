import { GetServerSideProps } from 'next';
import { listProducts } from '@/server/productStore';
import { SITE_URL } from '@/components/Seo';

const STATIC_PAGES = ['', '/store', '/about', '/contact', '/faq', '/privacy'];

const buildXml = (
  urls: { loc: string; lastmod?: string; priority: string }[]
) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${
      url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''
    }
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls = STATIC_PAGES.map((path) => ({
    loc: `${SITE_URL}${path}`,
    priority: path === '' ? '1.0' : '0.7',
  }));

  try {
    const products = await listProducts();
    for (const product of products) {
      urls.push({
        loc: `${SITE_URL}/store/${product.id}`,
        lastmod: product.updatedAt
          ? new Date(product.updatedAt).toISOString().slice(0, 10)
          : undefined,
        priority: '0.8',
      } as any);
    }
  } catch {
    // sitemap still serves static pages if the store is unreachable
  }

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
  res.write(buildXml(urls));
  res.end();
  return { props: {} };
};

// Body is written in getServerSideProps; nothing renders.
export default function Sitemap() {
  return null;
}
