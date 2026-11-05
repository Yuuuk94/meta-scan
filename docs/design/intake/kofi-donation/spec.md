# Intake spec: Ko-fi 후원 버튼 (issue #63)

Date: 2026-10-30. Slug: `kofi-donation`.

## 0. Source and scope

- Canvas: `meta-scan Wireframes` (43c00b5f-73e5-4720-b77f-265dffe7e71c), page "후원 버튼 (#63)" (`donation-63`). Private, so the local `.dc.html` copies were used (same content).
- Used (4 artboards, each light + dark = 8 renders; the mobile bottom-block artboard was added 2026-11-04):

| Canvas artboard | Local file | Reference PNG (light / dark) |
|---|---|---|
| Donation63HeaderA | `Main.dc.html` | `reference/Donation63HeaderA.png` / `...-dark.png` |
| Donation63HeaderMobile | `HeaderMobile.dc.html` | `reference/Donation63HeaderMobile.png` / `...-dark.png` |
| Donation63ScanBottom | `ScanBottom.dc.html` | `reference/Donation63ScanBottom.png` / `...-dark.png` |
| Donation63ScanBottomMobile (added 2026-11-04) | `ScanBottomMobile.dc.html` | `reference/Donation63ScanBottomMobile.png` / `...-dark.png` |

