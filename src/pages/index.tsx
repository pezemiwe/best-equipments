import Home from "@/components/home";
import Layout from "@/components/layout";
import Seo, { SITE_NAME, SITE_URL } from "@/components/Seo";

export default function HomePage() {
  return (
    <>
      <Seo
        path=""
        jsonLd={[
          {
            "@type": "AutoPartsStore",
            name: SITE_NAME,
            url: SITE_URL,
            description:
              "Genuine and OEM-quality vehicle parts with guaranteed fitment and fast delivery across Nigeria.",
            telephone: "+2348162309761",
            currenciesAccepted: "NGN",
            address: {
              "@type": "PostalAddress",
              addressCountry: "NG",
            },
          },
          {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/store?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      <Layout>
        <Home />
      </Layout>
    </>
  );
}
