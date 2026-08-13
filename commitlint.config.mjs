// Conventional Commits 규칙을 강제합니다: `<type>(<scope>)?: <subject>`
// type: build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test
// scope는 필수는 아니지만, 모노레포 특성상 api / front / 루트 어디를 건드렸는지 표시하고
// 싶으면 `feat(api): ...`, `fix(front): ...`처럼 패키지명을 scope로 쓰는 걸 권장합니다.
export default {
  extends: ["@commitlint/config-conventional"],
};
