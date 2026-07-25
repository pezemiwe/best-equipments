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
              "Industrial equipment and vehicle parts in Nigeria: belts, bearings, seals, excavator parts and car care products, with fast nationwide delivery.",
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
