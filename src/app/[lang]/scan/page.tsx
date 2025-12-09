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
  Sparkles,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

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

export default async function ScanPage() {
  const { theme, lang } = await getSiteSetting();
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

  const getScoreColor = (score: number) => {
    if (theme === "dark") {
      if (score >= 80) return "text-cyan-400";
      if (score >= 60) return "text-purple-400";
      return "text-pink-400";
    } else {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    }
  };

  const getScoreBg = (score: number) => {
    if (theme === "dark") {
      if (score >= 80)
        return "from-cyan-500/20 to-cyan-600/20 border-cyan-400/30";
      if (score >= 60)
        return "from-purple-500/20 to-purple-600/20 border-purple-400/30";
      return "from-pink-500/20 to-pink-600/20 border-pink-400/30";
    } else {
      if (score >= 80) return "from-green-50 to-green-100 border-green-200";
      if (score >= 60) return "from-yellow-50 to-yellow-100 border-yellow-200";
      return "from-red-50 to-red-100 border-red-200";
    }
  };

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
    <Card
      className={`relative group transition-all duration-500 border overflow-hidden ${
        theme === "dark"
          ? `bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-md hover:shadow-2xl ${getScoreBg(
              score
            )}`
          : `bg-gradient-to-br ${getScoreBg(score)} hover:shadow-xl`
      }`}
    >
      {theme === "dark" && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <Icon className={`h-6 w-6 ${getScoreColor(score)}`} />
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
        <CardTitle
          className={`transition-colors duration-300 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              theme === "dark"
                ? score >= 80
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-500"
                  : score >= 60
                  ? "bg-gradient-to-r from-purple-400 to-purple-500"
                  : "bg-gradient-to-r from-pink-400 to-pink-500"
                : score >= 80
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : score >= 60
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
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
      className={`transition-all duration-300 ${
        condition
          ? theme === "dark"
            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
            : "bg-green-100 text-green-700 border-green-300"
          : theme === "dark"
          ? "bg-pink-500/20 text-pink-300 border-pink-400/30"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      {condition ? trueText : falseText}
    </Badge>
  );
  return (
    <div className="container mx-auto px-4 py-8">
      {/* URL and Actions Bar */}
      <div
        className={`mb-8 p-6 rounded-2xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
            : "bg-white/80 backdrop-blur-sm border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Globe
              className={`h-6 w-6 ${
                theme === "dark" ? "text-cyan-400" : "text-blue-600"
              }`}
            />
            <div>
              <div
                className={`font-semibold truncate max-w-md ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {result.url}
              </div>
              <div
                className={`text-sm flex items-center gap-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <Clock className="h-4 w-4" />
                {t.analyzedAt}{" "}
                {new Date(result.timestamp).toLocaleString(
                  lang === "ko" ? "ko-KR" : "en-US"
                )}
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-3">
            <Button
              variant="outline"
              // onClick={onNewAnalysis}
              className={`transition-all duration-300 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.newAnalysis}
            </Button>
            <Button
              className={`transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              {t.exportReport}
            </Button>
          </div> */}
        </div>
      </div>

      {/* AI Preparedness Score Hero */}
      <div className="mb-8">
        <Card
          className={`relative overflow-hidden border-2 transition-all duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 shadow-2xl shadow-cyan-500/10"
              : "bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:border-blue-300 shadow-xl"
          }`}
        >
          {theme === "dark" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>
            </>
          )}
          <CardHeader className="text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className={`p-4 rounded-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
              >
                {theme === "dark" && (
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur animate-pulse"></div>
                )}
                <Sparkles
                  className={`h-8 w-8 relative z-10 ${
                    theme === "dark" ? "text-cyan-400" : "text-white"
                  }`}
                />
              </div>
              <CardTitle
                className={`text-3xl transition-colors duration-300 ${
                  theme === "dark"
                    ? "text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"
                    : "text-gray-900"
                }`}
              >
                {t.aiPreparednessScore}
              </CardTitle>
            </div>
            <div
              className={`text-6xl font-bold mb-4 ${getScoreColor(
                result.aiPreparednessScore
              )}`}
            >
              {result.aiPreparednessScore}
            </div>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-lg shadow-cyan-500/20"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                  style={{ width: `${result.aiPreparednessScore}%` }}
                />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        // value={activeTab}
        // onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList
          className={`grid w-full grid-cols-3 ${
            theme === "dark"
              ? "bg-gray-900/50 border border-gray-700/50"
              : "bg-gray-100"
          }`}
        >
          <TabsTrigger
            value="overview"
            className={`transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-cyan-400/30"
                : "data-[state=active]:bg-white data-[state=active]:text-blue-700"
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t.overview}
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className={`transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-400/30"
                : "data-[state=active]:bg-white data-[state=active]:text-purple-700"
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t.details}
          </TabsTrigger>
          <TabsTrigger
            value="raw"
            className={`transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-400/30"
                : "data-[state=active]:bg-white data-[state=active]:text-pink-700"
            }`}
          >
            <Code className="h-4 w-4 mr-2" />
            {t.rawData}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Lighthouse Scores */}
          <div>
            <h3
              className={`text-2xl font-bold mb-6 ${
                theme === "dark"
                  ? "text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text"
                  : "text-gray-900"
              }`}
            >
              {t.lighthouseScores}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCard
                title={t.performance}
                score={result.lighthouse.performance}
                icon={Zap}
              />
              <ScoreCard
                title={t.seo}
                score={result.lighthouse.seo}
                icon={TrendingUp}
              />
              <ScoreCard
                title={t.accessibility}
                score={result.lighthouse.accessibility}
                icon={Shield}
              />
            </div>
          </div>

          {/* AI Signals */}
          <Card
            className={`transition-all duration-300 border ${
              theme === "dark"
                ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
                : "bg-white/80 border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <Bot
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-cyan-400" : "text-blue-600"
                  }`}
                />
                {t.aiSignals}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.promptsTxt}
                  </div>
                  <StatusBadge
                    condition={result.aiSignals.promptsTxt}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.promptObject}
                  </div>
                  <StatusBadge
                    condition={result.aiSignals.promptObject}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.faqPage}
                  </div>
                  <StatusBadge
                    condition={result.aiSignals.faqPage}
                    trueText={t.detected}
                    falseText={t.notDetected}
                  />
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.structuredData}
                  </div>
                  <div className="text-sm">
                    {result.aiSignals.structuredData.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {result.aiSignals.structuredData.map((data, index) => (
                          <Badge
                            key={index}
                            className={`text-xs ${
                              theme === "dark"
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                                : "bg-blue-100 text-blue-700 border-blue-300"
                            }`}
                          >
                            {data}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge
                        className={`text-xs ${
                          theme === "dark"
                            ? "bg-pink-500/20 text-pink-300 border-pink-400/30"
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}
                      >
                        {t.notDetected}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <Card
              className={`transition-all duration-300 border ${
                theme === "dark"
                  ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Target
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  {t.improvements}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-500"
                        }`}
                      />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Indexing */}
            <Card
              className={`transition-all duration-300 border ${
                theme === "dark"
                  ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Search
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-cyan-400" : "text-blue-600"
                    }`}
                  />
                  {t.indexing}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {t.robotsTxt}
                  </span>
                  <StatusBadge
                    condition={result.indexing.robotsTxt}
                    trueText={t.present}
                    falseText={t.missing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {t.canonical}
                  </span>
                  <StatusBadge
                    condition={result.indexing.canonical}
                    trueText={t.present}
                    falseText={t.missing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {t.noIndexFlags}
                  </span>
                  <Badge
                    className={`${
                      result.indexing.noIndexFlags === 0
                        ? theme === "dark"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
                          : "bg-green-100 text-green-700 border-green-300"
                        : theme === "dark"
                        ? "bg-pink-500/20 text-pink-300 border-pink-400/30"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                  >
                    {result.indexing.noIndexFlags}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card
              className={`transition-all duration-300 border ${
                theme === "dark"
                  ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <BarChart3
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  {t.contentStats}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {t.wordCount}
                  </span>
                  <Badge
                    className={`${
                      theme === "dark"
                        ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
                        : "bg-purple-100 text-purple-700 border-purple-300"
                    }`}
                  >
                    {result.contentStats.wordCount.toLocaleString()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.headings}
                  </div>
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
                <div className="flex justify-between items-center">
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {t.tldr}
                  </span>
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
          <Card
            className={`transition-all duration-300 border ${
              theme === "dark"
                ? "bg-gray-900/50 backdrop-blur-md border-gray-700/50"
                : "bg-white/80 border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <Code
                  className={`h-6 w-6 ${
                    theme === "dark" ? "text-pink-400" : "text-pink-600"
                  }`}
                />
                {t.rawData}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                className={`text-sm overflow-auto max-h-96 p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-black/50 text-green-400 border-gray-700"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                }`}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
