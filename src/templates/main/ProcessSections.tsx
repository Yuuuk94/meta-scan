export const ProcessSection = () => {
  return (
    <section className="bg-gradient-to-r from-black via-gray-900 to-black py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold text-white mb-4">
              <span className="text-cyan-400">[</span> EXECUTION PROTOCOL{" "}
              <span className="text-cyan-400">]</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-mono font-bold text-xl text-black group-hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all">
                  01
                </div>
                <div className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent hidden md:block"></div>
              </div>
              <h3 className="font-mono font-bold text-cyan-400 mb-2">
                INPUT.URL
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                타겟 웹사이트 URL 입력 및 검증
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-mono font-bold text-xl text-black group-hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all">
                  02
                </div>
                <div className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
              </div>
              <h3 className="font-mono font-bold text-purple-400 mb-2">
                AUTO.SCAN
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                멀티 스레드 병렬 분석 실행
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center font-mono font-bold text-xl text-black group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all">
                  03
                </div>
              </div>
              <h3 className="font-mono font-bold text-pink-400 mb-2">
                REPORT.GEN
              </h3>
              <p className="text-gray-400 font-mono text-sm">
                종합 분석 리포트 생성 및 출력
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
