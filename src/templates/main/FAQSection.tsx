"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export const FAQSection = ({ theme, lang, t }: DefaultPageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className={`relative py-60   overflow-hidden`}>
      {/* Background Effects */}
      {theme === "dark" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.05),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* FAQ Header */}
          <div className="text-center mb-16">
            <div className="relative mb-8">
              {theme === "dark" && (
                <>
                  <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500/30 via-cyan-500/20 to-pink-500/30 "></div>
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-l border-t border-purple-400/60"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-r border-t border-cyan-400/60"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l border-b border-cyan-400/60"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r border-b border-pink-400/60"></div>
                </>
              )}

              <h2
                className={`relative text-4xl md:text-5xl font-bold mb-4  duration-500 ${
                  theme === "dark" ? "text-purple-300" : "text-gray-900"
                }`}
              >
                <span
                  className={`relative ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-300 via-cyan-300 to-pink-300 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent"
                  }`}
                >
                  {t.faqTitle}
                </span>
              </h2>

              {/* Animated Underline */}
              <div className="relative mx-auto w-32 h-1.5">
                <div
                  className={`absolute inset-0 rounded-full   ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400"
                      : "bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600"
                  }`}
                ></div>
                {theme === "dark" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 rounded-full blur-sm opacity-50 "></div>
                )}
              </div>
            </div>

            <p
              className={`text-lg max-w-2xl mx-auto transition-colors  ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t.faqSubtitle}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              { id: "faq1", q: t.faq1Q, a: t.faq1A },
              { id: "faq2", q: t.faq2Q, a: t.faq2A },
              { id: "faq3", q: t.faq3Q, a: t.faq3A },
              { id: "faq4", q: t.faq4Q, a: t.faq4A },
              { id: "faq5", q: t.faq5Q, a: t.faq5A },
            ].map((faq, index) => (
              <Card
                key={faq.id}
                className={`group   border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-md border-gray-700/50 hover:border-purple-400/30"
                    : "bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:border-purple-300/50"
                } ${
                  openFaq === index
                    ? theme === "dark"
                      ? "border-purple-400/50 shadow-lg shadow-purple-500/20"
                      : "border-purple-300 shadow-lg"
                    : ""
                }`}
              >
                {theme === "dark" && openFaq === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
                )}

                <CardHeader
                  className="cursor-pointer   relative z-10"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center   ${
                          theme === "dark"
                            ? openFaq === index
                              ? "bg-purple-500/20 border border-purple-400/30"
                              : "bg-gray-800/50 border border-gray-600/30"
                            : openFaq === index
                            ? "bg-purple-100 border border-purple-300"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {theme === "dark" && openFaq === index && (
                          <div className="absolute inset-0 bg-purple-400/10 rounded-xl blur "></div>
                        )}
                        <HelpCircle
                          className={`h-5 w-5 relative z-10 transition-colors  ${
                            theme === "dark"
                              ? openFaq === index
                                ? "text-purple-400"
                                : "text-gray-400"
                              : openFaq === index
                              ? "text-purple-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <CardTitle
                        className={`transition-colors  ${
                          theme === "dark"
                            ? openFaq === index
                              ? "text-purple-300"
                              : "text-white"
                            : openFaq === index
                            ? "text-purple-700"
                            : "text-gray-900"
                        }`}
                      >
                        {faq.q}
                      </CardTitle>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center   ${
                        theme === "dark"
                          ? "bg-gray-800/50 hover:bg-purple-500/20"
                          : "bg-gray-100 hover:bg-purple-100"
                      }`}
                    >
                      {openFaq === index ? (
                        <ChevronDown
                          className={`h-4 w-4 transition-colors  ${
                            theme === "dark"
                              ? "text-purple-400"
                              : "text-purple-600"
                          }`}
                        />
                      ) : (
                        <ChevronUp
                          className={`h-4 w-4 transition-colors  ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {openFaq === index && (
                  <CardContent className="pt-0 pb-6 relative z-10">
                    <div
                      className={`transition-colors  ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-xl border-l-4   ${
                          theme === "dark"
                            ? "bg-purple-500/10 border-purple-400/50"
                            : "bg-purple-50 border-purple-300"
                        }`}
                      >
                        {faq.a}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <Card
              className={`w-full inline-block   border ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-md border-purple-400/30 hover:border-purple-400/50"
                  : "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-300"
              }`}
            >
              <CardContent className="p-6">
                <p
                  className={`mb-4 transition-colors  ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {lang === "en"
                    ? "Still have questions? We're here to help optimize your website for the AI future."
                    : "여전히 질문이 있으신가요? AI 미래를 위한 웹사이트 최적화를 도와드리겠습니다."}
                </p>
                <Button
                  className={`  ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-400 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                  }`}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  {lang === "en"
                    ? "Get AI Optimization Tips"
                    : "AI 최적화 팁 받기"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
