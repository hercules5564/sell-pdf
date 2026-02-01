"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/lib/catalog";
import { Button, Card } from "@/components/ui";

type Props = { companies: Company[] };

export function CompanySearch({ companies }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [companies, query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon className="size-4" />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search companies by name or topic…"
          className="h-12 w-full rounded-xl border-2 border-card-border bg-card pl-11 pr-10 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
          aria-label="Search companies"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
            aria-label="Clear search"
          >
            <ClearIcon className="size-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-card-border bg-muted-bg p-10 text-center">
          <p className="text-sm font-semibold text-foreground">
            No companies match &quot;{query}&quot;
          </p>
          <p className="mt-1 text-xs text-muted">
            Try a different search or clear the search to see all.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.slug} hover>
              <div className="text-lg font-bold text-foreground">{c.name}</div>
              <div className="mt-1 text-sm text-muted">{c.tagline}</div>
              <div className="mt-6">
                <Button href={`/companies/${c.slug}`} variant="secondary">
                  Browse PDFs →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
