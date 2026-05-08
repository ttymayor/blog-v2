import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLanyard, type SpotifyData } from "@/lib/lanyard";
import FlipCard from "@/components/react/FlipCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// === Animated Bio ===
function AnimatedBio({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [width, setWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.getBoundingClientRect().width);
    }
  }, [idx]);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-foreground/70 text-sm">
      是一個
      <span
        style={{
          display: "inline-block",
          width: width > 0 ? width : "auto",
          transition: "width 0.3s ease",
          position: "relative",
          marginInline: "0.3rem",
        }}
      >
        <span
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease",
            whiteSpace: "nowrap",
            display: "inline-block",
            textDecoration: "underline",
            textDecorationStyle: "dashed",
            textUnderlineOffset: "0.25rem",
          }}
        >
          {words[idx]}
        </span>
      </span>
      的人
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          whiteSpace: "nowrap",
          visibility: "hidden",
          pointerEvents: "none",
          fontSize: "inherit",
        }}
      >
        {words[idx]}
      </span>
    </span>
  );
}

// === Spotify Progress ===
function useSpotifyProgress(timestamps: { start: number; end: number } | null) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!timestamps) return;

    const update = () => {
      const now = Date.now();
      const total = timestamps.end - timestamps.start;
      const elapsed = now - timestamps.start;
      setProgress(Math.min(elapsed / total, 1));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timestamps]);

  return progress;
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// === Spotify Dialog Content ===
function SpotifyDialogContent({ spotify }: { spotify: SpotifyData }) {
  const progress = useSpotifyProgress(spotify.timestamps);
  const total = spotify.timestamps.end - spotify.timestamps.start;
  const elapsed = total * progress;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <img
          src={spotify.album_art_url}
          alt={spotify.song}
          className="size-16 shrink-0 rounded-lg shadow-md"
        />
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-base font-semibold">
            {spotify.song}
          </p>
          <p className="text-muted-foreground truncate text-sm">
            {spotify.artist
              .split(";")
              .map((artist) => artist.trim())
              .join("、")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {formatMs(elapsed)}
        </span>
        <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {formatMs(total)}
        </span>
      </div>
    </div>
  );
}

interface ProfileAvatarProps {
  src: string;
  alt: string;
  name: string;
  words?: string[];
}

export default function ProfileAvatar({
  src,
  alt,
  name,
  words = [],
}: ProfileAvatarProps) {
  const lanyard = useLanyard();
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  const hasSpotify = lanyard.listeningToSpotify && lanyard.spotify;

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        {/* Avatar */}
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-full transition-opacity hover:opacity-80 active:opacity-60"
          onClick={() => setCardOpen(true)}
        >
          <img
            src={src}
            alt={alt}
            style={{ viewTransitionName: "site-avatar" }}
            className="h-16 w-16 rounded-full object-cover shadow-lg md:h-20 md:w-20"
          />
        </button>

        {/* Name + Spotify */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <h1 className="mb-0 text-2xl font-bold">{name}</h1>
            {hasSpotify && (
              <button
                type="button"
                onClick={() => setSpotifyOpen(true)}
                className="group text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-full border px-1.5 py-1 text-xs transition-colors hover:border-[#1DB954]/40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="#1DB954"
                  className="size-3.5 shrink-0"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="max-w-36 truncate">
                  {lanyard.spotify!.song}
                </span>
              </button>
            )}
          </div>
          {words.length > 0 && (
            <p>
              <AnimatedBio words={words} />
            </p>
          )}
        </div>
      </div>

      {/* Spotify Dialog */}
      {hasSpotify && (
        <Dialog open={spotifyOpen} onOpenChange={setSpotifyOpen}>
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>正在聽 Spotify</DialogTitle>
              <DialogDescription className="sr-only">
                正在聽 Spotify
              </DialogDescription>
            </DialogHeader>
            <SpotifyDialogContent spotify={lanyard.spotify!} />
          </DialogContent>
        </Dialog>
      )}

      {/* FlipCard Dialog */}
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-xl [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>名片</DialogTitle>
            <DialogDescription>點擊卡片以翻轉</DialogDescription>
          </DialogHeader>
          <FlipCard avatarSrc={src} />
        </DialogContent>
      </Dialog>
    </>
  );
}
