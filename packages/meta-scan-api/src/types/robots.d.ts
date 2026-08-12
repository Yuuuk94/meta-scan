interface ParsedRobots {
  records: RobotsRecords[];
  sitemaps: string[];
}

interface RobotsRecords {
  userAgents: string[];
  rules: {
    type: RobotsField;
    pattern: string;
    regex: RegExp;
    raw: string;
    rule?: RegExpMatchArray;
    matchedLength?: number;
  }[];
  _closed: boolean;
}

type RobotsField = "allow" | "disallow";
