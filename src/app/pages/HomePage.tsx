import { Hero } from "../components/Hero";
import { FeaturedPerfumes } from "../components/FeaturedPerfumes";
import { BestSellers } from "../components/BestSellers";
import { BrandStory } from "../components/BrandStory";
import { Testimonials } from "../components/Testimonials";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPerfumes />
      <BestSellers />
      <BrandStory />
      <Testimonials />
    </>
  );
}