- Discarded: HeaderB / HeaderC (+Dark) — rejected variants (per the issue #63 comment "헤더: A안"). Not read beyond the filename.
- Render notes: the `.dc.html` files depend on a `support.js` template runtime that is not in the folder, so I substituted each file's own `light`/`dark` theme object (`{{t.*}}`) into static HTML and rendered that. Dark renders come from the same file with `dark=true` (identical to the canvas `*Dark` artboards). The artboards have no page background of their own in dark (body is unstyled), so the area outside the header/section reads white in the dark PNGs — that is a render artifact, not a design spec. Treat `#141311` as the page background (matches `--background` dark).
- Artboards are fixed-width (1280 / 390 / 1280 / 390).

## 0.1 Resolved decisions (user, 2026-11-04, recorded on issue #63; supersede any earlier open question or suggestion below)

1. **Ko-fi URL** = env var `NEXT_PUBLIC_KOFI_URL`. When unset/empty, hide BOTH buttons (header + bottom block; the whole bottom block is not rendered, since it exists only to carry the link). Links open in a new tab: `target="_blank" rel="noopener noreferrer"`. **No GA4 click event.** Document the env var in `packages/meta-scan-front/CLAUDE.md` like the other `NEXT_PUBLIC_*` gates.
2. **New `Button` atom variant** (name suggested `support`, `cva` skeleton kept) used by all three button instances: light `bg-primary text-primary-foreground`, dark `bg-accent/50 text-foreground` (Paper text; `--foreground` dark = #faf6ed).
3. **Hover: no change at all** in either theme (no `hover:bg-*`, no text change). This is an intentional exception to the default variant's `hover:bg-primary/90`; the variant must not inherit any hover class.
4. **Bottom block mobile (<640px)**: now drawn, see §4.1. Stacked layout.
5. **en copy approved exactly as proposed** in §5.
6. **Icon**: inline the design's cup SVG verbatim (not lucide), §6.

Still out of scope (explicitly NOT part of #63, do not fix): the "header mismatches" list in §2 (right-group gap, language-toggle text, ghost buttons, atom-vs-design metric differences of the other header elements).

## 1. Cross-cutting decisions and open items (read first)

1. **[RESOLVED, see §0.1] Ko-fi URL.** Original note: spec as a config value. Suggested: `NEXT_PUBLIC_KOFI_URL` (same pattern as `NEXT_PUBLIC_CONTACT_EMAIL`/`NEXT_PUBLIC_ADSENSE_CLIENT_ID` in `packages/meta-scan-front/CLAUDE.md`), or a constant in `src/constans/index.ts`. Do not invent a URL. Decision for the user: what to render when the value is unset. Two options: (a) hide both buttons entirely (consistent with the AdSense/GA4 gating pattern: "unset = feature fully off", safe to deploy before the Ko-fi page exists), or (b) render with `href="#"`. Recommend (a). The artboards use `href="#"` only as a placeholder.
2. **[RESOLVED, see §0.1] Link behavior.** Original note: Both are plain `<a>` styled as buttons (the artboards use `<a>`, not `<button>`), external link. Suggested: `target="_blank"` + `rel="noopener noreferrer"`. Not specified by the design; confirm. Issue #63 also lists "단순 외부 링크 vs 위젯" and "GA4 클릭 이벤트 여부" as still undecided; the design is a plain link, no widget. A GA4 `trackEvent` click event is NOT in the design — do not add unless the user decides (would also need the `analyticsEvents` union extended and a privacy-page update test, see `app/__tests__/privacyAnalyticsDisclosure.test.ts`).
3. **Copy**: ko is drawn; **en is not drawn** — see §5 for the dictionary keys and proposed en strings (proposals only, user must confirm). No meta-commentary leaked into copy; every string below is user-facing in plain terms (checked).
4. Both buttons use the same cup icon (inline stroke SVG, see §6). Design-system §7 bans emoji-as-icon; stroke SVG is compliant.

## 2. Artboard: Header, desktop (Donation63HeaderA)

**Maps to**: `packages/meta-scan-front/src/ui/organisms/RootHeader.tsx` (existing). Add the support button as the last child of the right-hand `div` (currently `ToggleSetting` + `ServiceStatus`), i.e. after `ServiceStatus`. Likely a new small molecule/organism (e.g. `DonateButton`) taking `lang`/`t` like other components; built on the `Button` atom via `asChild` + `<a>`.

**Layout** (1280x80, `border-bottom: 4px solid fg`, padding `0 40px`, flex, space-between, align center):
- Left: wordmark link. `Meta-Scan` (Big Shoulders Display 900, 18px, uppercase, tracking -0.01em, line-height 1) and subtitle `AI 친화 AEO & GEO & SEO 분석기` (12px, margin-top 4px, sub color). Unchanged from the existing code.
- Right group: flex, align center, **gap 16px**, in order:
  1. Theme toggle: icon-only sun (16px), sub color, aria-label `테마 전환`.
  2. Language toggle: icon-only translate icon (16px), sub color, aria-label `English`.
  3. Status: 8px dot + `ONLINE` (12px, 700, tracking .04em, `ok` color), gap 8px.
  4. **Support button (new)**: `<a>`, flex, gap 8px, **height 36px, padding 0 14px**, bg `btnBg`, text `btnFg`, no underline, 13px / 700 / letter-spacing .04em, sharp corners. Content: 16px cup icon + text `후원하기`.

**Exact copy**: `후원하기`. (Other strings above already exist in the dictionaries.)

**Tokens**

| Role | Light | Dark | Project token |
|---|---|---|---|
| Header bg | `#FAF6ED` | `#141311` | `--background` |
| Header rule/text | `#141311` | `#FAF6ED` | `--foreground` |
| Sub text | `#4A473F` | `#B5AF9C` | light = `--foreground-secondary`; dark: design uses `#B5AF9C` = `--muted-foreground` dark, whereas `--foreground-secondary` dark is `#c9c3b2` (see mismatch below) |
| ONLINE | `#3E7D4F` | `#5FA372` | `--success` |
| **Button bg** | `#141311` | `rgba(255,107,69,.5)` | light = `--primary`; dark = `--accent` (#ff6b45 dark) at 50% = `dark:hover:bg-accent/50` of the ghost variant |
| **Button text** | `#FAF6ED` | `#FAF6ED` | light = `--primary-foreground`; dark = `--foreground` dark (#faf6ed) |

**Dark-mode implementation trap**: the dark `--primary` is `#faf6ed` (Paper bg / Ink text), i.e. the default `Button` variant inverts in dark and does NOT match this design. The decision (bg = ghost-hover color, text Paper) means: dark bg `bg-accent/50` and text `text-foreground`. Do NOT use the `accent` variant either (its dark text is `--accent-foreground` = `#141311`, Ink, not Paper). So this needs per-theme classes, e.g. `bg-primary text-primary-foreground dark:bg-accent/50 dark:text-foreground`, or a new `Button` variant (see conflict C1). Per front CLAUDE.md, dark branches in this repo are usually inline `theme === "dark"` ternaries, but the `Button` atom itself already uses `dark:` — either is fine; the `dark:` variant is wired to `data-theme` (globals.css line 8).

**Mismatches between design header and the current header code** (flag, not silently fixed; the support button is the only requested change):
- Right-group gap: design 16px vs code `gap-2` (8px). Adding the button at 8px spacing will look tighter than the artboard. Decision needed: change the group gap to `gap-4`, or leave.
- Language toggle: design is icon-only (aria-label `English`); code renders icon + `t.toggleLanguage` text ("English"/"한국어"). Existing behavior; not part of this issue. Confirm leave as is.
- Theme/lang buttons: design = bare 16px icons, no hover fill; code = `Button ghost size="sm"` (h-8 with hover fill). Existing; leave unless the user wants the header re-aligned.
- `ServiceStatus` is 12px in code; matches desktop (mobile artboard uses 11px, see §3).
- Sub text dark `#B5AF9C` (artboard) vs `--foreground-secondary` dark `#c9c3b2` (code) — pre-existing token choice; irrelevant to the new button.
- Button metrics: design 36px high = `Button` `size="default"` (`h-9`); but design padding is 14px vs atom `px-4`/`has-[>svg]:px-3` (12px with svg); font 13px/700/.04em vs atom `text-sm` 14px `font-medium`. Override with `text-[13px] font-bold tracking-[.04em] px-3.5`, or accept atom defaults (user's call; the difference is 1-2px).

**Hover/active**: none (resolved, §0.1 #3).

## 3. Artboard: Header, mobile (Donation63HeaderMobile)

**Maps to**: same `RootHeader.tsx`; the desktop and mobile buttons are one component switching at the `sm` breakpoint (this codebase's mobile/desktop split, `h-16 sm:h-20` already in RootHeader), not two elements in the DOM unless that is simpler for you.

**Layout** (390x64, border-bottom 4px, padding `0 16px`): wordmark 16px / subtitle 11px; right group flex, **gap 12px**: theme icon, language icon, status (dot + `ONLINE`, **11px**, gap 6px), then the support button.
- Support button: `<a>`, **40x40**, centered content, 18px cup icon only, same colors as desktop. `aria-label="Ko-fi로 후원하기"` (copy; confirm the ko/en strings in §5). No visible text.
- Note the 40x40 is taller than the desktop 36px and than `Button size="icon"` (`size-9` = 36px); needs `size-10` or arbitrary class. Also note existing code uses `px-5`/`content-frame` 20px side padding below `sm` vs the artboard's 16px (pre-existing, per `globals.css` comment).

**Exact copy**: aria-label `Ko-fi로 후원하기` only (see §5 for en).

**Tokens**: identical to §2.

**Accessibility**: icon-only link must have the aria-label on the `<a>`; the SVG is `aria-hidden`. Touch target 40px (good).

## 4. Artboard: Scan result bottom block (Donation63ScanBottom)

**Maps to**: `packages/meta-scan-front/src/ui/organisms/ScanResultScreen.tsx` (the `/scan/[id]` result, client component). Append after `<LighthouseCard>` as the last child of the `content-frame py-8` div (bottom of the page; there is no other bottom content). Suggested new organism `SupportBlock` (or `DonationBlock`). Do not render in the not-found / loading states, only on the real result view. Not on the blocked (`BlockedScreen`) or error screens: the design only specifies the result page.

**Layout** (artboard 1280x280 = outer padding `40px 56px` on page bg; this is the `content-frame` + vertical spacing; implementation margin-top equivalent to ~40px above, existing `LighthouseCard` supplies its own thick top rule so check the spacing visually):
- `<section>`: `border-top: 4px solid fg`, bg = card paper, padding `32px 40px`, **no side/bottom borders, no radius, no shadow**. CSS grid `repeat(12, minmax(0,1fr))`, column-gap 24px, align-items center.
  - Cols 1-2 (`span 2`): cup icon, **88x88**, stroke-width **1.5** (the header icons use 2), color = accent (`#FF4B1F` / dark `#FF6B45` = `--accent`).
  - Cols 3-9 (`span 7`): flex column, gap 8px.
    - Eyebrow: `SUPPORT` — 12px, 700, letter-spacing .08em, sub color.
    - Heading `<h2>`: `진단이 도움이 되셨다면` — Big Shoulders Display 800, 36px, line-height 1.05, tracking -0.01em, fg color.
    - Body `<p>`: `meta-scan은 무료로 운영됩니다. Ko-fi로 커피 한 잔을 후원해 주시면 서버 운영에 큰 힘이 됩니다.` — 15px, line-height 1.6, sub color.
  - Cols 10-12 (`span 3`): flex, justify flex-end. Button `<a>`: flex, gap 10px, **height 52px, padding 0 22px**, bg `btnBg`, text `btnFg` (same colors as header), 15px / 700 / letter-spacing .02em, 18px cup icon + text `Ko-fi로 후원하기`.

**Exact copy** (ko, verbatim):
- `SUPPORT`
- `진단이 도움이 되셨다면`
- `meta-scan은 무료로 운영됩니다. Ko-fi로 커피 한 잔을 후원해 주시면 서버 운영에 큰 힘이 됩니다.`
- `Ko-fi로 후원하기`

Tone check: sentences use 합니다체 (`운영됩니다`, `됩니다`), `후원해 주시면` fits §9. `진단이 도움이 되셨다면` is an unfinished conditional clause (title style), which `ko.tone.test.ts` should accept; verify when the test runs. "SUPPORT" is a hardcoded English eyebrow in the ko design; the existing eyebrow-style labels in this project are English-only too, so a shared (not localized) string is plausible, but still put it in the dictionary in both languages for consistency.

**Tokens**

| Role | Light | Dark | Project token |
|---|---|---|---|
| Page bg | `#FAF6ED` | `#141311` | `--background` |
| Section bg ("Card Paper") | `#FFF9F0` | `#1F1D19` | `--card-paper` (exists: `#fff9f0` / dark `#1f1d19`). Use this, NOT `--card` (which is pure `#ffffff` in light since 2026-09-02) |
| Rule + heading | `#141311` | `#FAF6ED` | `--foreground` |
| Eyebrow/body | `#4A473F` | `#B5AF9C` | light = `--foreground-secondary`; dark: artboard `#B5AF9C` (`--muted-foreground` dark) vs `--foreground-secondary` dark `#c9c3b2` — small mismatch; pick `--foreground-secondary` for consistency with the other screens, or match artboard exactly; user/publish-front call |
| Icon | `#FF4B1F` | `#FF6B45` | `--accent` |
| Button | same as header (see §2) | | |

### 4.1 Mobile variant (<640px, artboard Donation63ScanBottomMobile, 390x420)

Same component/placement as above; below `sm` switch from the 12-col grid to a single stacked column. Reference: `reference/Donation63ScanBottomMobile.png` / `-dark.png`.
- Outer padding `24px 16px` (page-bg area; use `content-frame`'s existing 20px side padding or override, note the artboard says 16px — pre-existing 20px vs 16px discrepancy, same as header; call out in QA rather than fix).
- `<section>`: `border-top: 4px solid fg`, bg `--card-paper`, padding `24px 20px`, flex column, **gap 16px**, no side/bottom borders, sharp corners.
  1. Cup icon, **48px**, stroke-width 1.5, accent color (`--accent`), left aligned.
  2. Text group (flex column, gap 8px): eyebrow `SUPPORT` (12px/700/.08em, sub color); `<h2>` `진단이 도움이 되셨다면` at **28px** (Big Shoulders Display 800, line-height 1.05, tracking -0.01em, fg); body 15px / line-height 1.6, sub color (2 lines at 390px).
  3. Button: **full width**, flex, centered, gap 10px, **height 52px**, 15px/700/.02em, 18px icon + `Ko-fi로 후원하기`; same `support` variant, no hover change.
- Copy and tokens identical to desktop block. Same gating (hidden when `NEXT_PUBLIC_KOFI_URL` unset).

## 5. Dictionary keys and en strings (APPROVED by user 2026-11-04, exactly as listed)

ko is from the design; en was not drawn, proposed by this intake and approved as-is. Suggested keys (naming is publish-front's call; header strings go under `head`, block under `scan`):

| Key (suggested) | ko (drawn) | en (approved) |
|---|---|---|
| `head.donate` | `후원하기` | `Support` |
| `head.donateAriaLabel` (mobile icon-only; also usable as `aria-label`/`title` on desktop) | `Ko-fi로 후원하기` | `Support on Ko-fi` |
| `scan.supportEyebrow` | `SUPPORT` | `SUPPORT` |
| `scan.supportTitle` | `진단이 도움이 되셨다면` | `Found this scan useful?` |
| `scan.supportBody` | `meta-scan은 무료로 운영됩니다. Ko-fi로 커피 한 잔을 후원해 주시면 서버 운영에 큰 힘이 됩니다.` | `meta-scan is free to use. If it helped, you can buy us a coffee on Ko-fi to help cover server costs.` |
| `scan.supportButton` | `Ko-fi로 후원하기` | `Support on Ko-fi` |

Notes (rationale, now moot since approved): "후원하기" literal = "Donate"/"Support"; I proposed "Support" to match the block's own eyebrow label and avoid sounding like a charity donation, alternative `Donate`. `Ko-fi` is the brand name, keep as is in en. The ko string says "서버 운영" (server operation); the en proposal says "server costs", a mild reword for natural English, user may prefer a literal translation. `en.json` and `ko.json` must keep identical key sets (the existing dictionary tests likely check this; run them).

## 6. Icon (cup)

Inline stroke SVG, 24x24 viewBox, `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, `aria-hidden="true"`; paths exactly:
- `M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z`
- `M16 10h2a3 3 0 0 1 0 6h-2`
- `M8 3v2M12 3v2`

Sizes/stroke: header desktop 16px / stroke 2; header mobile 18px / stroke 2; bottom button 18px / stroke 2; bottom large icon 88px / **stroke 1.5**. This is a custom drawing, not the lucide `Coffee` glyph (lucide `Coffee` has a different outline; the project uses `lucide-react` for other icons). Either inline the SVG verbatim (matches the artboard exactly, recommended) or accept `lucide-react` `Coffee` as a close approximation. **Resolved (§0.1 #6): inline verbatim.**

## 7. Conflicts with documented rules (flag for resolution; nothing was "fixed")

- **C1 (button variant) [RESOLVED: new `support` variant, §0.1 #2]**: design-system.md §4 CTA = filled Ink + Paper text. Light mode matches the existing `default` variant exactly. Dark mode does not: the project's `default` variant becomes Paper bg / Ink text in dark, while the design (and the confirmed decision) wants a translucent-orange fill with Paper text. The design system does not document a dark button; dark mode is "provisional" in `globals.css`. Needs either an ad-hoc class override or a new Button variant (e.g. `support`). Recommend a variant on the atom, keeping the shadcn `cva` skeleton, so both usages share it.
- **C2 (hover/active undefined) [RESOLVED: no hover change, §0.1 #3; the suggestion below is withdrawn]**: §4 says hover = background tone-down, never text change. The design draws no hover state. Moreover in dark the resting color already equals the ghost button's *hover* color (`accent/50`), so there is no obvious "tone-down" target. Suggested (needs confirmation): light `hover:bg-primary/90` (identical to the existing default variant), dark `dark:hover:bg-accent/60` or similar one step; text unchanged (Paper). Alternatively no hover change in dark.
- **C3 (brand accent as dark CTA fill)**: §2 allows the accent as CTA background ("CTA 배경... 강조") and it does not collide with the fail color, so no real violation; but at 50% alpha over `#141311` it composites to ~`#8B3A27`-ish brown-orange, not the brand orange. Also §7 forbids translucent glass (backdrop-blur), which this is not; plain alpha is fine. No change needed, noted for the visual QA expectation (the dark reference PNG shows the resulting muted rust fill).
- **C4 (accent at 50% and contrast)**: Paper text on `rgba(255,107,69,.5)` over `#141311` computes to roughly 6:1+ (light text on a dark rust), acceptable; light mode Ink/Paper is the standard CTA. No action; QA may check.
- Everything else complies: sharp corners (no radius), no shadows, no gradients, no emoji, Big Shoulders Display for the heading, IBM Plex Sans for body/buttons, warm Ink/Paper only, the 4px rule on the section matches the thick-rule section-break rule (§4 cards / §5), the section has top rule only rather than a boxed card (consistent with §4 "카드를 남발하지 않고 굵은 룰로 구분").

## 8. Gaps (not in the design or docs; do not invent without asking)

- **G1 [RESOLVED: artboard added, §4.1]**: No mobile artboard for the bottom block (original gap). At <640px a 12-col row with 88px icon + 36px heading + button will not fit. publish-front would have to invent the stack. Suggestion to propose to the user: stack vertically (icon above or hidden, heading ~28px, body, full-width button 48px+) — needs a decision or a new mobile artboard before publish.
- **G2**: New component pattern not in design-system.md: the "support/donation block" (eyebrow + h2 + body + CTA on Card Paper with a 4px top rule), and the filled-Ink header CTA at the far right of the header. Docs (design-system.md §4 component list) have no entry; publish-front should add a line there (and update the design-system.md palette notes if a `support` variant is introduced).
- **G3**: Eyebrow style (`12px / 700 / .08em`, uppercase English label) is not an existing token/atom; the project has `NumberLabel` for `01/02/03`, not for this. Check `ui/atoms` for an existing uppercase-eyebrow pattern in `ScanHero`/`AiSignalsCard` before creating a new one.
- **G4 [RESOLVED, §0.1 #1]**: Ko-fi URL / unset behavior / link target / click analytics.
- **G5**: Whether the donation block should appear when the page is a mock/dev result or for every result (assumed: every real result view).
- **G6**: Ads interplay: the site uses AdSense Auto Ads (issue #48), which may inject ad units near the bottom block. Not addressed by the design; QA should check that the support block is not displaced/overlapped.
- **G7**: Privacy/terms: an external link with no third-party script has no new data-collection disclosure implications (plain link); but if later changed to the Ko-fi widget (iframe/script), it becomes subject to the cookie-consent gating and `/privacy` text. Out of scope now.

## 9. Test pointers (for publish-front / QA, not exhaustive)

- Unit: dictionary key parity ko/en; `ko.tone.test.ts` still passes with the new strings; both buttons render nothing (or are hidden) when the URL config is unset (if option (a) chosen); `<a>` has correct `href`, `target`, `rel`; mobile icon-only link exposes `aria-label`.
- Visual QA against the 6 reference PNGs: header light/dark desktop at 1280, mobile at 390, scan bottom block light/dark at 1280. Header height must stay 80px/64px; button 36px (desktop) / 40px square (mobile); bottom button 52px high.
