import type { Config } from "jest";
import nextJest from "next/jest.js";

// `next/jest` wires up SWC transforms for TS/JSX and Next-specific mocks
// (next/font, next/image, CSS modules) without us hand-rolling a babel/ts-jest
// pipeline — simplest option against Next 15 / React 19 (see CLAUDE.md
// "테스트 러너" / ADR-012).
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

export default createJestConfig(config);
