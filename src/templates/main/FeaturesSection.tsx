import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Globe, Zap, Target } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="px-4 py-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-4">
            <span className="text-cyan-400">[</span> ANALYSIS MODULES{" "}
            <span className="text-cyan-400">]</span>
          </h2>
          <p className="text-gray-400 font-mono">
            세 가지 핵심 분석 엔진으로 웹사이트를 완전 분해
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sitemap Analysis */}
          <Card className="bg-black/40 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg w-fit group-hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all">
                <Globe className="h-8 w-8 text-cyan-400" />
              </div>
              <CardTitle className="font-mono text-cyan-400">
                SITEMAP.SCAN
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono text-sm">
                웹사이트 구조 매핑 및 링크 관계 분석
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">
                    XML/HTML 사이트맵 자동 탐지
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">페이지 계층 구조 시각화</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">링크 네트워크 분석</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Performance Analysis */}
          <Card className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg w-fit group-hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="font-mono text-purple-400">
                LIGHTHOUSE.EXE
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono text-sm">
                Google Lighthouse 기반 성능 진단
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">
                    페이지 로딩 속도 벤치마크
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Core Web Vitals 측정</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">성능 최적화 권고사항</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* SEO Analysis */}
          <Card className="bg-black/40 border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-lg w-fit group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all">
                <Target className="h-8 w-8 text-pink-400" />
              </div>
              <CardTitle className="font-mono text-pink-400">
                SEO.AUDIT
              </CardTitle>
              <CardDescription className="text-gray-400 font-mono text-sm">
                검색엔진 최적화 상태 검증
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">메타태그 완전성 검사</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">구조화 데이터 검증</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">접근성 표준 준수 확인</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
