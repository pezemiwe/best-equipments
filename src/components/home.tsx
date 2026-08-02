import * as React from "react";
import { Flex } from "@chakra-ui/react";
import { useProducts } from "@/hooks/products";

import { HeroSection } from "./home/HeroSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { CategoryGrid } from "./home/CategoryGrid";
import { FeaturedProducts } from "./home/FeaturedProducts";
import { WhyUsSection } from "./home/WhyUsSection";
import { CTASection } from "./home/CTASection";

export const Home = () => {
  const { data: products, isLoading: productsLoading } = useProducts();

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products || []) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const featured = (products || []).slice(0, 8);

  return (
    <Flex
      flexDir="column"
      w="100%"
      alignItems="center"
      className={"font-montserrat"}
      overflowX="hidden"
    >
      <HeroSection />
      <FeaturesSection />
      <CategoryGrid categoryCounts={categoryCounts} />
      <FeaturedProducts productsLoading={productsLoading} featured={featured} />
      <WhyUsSection />
      <CTASection />
    </Flex>
  );
};

export default Home;
