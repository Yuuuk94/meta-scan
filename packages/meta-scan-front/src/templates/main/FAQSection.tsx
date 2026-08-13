"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export const FAQSection = ({ lang, t }: DefaultPageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { id: "faq1", q: t.faq1Q, a: t.faq1A },
    { id: "faq2", q: t.faq2Q, a: t.faq2A },
    { id: "faq3", q: t.faq3Q, a: t.faq3A },
    { id: "faq4", q: t.faq4Q, a: t.faq4A },
    { id: "faq5", q: t.faq5Q, a: t.faq5A },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-semibold text-foreground">
              {t.faqTitle}
            </h2>
            <p className="text-muted-foreground">{t.faqSubtitle}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <Card
                  key={faq.id}
                  className={`overflow-hidden py-0 transition-colors ${
                    isOpen ? "border-ring" : ""
                  }`}
                >
                  <CardHeader
                    className="cursor-pointer py-4"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isOpen
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base font-medium text-foreground">
                          {faq.q}
                        </CardTitle>
                      </div>

                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>

                  {isOpen && (
                    <CardContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Contact CTA */}
          <Card className="mt-10 border-dashed bg-muted/40 text-center shadow-none">
            <CardContent className="py-8">
              <p className="mb-4 text-muted-foreground">
                {lang === "en"
                  ? "Still have questions? We're here to help optimize your website for the AI future."
                  : "여전히 질문이 있으신가요? AI 미래를 위한 웹사이트 최적화를 도와드리겠습니다."}
              </p>
              <Button>
                <Bot className="h-4 w-4" />
                {lang === "en" ? "Get AI Optimization Tips" : "AI 최적화 팁 받기"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
