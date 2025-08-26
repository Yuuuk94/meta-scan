"use client";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  return (
    <main>
      <h1>META SCAN Search</h1>
    </main>
  );
}
