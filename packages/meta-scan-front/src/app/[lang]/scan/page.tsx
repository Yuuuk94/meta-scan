import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/dictionaries";
import { getSiteSetting } from "@/utils/siteSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Bot,
  BarChart3,
  Globe,
  Search,
  Shield,
  AlertTriangle,
  Eye,
  FileText,
  Code,
  Zap,
  Target,
  TrendingUp,
  Clock,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface AnalysisResult {
  url: string;
  timestamp: string;
  sitemap: {
    totalPages: number;
    crawlDepth: number;
    errors: number;
    structure: Array<{ name: string; pages: number; depth: number }>;
  };
  lighthouse: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
    metrics: {
      fcp: number;
      lcp: number;
      cls: number;
      fid: number;
    };
  };
  seoAudit: {
    score: number;
    issues: Array<{
      type: "error" | "warning" | "info";
      message: string;
      count: number;
    }>;
    metaTags: { title: boolean; description: boolean; keywords: boolean };
    structuredData: boolean;
  };
}

// NOTE: still mock data (Math.random()) — wiring this to the real
// POST /api/v1/scan/analyze response is out of scope for this pass,
// see docs/meta-scan-plus-prd.md. Only the presentation layer changed here.
export default async function ScanPage() {
  const { lang } = await getSiteSetting();
  const t = (await getDictionary(lang)).scan;

  const result = {
    url: "https://naver.com",
    timestamp: new Date().toISOString(),
    aiPreparednessScore: Math.floor(Math.random() * 40) + 60,
    lighthouse: {
      performance: Math.floor(Math.random() * 40) + 60,
      seo: Math.floor(Math.random() * 30) + 70,
      accessibility: Math.floor(Math.random() * 50) + 50,
      bestPractices: Math.floor(Math.random() * 50) + 50,
      metrics: {
        fcp: Math.floor(Math.random() * 50) + 50,
        lcp: Math.floor(Math.random() * 50) + 50,
        cls: Math.floor(Math.random() * 50) + 50,
        fid: Math.floor(Math.random() * 50) + 50,
      },
    },
    aiSignals: {
      promptsTxt: Math.random() > 0.5,
      promptObject: Math.random() > 0.6,
      faqPage: Math.random() > 0.4,
      structuredData: ["Article", "Organization", "WebSite"].filter(
        () => Math.random() > 0.4
      ),
    },
    indexing: {
      robotsTxt: Math.random() > 0.3,
      canonical: Math.random() > 0.2,
      noIndexFlags: Math.floor(Math.random() * 5),
    },
    previews: {
      ogImage: {
        exists: Math.random() > 0.3,
        size: Math.random() > 0.5 ? "1200x630" : "600x315",
      },
      favicon: Math.random() > 0.2,
      sitemap: Math.random() > 0.4,
    },
    contentStats: {
      wordCount: Math.floor(Math.random() * 2000) + 500,
      headings: {
        h1: Math.floor(Math.random() * 3) + 1,
        h2: Math.floor(Math.random() * 8) + 2,
        h3: Math.floor(Math.random() * 15) + 5,
      },
      tldrPresent: Math.random() > 0.7,
    },
    improvements: [
      "Add FAQPage schema to improve AI answers",
      "Your og:image is too small",
      "Consider adding a prompts.txt file",
      "Improve page loading speed",
      "Add more descriptive alt text",
    ].filter(() => Math.random() > 0.4),
  };

  // Score band → semantic token, not a decorative rainbow.
  const scoreBand = (score: number) =>
    score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";

  const scoreTextClass = (score: number) =>
    ({
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
    })[scoreBand(score)];

  const scoreBarClass = (score: number) =>
    ({
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
    })[scoreBand(score)];

  const ScoreCard = ({
    title,
    score,
    icon: Icon,
  }: {
    title: string;
    score: number;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Icon className={`h-5 w-5 ${scoreTextClass(score)}`} />
          <div className={`text-2xl font-semibold ${scoreTextClass(score)}`}>
            {score}
          </div>
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${scoreBarClass(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );

  const StatusBadge = ({
    condition,
    trueText,
    falseText,
  }: {
    condition: boolean;
    trueText: string;
    falseText: string;
  }) => (
    <Badge
      className={
        condition
          ? "border-success/30 bg-success/10 text-success"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }
    >
      {condition ? trueText : falseText}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* URL bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <Globe className="h-5 w-5 text-primary" />
        <div>
          <div className="max-w-md truncate font-semibold text-foreground">
            {result.url}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {t.analyzedAt}{" "}
            {new Date(result.timestamp).toLocaleString(
              lang === "ko" ? "ko-KR" : "en-US"
            )}
          </div>
        </div>
      </div>

      {/* AI Preparedness Score Hero */}
      <Card className="mb-8">
        <CardHeader className="items-center text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4.5 w-4.5 text-primary" />
            </div>
            <CardTitle className="text-lg font-medium text-foreground">
              {t.aiPreparednessScore}
            </CardTitle>
          </div>
          <div
            className={`mb-4 text-6xl font-semibold ${scoreTextClass(
              result.aiPreparednessScore
            )}`}
          >
            {result.aiPreparednessScore}
          </div>
          <div className="mx-auto w-full max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${scoreBarClass(
                  result.aiPreparednessScore
                )}`}
                style={{ width: `${result.aiPreparednessScore}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Eye className="h-4 w-4" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger value="details">
            <FileText className="h-4 w-4" />
            {t.details}
          </TabsTrigger>
          <TabsTrigger value="raw">
            <Code className="h-4 w-4" />
            {t.rawData}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Lighthouse Scores */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t.lighthouseScores}
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <ScoreCard
                title={t.performance}
                score={result.lighthouse.performance}
                icon={Zap}
              />
              <ScoreCard title={t.seo} score={result.lighthouse.seo} icon={TrendingUp} />
              <ScoreCard
                title={t.accessibility}
                score={result.lighthouse.accessibility}
                icon={Shield}
              />
            </div>
          </div>

          {/* AI Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-primary" />
                {t.aiSignals}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t.promptsTxt}</div>
                  <StatusBadge
                    condition={result.aiSignals.promptsTxt}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t.promptObject}</div>
                  <StatusBadge
                    condition={result.aiSignals.promptObject}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t.faqPage}</div>
                  <StatusBadge
                    condition={result.aiSignals.faqPage}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t.structuredData}</div>
                  {result.aiSignals.structuredData.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {result.aiSignals.structuredData.map((data) => (
                        <Badge key={data} variant="secondary" className="text-xs">
                          {data}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge className="border-destructive/30 bg-destructive/10 text-xs text-destructive">
                      {t.notDetected}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-primary" />
                  {t.improvements}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.improvements.map((improvement) => (
                    <li
                      key={improvement}
                      className="flex items-start gap-3 text-sm text-foreground"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Indexing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Search className="h-5 w-5 text-primary" />
                  {t.indexing}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.robotsTxt}</span>
                  <StatusBadge
                    condition={result.indexing.robotsTxt}
                    trueText={t.present}
                    falseText={t.missing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.canonical}</span>
                  <StatusBadge
                    condition={result.indexing.canonical}
                    trueText={t.present}
                    falseText={t.missing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.noIndexFlags}</span>
                  <Badge
                    className={
                      result.indexing.noIndexFlags === 0
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                    }
                  >
                    {result.indexing.noIndexFlags}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t.contentStats}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.wordCount}</span>
                  <Badge variant="secondary">
                    {result.contentStats.wordCount.toLocaleString()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">{t.headings}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {t.h1}: {result.contentStats.headings.h1}
                    </Badge>
                    <Badge variant="outline">
                      {t.h2}: {result.contentStats.headings.h2}
                    </Badge>
                    <Badge variant="outline">
                      {t.h3}: {result.contentStats.headings.h3}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.tldr}</span>
                  <StatusBadge
                    condition={result.contentStats.tldrPresent}
                    trueText={t.present}
                    falseText={t.missing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code className="h-5 w-5 text-primary" />
                {t.rawData}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
