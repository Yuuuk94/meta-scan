"use client";
import { Button } from "@/ui/atoms/Button";
import { Card, CardContent } from "@/ui/molecules/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/molecules/Accordion";
import { Bot, HelpCircle } from "lucide-react";
import { heroUrlInputId } from "@/constans";

export const FAQSection = ({ t }: DefaultPageProps) => {
  const faqs = [
    { id: "faq1", q: t.faq1Q, a: t.faq1A },
    { id: "faq2", q: t.faq2Q, a: t.faq2A },
    { id: "faq3", q: t.faq3Q, a: t.faq3A },
    { id: "faq4", q: t.faq4Q, a: t.faq4A },
    { id: "faq5", q: t.faq5Q, a: t.faq5A },
    { id: "faq6", q: t.faq6Q, a: t.faq6A },
  ];

  // Scrolls back to the Hero section and focuses its URL input, so the CTA
  // re-engages the same input the user already saw at the top instead of
  // doing nothing (issue #15). FAQSection/HeroSection are rendered as
  // siblings in app/[lang]/page.tsx with no shared context/store, so we
  // reach across via the shared heroUrlInputId DOM id.
  const handleScanNowClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(heroUrlInputId)?.focus();
  };

  return (
    <section className="py-24">
      <div className="content-frame">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-3xl font-extrabold text-foreground">
              {t.faqTitle}
            </h2>
            <p className="text-foreground-secondary">{t.faqSubtitle}</p>
          </div>

          {/* Uses the shared Accordion primitive (molecules/Accordion.tsx)
           * instead of hand-rolled open/close state, so this list picks up
           * the design system's +/- toggle and instant transition for free
           * instead of duplicating it here. */}
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border-[1.5px] border-foreground text-foreground">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <span className="font-display font-bold text-foreground">
                      {faq.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-12 text-foreground-secondary">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <Card className="mt-10 text-center">
            <CardContent className="py-8">
              <p className="mb-4 text-foreground-secondary">{t.faqCtaText}</p>
              <Button variant="accent" onClick={handleScanNowClick}>
                <Bot className="h-4 w-4" />
                {t.faqCtaButton}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
