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
  return raw.split(/(?=^diff --git )/m).filter((s) => s.trim().startsWith("diff --git "));
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
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-muted/20 border border-border">
      <GitCommit className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{commit.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {commit.author} · <span className="font-mono">{commit.shortHash}</span> · {new Date(commit.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function DiffOutput({ patches, diffStyle, themeType }: { patches: string[]; diffStyle: "unified" | "split"; themeType: "light" | "dark" }) {
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
  const [selectedHash, setSelectedHash] = useState<string>(commits[0]?.hash ?? "");
  const [diffStyle, setDiffStyle] = useState<"unified" | "split">("unified");
  const [themeType, setThemeType] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const update = () =>
      setThemeType(document.documentElement.classList.contains("dark") ? "dark" : "light");
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <GitCommit className="size-5 text-muted-foreground" />
          <h1 className="text-xl font-bold font-serif">Recent Commits</h1>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden">
          <button
            onClick={() => setDiffStyle("unified")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors",
              diffStyle === "unified" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <AlignLeft className="size-3.5" />
            Unified
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => setDiffStyle("split")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors",
              diffStyle === "split" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Columns2 className="size-3.5" />
            Split
          </button>
        </div>
      </div>

      {/* Mobile: horizontal commit strip */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {commits.map((commit) => (
          <button
            key={commit.hash}
            onClick={() => setSelectedHash(commit.hash)}
            className={cn(
              "shrink-0 w-44 text-left px-3 py-2 rounded-md border transition-colors",
              selectedHash === commit.hash
                ? "border-border bg-muted/50"
                : "border-transparent bg-muted/10 hover:bg-muted/30"
            )}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[11px] text-muted-foreground">{commit.shortHash}</span>
              <span className="text-[10px] text-muted-foreground/50 ml-auto shrink-0">{timeAgo(commit.date)}</span>
            </div>
            <p className="text-xs text-foreground line-clamp-2 leading-snug">{commit.message}</p>
          </button>
        ))}
      </div>

      {/* Desktop: sidebar + diff */}
      <div className="hidden lg:flex gap-5">
        <div className="w-64 shrink-0 flex flex-col gap-1">
          {commits.map((commit) => (
            <button
              key={commit.hash}
              onClick={() => setSelectedHash(commit.hash)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md border transition-colors",
                selectedHash === commit.hash
                  ? "border-border bg-muted/50"
                  : "border-transparent hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-muted-foreground">{commit.shortHash}</span>
                <span className="text-[11px] text-muted-foreground/50 ml-auto shrink-0">{timeAgo(commit.date)}</span>
              </div>
              <p className="text-xs text-foreground line-clamp-2 leading-snug">{commit.message}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">{commit.author}</p>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {selectedCommit && <CommitHeader commit={selectedCommit} />}
          <DiffOutput patches={patches} diffStyle={diffStyle} themeType={themeType} />
        </div>
      </div>

      {/* Mobile: diff output (below strip) */}
      <div className="flex flex-col lg:hidden gap-3">
        {selectedCommit && <CommitHeader commit={selectedCommit} />}
        <DiffOutput patches={patches} diffStyle={diffStyle} themeType={themeType} />
      </div>
    </div>
  );
}
