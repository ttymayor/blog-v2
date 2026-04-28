import { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { useLanyard, type SpotifyData } from "@/lib/lanyard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
          <p className="text-muted-foreground/70 truncate text-xs">
            on Spotify
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {formatMs(elapsed)}
        </span>
        <div className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear"
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
  description: string;
}

export default function ProfileAvatar({
  src,
  alt,
  name,
  description,
}: ProfileAvatarProps) {
  const lanyard = useLanyard();
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  const hasSpotify = lanyard.listeningToSpotify && lanyard.spotify;

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={src}
            alt={alt}
            className="h-16 w-16 rounded-full object-cover shadow-lg md:h-20 md:w-20"
          />
        </div>

        {/* Name + Spotify + Description */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <h1 className="mb-0 text-3xl font-bold md:text-4xl">{name}</h1>
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
          <p
            className="text-muted-foreground text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: description }}
          />
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
    </>
  );
}
