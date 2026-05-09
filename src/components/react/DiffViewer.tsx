import { useState, useEffect } from "react";
import { PatchDiff } from "@pierre/diffs/react";
import { AlignLeft, Columns2, GitCommit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Commit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  diff: string;
}

function splitPatch(raw: string): string[] {
  return raw
    .split(/(?=^diff --git )/m)
    .filter((s) => s.trim().startsWith("diff --git "));
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function CommitHeader({ commit }: { commit: Commit }) {
  return (
    <div className="bg-muted/20 border-border flex items-start gap-3 rounded-lg border px-4 py-3">
      <GitCommit className="text-muted-foreground mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm leading-snug font-medium">{commit.message}</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {commit.author} ·{" "}
          <span className="font-mono">{commit.shortHash}</span> ·{" "}
          {new Date(commit.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function DiffOutput({
  patches,
  diffStyle,
  themeType,
}: {
  patches: string[];
  diffStyle: "unified" | "split";
  themeType: "light" | "dark";
}) {
  return (
    <>
      {patches.map((filePatch, i) => (
        <PatchDiff
          key={i}
          patch={filePatch}
          options={{
            diffStyle,
            diffIndicators: "classic",
            lineDiffType: "word",
            hunkSeparators: "line-info",
            themeType,
            theme: { dark: "github-dark", light: "github-light" },
          }}
        />
      ))}
    </>
  );
}

export default function DiffViewer({ commits = [] }: { commits?: Commit[] }) {
  const [selectedHash, setSelectedHash] = useState<string>(
    commits[0]?.hash ?? "",
  );
  const [diffStyle, setDiffStyle] = useState<"unified" | "split">("unified");
  const [themeType, setThemeType] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const update = () =>
      setThemeType(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    update();
    const handler = (e: Event) => setThemeType((e as CustomEvent).detail.theme);
    document.addEventListener("themechange", handler);
    return () => document.removeEventListener("themechange", handler);
  }, []);

  const selectedCommit = commits.find((c) => c.hash === selectedHash);
  const patches = selectedCommit ? splitPatch(selectedCommit.diff) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitCommit className="text-muted-foreground size-5" />
          <h1 className="font-serif text-xl font-bold">Recent Commits</h1>
        </div>
        <div className="border-border flex overflow-hidden rounded-md border">
          <button
            onClick={() => setDiffStyle("unified")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors",
              diffStyle === "unified"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <AlignLeft className="size-3.5" />
            Unified
          </button>
          <div className="bg-border w-px" />
          <button
            onClick={() => setDiffStyle("split")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors",
              diffStyle === "split"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Columns2 className="size-3.5" />
            Split
          </button>
        </div>
      </div>

      {/* Mobile: horizontal commit strip */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
        {commits.map((commit) => (
          <button
            key={commit.hash}
            onClick={() => setSelectedHash(commit.hash)}
            className={cn(
              "w-44 shrink-0 rounded-md border px-3 py-2 text-left transition-colors",
              selectedHash === commit.hash
                ? "border-border bg-muted/50"
                : "bg-muted/10 hover:bg-muted/30 border-transparent",
            )}
          >
            <div className="mb-0.5 flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-[11px]">
                {commit.shortHash}
              </span>
              <span className="text-muted-foreground/50 ml-auto shrink-0 text-[10px]">
                {timeAgo(commit.date)}
              </span>
            </div>
            <p className="text-foreground line-clamp-2 text-xs leading-snug">
              {commit.message}
            </p>
          </button>
        ))}
      </div>

      {/* Desktop: sidebar + diff */}
      <div className="hidden gap-5 lg:flex">
        <div className="flex w-64 shrink-0 flex-col gap-1">
          {commits.map((commit) => (
            <button
              key={commit.hash}
              onClick={() => setSelectedHash(commit.hash)}
              className={cn(
                "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
                selectedHash === commit.hash
                  ? "border-border bg-muted/50"
                  : "hover:bg-muted/30 border-transparent",
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-[11px]">
                  {commit.shortHash}
                </span>
                <span className="text-muted-foreground/50 ml-auto shrink-0 text-[11px]">
                  {timeAgo(commit.date)}
                </span>
              </div>
              <p className="text-foreground line-clamp-2 text-xs leading-snug">
                {commit.message}
              </p>
              <p className="text-muted-foreground/60 mt-1 text-[11px]">
                {commit.author}
              </p>
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {selectedCommit && <CommitHeader commit={selectedCommit} />}
          <DiffOutput
            patches={patches}
            diffStyle={diffStyle}
            themeType={themeType}
          />
        </div>
      </div>

      {/* Mobile: diff output (below strip) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {selectedCommit && <CommitHeader commit={selectedCommit} />}
        <DiffOutput
          patches={patches}
          diffStyle={diffStyle}
          themeType={themeType}
        />
      </div>
    </div>
  );
}
