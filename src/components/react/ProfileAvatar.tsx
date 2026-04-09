import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { Gamepad2, Tv, Eye, Trophy, Music, BadgeCheck } from "lucide-react";
import {
  useLanyard,
  type DiscordStatusType,
  type SpotifyData,
  type DiscordActivity,
} from "@/lib/lanyard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// === Status Icon ===
const STATUS_LABELS: Record<DiscordStatusType, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

function StatusIcon({ status }: { status: DiscordStatusType }) {
  const s = 16;
  switch (status) {
    case "online":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#3ba55c" />
        </svg>
      );
    case "idle":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#faa61a" />
          <circle cx="5" cy="5" r="5.5" fill="var(--background)" />
        </svg>
      );
    case "dnd":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#ed4245" />
          <rect
            x="3.5"
            y="6.5"
            width="9"
            height="3"
            rx="1.5"
            fill="var(--background)"
          />
        </svg>
      );
    case "offline":
      return (
        <svg width={s} height={s} viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#747f8d" />
          <circle cx="8" cy="8" r="4" fill="var(--background)" />
        </svg>
      );
  }
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

// === Activity Helpers ===
function useElapsedTime(startTimestamp?: number) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!startTimestamp) return;

    const update = () => {
      const diff = Math.floor((Date.now() - startTimestamp) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      if (hours > 0) {
        setElapsed(`for ${hours}h ${minutes}m`);
      } else {
        setElapsed(`for ${minutes}m`);
      }
    };

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [startTimestamp]);

  return elapsed;
}

function resolveAssetUrl(
  applicationId: string | undefined,
  raw: string | undefined,
): string | null {
  if (!raw) return null;
  if (raw.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${raw.slice("mp:external/".length)}`;
  }
  if (applicationId) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${raw}.png`;
  }
  return null;
}

function resolveActivityIcon(activity: DiscordActivity): string | null {
  return (
    resolveAssetUrl(activity.application_id, activity.assets?.small_image) ??
    resolveAssetUrl(activity.application_id, activity.assets?.large_image)
  );
}

const ACTIVITY_TYPE_CONFIG: Record<
  number,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  0: { label: "Playing", Icon: Gamepad2 },
  1: { label: "Streaming", Icon: Tv },
  3: { label: "Watching", Icon: Eye },
  5: { label: "Competing in", Icon: Trophy },
};

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
            {spotify.artist}
          </p>
          <p className="text-muted-foreground/70 truncate text-xs">
            {spotify.album_art_url && "on Spotify"}
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

