import Link from "next/link";
import { NumberLabel } from "@/ui/atoms/NumberLabel";

interface CheckGroupsSectionProps {
  title: string;
  linkLabel: string;
  groups: { title: string; body: string; href?: string }[];
}

// issue #76 — home "무엇을 검사하나요": one explanatory block per check group,
// linking to that group's guide post when one exists.
export function CheckGroupsSection({ title, linkLabel, groups }: CheckGroupsSectionProps) {
  return (
    <section className="border-t-[1.5px] border-border py-20">
      <div className="content-frame">
        <h2 className="mb-10 font-display text-3xl font-extrabold text-foreground">{title}</h2>
        <ol className="grid grid-cols-1 gap-px border-[1.5px] border-foreground bg-foreground sm:grid-cols-2">
          {groups.map((g, i) => (
            <li
              key={g.title}
              className={`flex gap-4 bg-background p-6 ${
                groups.length % 2 === 1 && i === groups.length - 1 ? "sm:col-span-2" : ""
              }`}
            >
              <NumberLabel value={i + 1} className="w-9 shrink-0 text-2xl" />
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{g.body}</p>
                {g.href && (
                  <Link href={g.href} className="mt-3 inline-block text-sm font-bold text-accent hover:underline">
                    {linkLabel} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
