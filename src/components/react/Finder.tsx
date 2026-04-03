import { useState, useCallback } from "react";
import { ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  type Category,
  type BookFilter,
  books,
  techStacks,
  slides,
  projects,
  events,
  devRules,
  personalityData,
  categoryLabels,
  CDN,
} from "@/components/react/finder/data";
import finderAppIcon from "@/assets/FinderAppIcon_1024x1024x32.png";
import {
  TrafficLights,
  BookIcon,
  SlideIcon,
  FolderIcon,
  EventIcon,
  RuleIcon,
  ExternalLinkIcon,
  GitHubIcon,
  sidebarIcons,
} from "@/components/react/finder/icons";

// ── Shared UI ───────────────────────────────────────────────

function SidebarItem({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
        active
          ? "bg-blue-500/20 text-blue-400"
          : "text-neutral-400 hover:bg-white/5 hover:text-neutral-300"
      }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-[11px] text-neutral-500">{count}</span>
      )}
    </button>
  );
}

function rowClass(i: number, selected: boolean) {
  if (selected) return "bg-blue-500/20";
  return i % 2 === 0
    ? "bg-transparent hover:bg-white/[0.03]"
    : "bg-white/[0.02] hover:bg-white/[0.05]";
}

// ── Main Component ──────────────────────────────────────────

