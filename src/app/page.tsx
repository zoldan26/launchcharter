import { Hero } from "@/components/home/Hero";
import { Trust } from "@/components/home/Trust";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FleetPreview } from "@/components/home/FleetPreview";
import { AirportBand } from "@/components/home/AirportBand";
import { CorporateBand } from "@/components/home/CorporateBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ServiceArea } from "@/components/home/ServiceArea";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { faq } from "@/lib/faq";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Columbus Black Car Service | Chartered Car",
  description:
    "Premium black car service in Columbus, Ohio. Airport transfers to CMH, corporate transportation, hourly chauffeur service and events. Book online in under a minute.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <ServicesGrid />
      <HowItWorks />
      <FleetPreview />
      <AirportBand />
      <CorporateBand />
      <Testimonials />
      <ServiceArea />
      <FaqSection items={faq} />
      <FinalCTA />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
