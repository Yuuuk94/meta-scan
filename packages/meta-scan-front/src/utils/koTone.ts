// 이슈 #17(한국어 카피 톤 통일) 회귀 방지용 순수 함수. docs/design/design-system.md의
// "한국어 카피 톤" 규칙: 평서형은 -습니다/-입니다(및 -합니다/-됩니다 같은 동일 계열 합쇼체
// 어미), 권유·안내는 -해 주세요. 해라체 평서형(-다, "이다"/"아니다" 포함)이나 순수 명령형
// (-하라, -보라 등)은 전부 금지.
//
// 합쇼체 평서형(~습니다/~입니다/~합니다/~됩니다 …)은 항상 마지막 세 글자가 "[받침 ㅂ]니다"
// 형태다(예: 습니다=스+ㅂ, 입니다=이+ㅂ, 합니다=하+ㅂ). "아니다"처럼 마지막 세 글자가 "니다"로
// 끝나더라도 그 앞 글자에 받침 ㅂ이 없으면 해라체이므로, 문자열 일치가 아니라 한글 음절
// 분해(받침 확인)로 두 어미를 구분한다.

const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const FINAL_CONSONANT_COUNT = 28;
const BIEUP_FINAL_INDEX = 17; // 받침 'ㅂ' (습/입/합/됩/옵/갑/봅 … 계열이 전부 여기 해당)

const hasBieupFinal = (char: string): boolean => {
  const code = char.charCodeAt(0) - HANGUL_SYLLABLE_START;
  if (code < 0 || code > HANGUL_SYLLABLE_END - HANGUL_SYLLABLE_START) return false;
  return code % FINAL_CONSONANT_COUNT === BIEUP_FINAL_INDEX;
};

// 문장 끝의 장식(마침표/물음표/느낌표, "({count}개)" 같은 후행 괄호 보충어)을 걷어내
// 실제 종결어미가 드러나게 한다.
const stripTrailingDecoration = (value: string): string => {
  let core = value.trim();
  core = core.replace(/[.!?~]+$/, "");
  core = core.replace(/\s*\([^)]*\)\s*$/, "");
  core = core.replace(/[.!?~]+$/, "");
  return core;
};

const isFormalDeclarativeEnding = (core: string): boolean => {
  if (core.length < 3) return false;
  const [a, b, c] = core.slice(-3);
  return b === "니" && c === "다" && hasBieupFinal(a);
};

/**
 * 값이 해라체 평서형(-다/이다/아니다) 또는 순수 명령형(-하라/-보라)으로 끝나면 true.
 * -습니다/-입니다류 합쇼체 평서형, -해 주세요류 권유형, 또는 완결된 문장이 아닌 라벨/
 * 고유명사(다/라로 끝나지 않는 값)는 false.
 */
export const hasInformalKoreanTone = (value: string): boolean => {
  const core = stripTrailingDecoration(value);
  if (!/[가-힣](다|라)$/.test(core)) return false;
  if (isFormalDeclarativeEnding(core)) return false;
  return true;
};
