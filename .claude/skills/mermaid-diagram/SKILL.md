---
name: mermaid-diagram
description: 프로젝트 구조를 분석하여 Mermaid 다이어그램 HTML을 생성하고 브라우저를 실행하여 시각화합니다.
---

# Mermaid Diagram

현재 프로젝트의 `src/` 아래 코드를 분석해 컴포넌트/모듈 간 의존관계를 Mermaid `graph TD` 다이어그램으로
그리고, 그 즉시 브라우저로 열어 보여주는 스킬입니다. 목적은 "리포트를 남기는 것"이 아니라 **지금 이
아키텍처를 몇 초 안에 눈으로 확인하는 것**이므로, 분석이 끝나면 반드시 브라우저까지 띄운 뒤 마무리하세요.

모노레포처럼 `src/` 디렉터리가 여러 개(예: `packages/*/src`)면 각각을 찾아 패키지별로 Mermaid의
`subgraph`로 묶어 하나의 다이어그램 안에 표시하세요. `src/`가 하나뿐이면 subgraph 없이 단일
그래프로 그리면 됩니다.

## 1단계 — `src/` 스캔 및 의존성 분석

1. `node_modules`, `dist`, `build`, `.next` 등을 제외하고 프로젝트 안의 모든 `src/` 디렉터리를 찾습니다.
2. 각 `src/` 아래의 소스 파일(`.ts`/`.tsx`/`.js`/`.jsx` 등, 언어에 맞게)에서 **로컬 import만** 추출합니다
   (상대경로 `./`, `../` 및 `tsconfig.json`의 `paths` 별칭). `node_modules` 패키지(예: `react`,
   `express`)로의 import는 그래프를 잡음으로 채우므로 제외합니다.
3. 노드 단위는 **파일 하나하나가 아니라 의미 있는 컴포넌트 단위**로 잡으세요 — 보통
   `src/` 바로 아래 1~2단계 디렉터리(예: `modules/scan`, `core/http`, `infra`, `components/ui`,
   `templates/main`)가 적당합니다. 파일 수가 아주 적은 프로젝트라면 파일 단위로 그려도 됩니다.
   목적은 완전한 콜그래프가 아니라 "이 프로젝트가 어떻게 나뉘어 있고 무엇이 무엇에 의존하는지"를 한눈에
   보여주는 것입니다.
4. 각 컴포넌트 노드 사이의 import 관계를 엣지로 변환해 Mermaid `graph TD` 문법으로 작성합니다.
   예:
   ```
   graph TD
     subgraph meta-scan-api
       app[app.ts] --> modules_scan[modules/scan]
       modules_scan --> core_http[core/http]
       modules_scan --> infra[infra]
     end
   ```
5. grep/rg 같은 텍스트 검색으로 충분합니다 — 새 의존성(파서 라이브러리 등)을 설치하지 마세요.

## 2단계 — HTML 파일 생성

1. `docs/architecture/` 디렉터리를 만들고(없으면) `docs/architecture/index.html`을 생성합니다.
   이미 파일이 있으면 덮어씁니다(최신 아키텍처를 반영하는 것이 목적이므로).
2. Mermaid.js는 CDN으로 로드합니다(예: `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js`).
   별도 빌드/번들링 없이 이 HTML 파일 하나만으로 브라우저에서 바로 렌더링돼야 합니다.
3. **어두운 테마**를 적용합니다: `body` 배경은 `#1a1a1a`, Mermaid도 `theme: "dark"`로 초기화해 다이어그램
   자체도 어두운 배경에 어울리게 렌더링합니다.
4. 최소 구성 예시:
   ```html
   <!DOCTYPE html>
   <html lang="ko">
   <head>
     <meta charset="UTF-8" />
     <title>Architecture Diagram</title>
     <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
     <style>
       body { background: #1a1a1a; color: #eee; font-family: sans-serif; margin: 0; padding: 2rem; }
       h1 { color: #eee; }
       .mermaid { background: #1a1a1a; }
     </style>
   </head>
   <body>
     <h1>Architecture Diagram</h1>
     <pre class="mermaid">
   graph TD
     ...
     </pre>
     <script>
       mermaid.initialize({ startOnLoad: true, theme: "dark" });
     </script>
   </body>
   </html>
   ```
   1단계에서 만든 실제 그래프 문법을 `<pre class="mermaid">` 안에 그대로 채워 넣으세요.

## 3단계 — 브라우저 즉시 실행

파일을 저장했다고 끝난 게 아닙니다. OS를 확인해(`uname -s`) 절대경로로 바로 엽니다:

- macOS(`Darwin`): `open <절대경로>/docs/architecture/index.html`
- Linux: `xdg-open <절대경로>/docs/architecture/index.html`

상대경로가 아니라 절대경로를 사용하세요 — 이 명령을 실행하는 셸의 작업 디렉터리가 프로젝트 루트가
아닐 수 있습니다.

## 완료 보고

브라우저 실행 명령까지 성공적으로 실행한 뒤, 다른 설명 없이 다음 한 줄로 보고합니다:

> 아키텍처 다이어그램이 브라우저에서 열렸습니다.
