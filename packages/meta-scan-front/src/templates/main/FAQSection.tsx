"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bot, HelpCircle } from "lucide-react";

export const FAQSection = ({ t }: DefaultPageProps) => {
  const faqs = [
    { id: "faq1", q: t.faq1Q, a: t.faq1A },
    { id: "faq2", q: t.faq2Q, a: t.faq2A },
    { id: "faq3", q: t.faq3Q, a: t.faq3A },
    { id: "faq4", q: t.faq4Q, a: t.faq4A },
    { id: "faq5", q: t.faq5Q, a: t.faq5A },
    { id: "faq6", q: t.faq6Q, a: t.faq6A },
  ];

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

          {/* Uses the shared Accordion primitive (components/ui/accordion.tsx)
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
              <Button variant="accent">
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
