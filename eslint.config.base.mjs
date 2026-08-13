// meta-scan-api / meta-scan-front가 공유하는 공통 ESLint 규칙.
// 프레임워크별 규칙(Next.js core-web-vitals 등)은 각 패키지의 eslint.config에서 이 파일을
// import해 합성(spread)하는 방식으로 계속 따로 관리합니다 — 이 파일에는 두 패키지 모두에
// 적용해도 말이 되는 TypeScript 공통 규칙만 둡니다.
export const sharedIgnores = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.next/**",
  "**/build/**",
  "**/out/**",
];

export const sharedTypeScriptRules = {
  // 미사용 변수는 경고로만 — `_`로 시작하는 인자(콜백 시그니처 유지용)는 예외
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  // Express 미들웨어 시그니처(err: any 등)처럼 any가 불가피한 경우가 있어 error 대신 warn
  "@typescript-eslint/no-explicit-any": "warn",
};