export function Finder() {
  const [history, setHistory] = useState<Category[]>(["books"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookFilter, setBookFilter] = useState<BookFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const category = history[historyIndex];

  const switchCategory = useCallback(
    (cat: Category) => {
      if (cat === history[historyIndex]) return;
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(cat);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setSelectedIndex(null);
    },
    [history, historyIndex],
  );

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    setHistoryIndex(historyIndex - 1);
    setSelectedIndex(null);
  }, [canGoBack, historyIndex]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    setHistoryIndex(historyIndex + 1);
    setSelectedIndex(null);
  }, [canGoForward, historyIndex]);

  const filteredBooks = books.filter((book) => {
    switch (bookFilter) {
      case "recommended":
        return book.recommended;
      case "in-progress":
        return book.percentage > 1;
      case "not-started":
        return book.percentage <= 1;
      default:
        return true;
    }
  });

  const itemCount = (() => {
    switch (category) {
      case "books":
        return filteredBooks.length;
      case "tech":
        return techStacks.length;
      case "slides":
        return slides.length;
      case "projects":
        return projects.length;
      case "events":
        return events.length;
      case "personality":
        return personalityData.length;
      case "devRules":
        return devRules.length;
    }
  })();

  return (
    <section id="finder">
      <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-[#1e1e1e] shadow-2xl">
        {/* Title Bar */}
        <div className="flex items-center gap-4 border-b border-neutral-700/50 bg-[#2a2a2a] px-4 py-3">
          <TrafficLights />
          <div className="flex flex-1 items-center justify-center gap-2">
            <img src={finderAppIcon.src} alt="Finder" className="size-4" />
            <span className="text-sm font-medium text-neutral-300">
              {categoryLabels[category]}
            </span>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-700/50 bg-[#252525] px-4 py-2">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goBack}
              disabled={!canGoBack}
              className="size-7 text-neutral-400 hover:bg-white/5 hover:text-neutral-200 disabled:text-neutral-600"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={goForward}
              disabled={!canGoForward}
              className="size-7 text-neutral-400 hover:bg-white/5 hover:text-neutral-200 disabled:text-neutral-600"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          {/* Mobile category tabs */}
          <div className="mx-4 flex min-w-0 items-center gap-1 overflow-x-auto md:hidden">
            {(Object.keys(categoryLabels) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => switchCategory(cat)}
                className={`rounded px-2 py-0.5 text-[11px] whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="shrink-0 text-[11px] font-medium whitespace-nowrap text-neutral-500">
            {itemCount} items
          </div>
        </div>

        <div className="flex h-[480px]">
          {/* ── Sidebar ── */}
          <ScrollArea className="hidden w-48 shrink-0 border-r border-neutral-700/50 bg-[#1e1e1e]/80 md:block">
            <div className="p-3">
              <div className="mb-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
                Categories
              </div>
              <div className="flex flex-col gap-0.5">
                <SidebarItem
                  label="Reading List"
                  count={books.length}
                  active={category === "books"}
                  onClick={() => switchCategory("books")}
                  icon={sidebarIcons.grid}
                />
                <SidebarItem
                  label="Tech Stacks"
                  count={techStacks.length}
                  active={category === "tech"}
                  onClick={() => switchCategory("tech")}
                  icon={sidebarIcons.chip}
                />
                <SidebarItem
                  label="Slides"
                  count={slides.length}
                  active={category === "slides"}
                  onClick={() => switchCategory("slides")}
                  icon={sidebarIcons.presentation}
                />
                <SidebarItem
                  label="Projects"
                  count={projects.length}
                  active={category === "projects"}
                  onClick={() => switchCategory("projects")}
                  icon={sidebarIcons.folder}
                />
                <SidebarItem
                  label="Events"
                  count={events.length}
                  active={category === "events"}
                  onClick={() => switchCategory("events")}
                  icon={sidebarIcons.ticket}
                />
                <SidebarItem
                  label="Personality"
                  count={personalityData.length}
                  active={category === "personality"}
                  onClick={() => switchCategory("personality")}
                  icon={sidebarIcons.radar}
                />
                <SidebarItem
                  label="Dev Rules"
                  count={devRules.length}
                  active={category === "devRules"}
                  onClick={() => switchCategory("devRules")}
                  icon={sidebarIcons.rules}
                />
              </div>

              {category === "books" && (
                <>
                  <div className="mt-5 mb-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
                    Filter
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <SidebarItem
                      label="All"
                      count={books.length}
                      active={bookFilter === "all"}
                      onClick={() => {
                        setBookFilter("all");
                        setSelectedIndex(null);
                      }}
                      icon={sidebarIcons.grid}
                    />
                    <SidebarItem
                      label="Recommended"
                      count={books.filter((b) => b.recommended).length}
                      active={bookFilter === "recommended"}
                      onClick={() => {
                        setBookFilter("recommended");
                        setSelectedIndex(null);
                      }}
                      icon={<ThumbsUp className="size-4 shrink-0" />}
                    />
                    <SidebarItem
                      label="In Progress"
                      count={books.filter((b) => b.percentage > 1).length}
                      active={bookFilter === "in-progress"}
                      onClick={() => {
                        setBookFilter("in-progress");
                        setSelectedIndex(null);
                      }}
                      icon={sidebarIcons.halfCircle}
                    />
                    <SidebarItem
                      label="Not Started"
                      count={books.filter((b) => b.percentage <= 1).length}
                      active={bookFilter === "not-started"}
                      onClick={() => {
                        setBookFilter("not-started");
                        setSelectedIndex(null);
                      }}
                      icon={sidebarIcons.circle}
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* ── Main Content ── */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* ── Books View ── */}
            {category === "books" && (
              <>
                <div className="grid shrink-0 grid-cols-[1fr_120px_80px] items-center border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase md:grid-cols-[1fr_180px_120px_80px]">
                  <span>Name</span>
                  <span className="hidden md:block">Author</span>
                  <span>Progress</span>
                  <span className="text-center">Rating</span>
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    {filteredBooks.map((item, i) => (
                      <button
                        key={item.title}
                        onClick={() =>
                          setSelectedIndex(selectedIndex === i ? null : i)
                        }
                        className={`grid w-full grid-cols-[1fr_120px_80px] items-center gap-1 border-b border-neutral-800/50 px-4 py-2.5 text-left transition-colors md:grid-cols-[1fr_180px_120px_80px] ${rowClass(i, selectedIndex === i)}`}
                      >
                        <div className="flex items-center gap-3">
                          <BookIcon />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-neutral-200">
                              {item.title}
                            </div>
                            <div className="truncate text-[11px] text-neutral-500 md:hidden">
                              {item.author}
                            </div>
                          </div>
                        </div>
                        <div className="hidden truncate text-[12px] text-neutral-400 md:block">
                          {item.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-700/50">
                            <div
                              className="h-full rounded-full bg-[#eebbc3] transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-[11px] text-neutral-500 tabular-nums">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-center">
                          {item.recommended && (
                            <ThumbsUp className="size-3.5 text-[#eebbc3]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                {selectedIndex !== null && filteredBooks[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-start gap-4">
                      <BookIcon />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {filteredBooks[selectedIndex].title}
                        </h4>
                        {filteredBooks[selectedIndex].author && (
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {filteredBooks[selectedIndex].author}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {filteredBooks[selectedIndex].tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-700/60 px-2.5 py-0.5 text-[11px] text-neutral-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-neutral-700/50">
                            <div
                              className="h-full rounded-full bg-[#eebbc3] transition-all duration-500"
                              style={{
                                width: `${filteredBooks[selectedIndex].percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] text-neutral-400 tabular-nums">
                            {filteredBooks[selectedIndex].percentage}% complete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Tech Stacks View ── */}
            {category === "tech" && (
              <>
                <div className="shrink-0 border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase">
                  Tech Stacks
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-5 gap-3 p-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
                      {techStacks.map((item, i) => (
                        <button
                          key={item.name}
                          onClick={() =>
                            setSelectedIndex(selectedIndex === i ? null : i)
                          }
                          className={`group flex flex-col items-center gap-2 rounded-lg p-3 transition-colors ${
                            selectedIndex === i
                              ? "bg-blue-500/20"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <img
                            src={`${CDN}/${item.icon}.svg`}
                            alt={item.name}
                            className="size-8 rounded-none"
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="truncate text-center text-[10px] text-neutral-400 group-hover:text-neutral-200">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                {selectedIndex !== null && techStacks[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`${CDN}/${techStacks[selectedIndex].icon}.svg`}
                        alt={techStacks[selectedIndex].name}
                        className="size-10 rounded-none"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {techStacks[selectedIndex].name}
                        </h4>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          Technology
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Slides View ── */}
            {category === "slides" && (
              <>
                <div className="grid shrink-0 grid-cols-[1fr_100px_100px] items-center border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase md:grid-cols-[1fr_150px_150px_80px]">
                  <span>Title</span>
                  <span>Date</span>
                  <span className="hidden md:block">Location</span>
                  <span className="text-center">Link</span>
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    {slides.map((item, i) => (
                      <button
                        key={item.title}
                        onClick={() =>
                          setSelectedIndex(selectedIndex === i ? null : i)
                        }
                        className={`grid w-full grid-cols-[1fr_100px_100px] items-center gap-1 border-b border-neutral-800/50 px-4 py-3 text-left transition-colors md:grid-cols-[1fr_150px_150px_80px] ${rowClass(i, selectedIndex === i)}`}
                      >
                        <div className="flex items-center gap-3">
                          <SlideIcon />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-neutral-200">
                              {item.title}
                            </div>
                            <div className="truncate text-[11px] text-neutral-500 md:hidden">
                              {item.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-[12px] text-neutral-400 tabular-nums">
                          {item.date}
                        </div>
                        <div className="hidden truncate text-[12px] text-neutral-400 md:block">
                          {item.location}
                        </div>
                        <div className="flex justify-center">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                {selectedIndex !== null && slides[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-start gap-4">
                      <SlideIcon />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {slides[selectedIndex].title}
                        </h4>
                        <p className="mt-0.5 text-xs text-neutral-400">
                          {slides[selectedIndex].location}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-neutral-700/60 px-2.5 py-0.5 text-[11px] text-neutral-300">
                            {slides[selectedIndex].date}
                          </span>
                          {slides[selectedIndex].made_with.map((tool) => (
                            <span
                              key={tool}
                              className="rounded-full bg-neutral-700/60 px-2.5 py-0.5 text-[11px] text-neutral-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-3">
                          <a
                            href={slides[selectedIndex].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-blue-400 hover:underline"
                          >
                            Open Slide
                          </a>
                          {slides[selectedIndex].pdf && (
                            <a
                              href={slides[selectedIndex].pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-blue-400 hover:underline"
                            >
                              Download PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Projects View ── */}
            {category === "projects" && (
              <>
                <div className="grid shrink-0 grid-cols-[1fr_60px] items-center border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase md:grid-cols-[1fr_auto_60px]">
                  <span>Project</span>
                  <span className="hidden md:block">Tags</span>
                  <span className="text-center">Links</span>
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    {projects.map((item, i) => (
                      <button
                        key={item.title}
                        onClick={() =>
                          setSelectedIndex(selectedIndex === i ? null : i)
                        }
                        className={`grid w-full grid-cols-[1fr_60px] items-center gap-2 border-b border-neutral-800/50 px-4 py-3 text-left transition-colors md:grid-cols-[1fr_auto_60px] ${rowClass(i, selectedIndex === i)}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FolderIcon />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-neutral-200">
                              {item.title}
                            </div>
                            <div className="flex items-center gap-1.5 md:hidden">
                              {item.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded bg-neutral-700/40 px-1.5 py-0.5 text-[10px] text-neutral-400"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="text-[10px] text-neutral-500">
                                  +{item.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="hidden items-center gap-1.5 md:flex">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-neutral-700/40 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-neutral-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          {item.site && (
                            <a
                              href={item.site}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLinkIcon />
                            </a>
                          )}
                          {item.repo && (
                            <a
                              href={item.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-neutral-400 hover:text-neutral-200"
                            >
                              <GitHubIcon />
                            </a>
                          )}
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                {selectedIndex !== null && projects[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-start gap-4">
                      <FolderIcon />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {projects[selectedIndex].title}
                        </h4>
                        <p className="mt-1 text-xs text-neutral-400">
                          {projects[selectedIndex].description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {projects[selectedIndex].tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-700/60 px-2.5 py-0.5 text-[11px] text-neutral-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-3">
                          {projects[selectedIndex].site && (
                            <a
                              href={projects[selectedIndex].site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-blue-400 hover:underline"
                            >
                              Visit Site
                            </a>
                          )}
                          {projects[selectedIndex].repo && (
                            <a
                              href={projects[selectedIndex].repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-blue-400 hover:underline"
                            >
                              GitHub Repo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Events View ── */}
            {category === "events" && (
              <>
                <div className="grid shrink-0 grid-cols-[1fr_1fr] items-center border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase md:grid-cols-[1fr_1fr_150px]">
                  <span>Event</span>
                  <span>Description</span>
                  <span className="hidden md:block">Roles</span>
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    {events.map((item, i) => (
                      <button
                        key={item.title}
                        onClick={() =>
                          setSelectedIndex(selectedIndex === i ? null : i)
                        }
                        className={`grid w-full grid-cols-[1fr_1fr] items-center gap-1 border-b border-neutral-800/50 px-4 py-3 text-left transition-colors md:grid-cols-[1fr_1fr_150px] ${rowClass(i, selectedIndex === i)}`}
                      >
                        <div className="flex items-center gap-3">
                          <EventIcon />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-neutral-200">
                              {item.title}
                            </div>
                          </div>
                        </div>
                        <div className="truncate text-[12px] text-neutral-400">
                          {item.description}
                        </div>
                        <div className="hidden text-[11px] text-neutral-500 md:block">
                          {item.roles.length} role
                          {item.roles.length > 1 ? "s" : ""}
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                {selectedIndex !== null && events[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-start gap-4">
                      <EventIcon />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {events[selectedIndex].title}
                        </h4>
                        <p className="mt-1 text-xs text-neutral-400">
                          {events[selectedIndex].description}
                        </p>
                        <div className="mt-3 flex flex-col gap-1">
                          {events[selectedIndex].roles.map((role) => (
                            <span
                              key={role}
                              className="text-[11px] text-neutral-300"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Personality View (Radar Chart) ── */}
            {category === "personality" && (
              <>
                <div className="shrink-0 border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase">
                  Personality Traits
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    <div className="flex flex-col items-center gap-6 p-6">
                      <ChartContainer
                        config={
                          {
                            Score: {
                              label: "Score",
                              color: "var(--chart-1)",
                            },
                          } satisfies ChartConfig
                        }
                        className="mx-auto h-[280px] w-full max-w-[400px]"
                      >
                        <RadarChart data={personalityData}>
                          <PolarAngleAxis
                            dataKey="traits"
                            tick={{ fill: "#a3a3a3", fontSize: 12 }}
                          />
                          <PolarGrid stroke="#404040" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Radar
                            dataKey="Score"
                            fill="var(--color-Score)"
                            fillOpacity={0.2}
                            stroke="var(--color-Score)"
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ChartContainer>
                      <div className="grid w-full max-w-[400px] grid-cols-2 gap-x-6 gap-y-2">
                        {personalityData.map((item) => (
                          <div
                            key={item.traits}
                            className="flex items-center justify-between"
                          >
                            <span className="text-[12px] text-neutral-400">
                              {item.traits}
                            </span>
                            <span className="text-[12px] font-medium text-neutral-200 tabular-nums">
                              {item.Score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}

            {/* ── Dev Rules View ── */}
            {category === "devRules" && (
              <>
                <div className="grid shrink-0 grid-cols-[1fr_60px] items-center border-b border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase">
                  <span>Rule</span>
                  <span className="text-center">Link</span>
                </div>
                <div className="min-h-0 flex-1">
                  <ScrollArea className="h-full">
                    {devRules.map((item, i) => (
                      <button
                        key={item.title}
                        onClick={() =>
                          setSelectedIndex(selectedIndex === i ? null : i)
                        }
                        className={`grid w-full grid-cols-[1fr_60px] items-center gap-1 border-b border-neutral-800/50 px-4 py-3 text-left transition-colors ${rowClass(i, selectedIndex === i)}`}
                      >
                        <div className="flex items-center gap-3">
                          <RuleIcon />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-neutral-200">
                              {item.title}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLinkIcon />
                          </a>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
                {selectedIndex !== null && devRules[selectedIndex] && (
                  <div className="shrink-0 border-t border-neutral-700/50 bg-[#1a1a1a] px-5 py-4">
                    <div className="flex items-start gap-4">
                      <RuleIcon />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-neutral-200">
                          {devRules[selectedIndex].title}
                        </h4>
                        <a
                          href={devRules[selectedIndex].href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-[12px] text-blue-400 hover:underline"
                        >
                          {devRules[selectedIndex].href}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between border-t border-neutral-700/50 bg-[#222] px-4 py-1.5 text-[11px] text-neutral-500">
          <span>{itemCount} items</span>
          <span>{categoryLabels[category]}</span>
        </div>
      </div>
    </section>
  );
}