// === Activity Dialog Content ===
function ActivityDialogContent({ activity }: { activity: DiscordActivity }) {
  const config = ACTIVITY_TYPE_CONFIG[activity.type];
  const elapsed = useElapsedTime(activity.timestamps?.start);
  const largeImage = resolveAssetUrl(
    activity.application_id,
    activity.assets?.large_image,
  );
  const smallImage = resolveAssetUrl(
    activity.application_id,
    activity.assets?.small_image,
  );

  if (!config) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {largeImage ? (
            <img
              src={largeImage}
              alt={activity.name}
              className="size-16 rounded-lg shadow-md"
            />
          ) : (
            <div className="bg-muted flex size-16 items-center justify-center rounded-lg">
              <config.Icon className="text-muted-foreground size-8" />
            </div>
          )}
          {smallImage && (
            <img
              src={smallImage}
              alt={activity.assets?.small_text ?? ""}
              className="ring-background absolute -right-1 -bottom-1 size-6 rounded-full ring-2"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-base font-semibold">
            {activity.name}
          </p>
          {activity.details && (
            <p className="text-muted-foreground truncate text-sm">
              {activity.details}
            </p>
          )}
          {activity.state && (
            <p className="text-muted-foreground/70 truncate text-sm">
              {activity.state}
            </p>
          )}
        </div>
      </div>
      {elapsed && <p className="text-muted-foreground text-xs">{elapsed}</p>}
      {activity.type === 1 && activity.url && (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#9147ff] underline hover:no-underline"
        >
          Watch Stream
        </a>
      )}
    </div>
  );
}

// === Activity Icon Button ===
function ActivityIconButton({
  icon,
  imageUrl,
  svgIcon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  imageUrl?: string | null;
  svgIcon?: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const Icon = icon;
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className="flex cursor-pointer items-center justify-center"
      >
        {svgIcon ? (
          svgIcon
        ) : imageUrl ? (
          <img src={imageUrl} alt={label} className="size-6 rounded" />
        ) : (
          <Icon className="text-muted-foreground size-6" />
        )}
      </button>
      <span className="bg-card text-foreground ring-border pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg ring-1 transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

// === Custom Status Badge ===
function CustomStatusBadge({ activity }: { activity: DiscordActivity }) {
  const emojiNode = activity.emoji ? (
    activity.emoji.id ? (
      <img
        src={`https://cdn.discordapp.com/emojis/${activity.emoji.id}.${activity.emoji.animated ? "gif" : "webp"}?size=20`}
        alt={activity.emoji.name}
        className="inline-block size-4"
      />
    ) : (
      <span>{activity.emoji.name}</span>
    )
  ) : null;

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
      {emojiNode}
      {activity.state && <span>{activity.state}</span>}
    </span>
  );
}

// === Verified Badge ===
function VerifiedBadge() {
  return (
    <BadgeCheck
      fill="#5865F2"
      strokeWidth={1.25}
      className="size-6 md:size-7"
    />
  );
}

// === Animated Avatar ===
const NORMAL_SPEED = 60;
const MAX_SPEED = 7200;
const FRICTION = 0.98;

type DialogTarget =
  | { kind: "spotify"; data: SpotifyData }
  | { kind: "activity"; data: DiscordActivity };

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
  const rotation = useMotionValue(0);
  const speedRef = useRef(NORMAL_SPEED);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lanyard = useLanyard();
  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const customStatus = useMemo(
    () => lanyard.activities.find((a) => a.type === 4),
    [lanyard.activities],
  );

  const displayActivities = useMemo(
    () =>
      lanyard.activities.filter(
        (a) => a.type !== 4 && a.type !== 2 && a.name !== "Spotify",
      ),
    [lanyard.activities],
  );

  useEffect(() => {
    const tick = (time: number) => {
      if (lastTimeRef.current) {
        const delta = (time - lastTimeRef.current) / 1000;
        rotation.set(rotation.get() + speedRef.current * delta);

        if (speedRef.current > NORMAL_SPEED) {
          speedRef.current *= FRICTION;
          if (speedRef.current < NORMAL_SPEED) {
            speedRef.current = NORMAL_SPEED;
          }
        }
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rotation]);

  const handleClick = () => {
    speedRef.current = MAX_SPEED;
  };

  const hasSpotify = lanyard.listeningToSpotify && lanyard.spotify;

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Avatar + Status */}
        <div className="relative w-fit shrink-0">
          <div
            onClick={handleClick}
            className="h-24 w-24 cursor-pointer rounded-full shadow-lg md:h-32 md:w-32"
          >
            <motion.img
              src={src}
              alt={alt}
              style={{ rotate: rotation }}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="group absolute right-1.5 bottom-1.5 md:right-2.5 md:bottom-2.5">
            <div className="ring-background flex items-center justify-center rounded-full ring-4">
              <StatusIcon status={lanyard.status} />
            </div>
            <span className="bg-card text-foreground ring-border pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-lg ring-1 transition-opacity group-hover:opacity-100">
              {STATUS_LABELS[lanyard.status]}
            </span>
          </div>
        </div>

        {/* Name + Activity Icons + Description */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h1 className="mb-0 text-3xl font-bold md:text-4xl">{name}</h1>
            <VerifiedBadge />
            {(hasSpotify || displayActivities.length > 0) && (
              <div className="flex items-center gap-1.5">
                {hasSpotify && (
                  <ActivityIconButton
                    icon={Music}
                    imageUrl={null}
                    svgIcon={
                      <svg
                        viewBox="0 0 24 24"
                        fill="#1DB954"
                        className="size-6"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    }
                    label={`${lanyard.spotify!.song} – ${lanyard.spotify!.artist}`}
                    onClick={() =>
                      setDialogTarget({
                        kind: "spotify",
                        data: lanyard.spotify!,
                      })
                    }
                  />
                )}
                {displayActivities.map((a) => {
                  const config = ACTIVITY_TYPE_CONFIG[a.type];
                  if (!config) return null;
                  const imageUrl = resolveActivityIcon(a);
                  return (
                    <ActivityIconButton
                      key={a.id}
                      icon={config.Icon}
                      imageUrl={imageUrl}
                      label={`${config.label} ${a.name}`}
                      onClick={() =>
                        setDialogTarget({ kind: "activity", data: a })
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
          {customStatus && (
            <div className="mb-2">
              <CustomStatusBadge activity={customStatus} />
            </div>
          )}
          <p
            className="text-muted-foreground text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>

      {/* Activity Detail Dialog */}
      <Dialog
        open={dialogTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDialogTarget(null);
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogTarget?.kind === "spotify"
                ? "Listening to Spotify"
                : dialogTarget?.kind === "activity"
                  ? (ACTIVITY_TYPE_CONFIG[dialogTarget.data.type]?.label ??
                    "Activity")
                  : "Activity"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Activity details
            </DialogDescription>
          </DialogHeader>
          {dialogTarget?.kind === "spotify" && (
            <SpotifyDialogContent spotify={dialogTarget.data} />
          )}
          {dialogTarget?.kind === "activity" && (
            <ActivityDialogContent activity={dialogTarget.data} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
