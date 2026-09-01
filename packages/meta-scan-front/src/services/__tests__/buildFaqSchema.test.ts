import { buildFaqSchema } from "@/services/buildFaqSchema";

// Only the keys buildFaqSchema actually reads — mirrors
// buildBasicSeoMessage.test.ts's `t` slice convention. Includes the CTA
// keys too, so a test can assert they're deliberately excluded from the
// schema output (issue #11 req #2).
const t = {
  faq1Q: "SEO·AEO·GEO란?",
  faq1A: "SEO는 전통 검색엔진 최적화, AEO는 답변엔진 최적화다.",
  faq2Q: "정말 무료인가?",
  faq2A: "네, 회원가입이나 결제 없이 완전 무료다.",
  faq3Q: "무엇을 확인하는가?",
  faq3A: "SEO, 색인, AI 신호를 확인한다.",
  faq4Q: "AEO·GEO를 위해 어떤 문서가 필요한가?",
  faq4A: "필수는 아니지만 prompts.txt를 두면 도움이 된다.",
  faq5Q: "얼마나 걸리는가?",
  faq5A: "순차적으로 진행되어 수십 초 정도 걸린다.",
  faq6Q: "결과가 저장되는가?",
  faq6A: "아니다, 무상태로 처리된다.",
  faqCtaText: "여전히 궁금한 점이 있다면 지금 스캔해보라.",
  faqCtaButton: "지금 스캔하기",
};

describe("buildFaqSchema", () => {
  it("builds a schema.org FAQPage JSON-LD object with all 6 Q&A pairs", () => {
    const schema = buildFaqSchema(t);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(6);
  });

  it("maps each Q&A pair to a schema.org Question/acceptedAnswer.Answer pair, in order", () => {
    const schema = buildFaqSchema(t);

    expect(schema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: t.faq1Q,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.faq1A,
      },
    });
    expect(schema.mainEntity[5]).toEqual({
      "@type": "Question",
      name: t.faq6Q,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.faq6A,
      },
    });
  });

  it("does not include the FAQ CTA copy (faqCtaText/faqCtaButton) — it isn't a Q&A pair", () => {
    const schema = buildFaqSchema(t);
    const serialized = JSON.stringify(schema);

    expect(serialized).not.toContain(t.faqCtaText);
    expect(serialized).not.toContain(t.faqCtaButton);
  });
});
