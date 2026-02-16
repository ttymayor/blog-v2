import { useSyncExternalStore } from "react";

const DISCORD_USER_ID = "753581988828545034";

// === Types ===
export type DiscordStatusType = "online" | "idle" | "dnd" | "offline";

export interface SpotifyData {
  song: string;
  artist: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
}

export interface DiscordActivity {
  id: string;
  name: string;
  type: 0 | 1 | 2 | 3 | 4 | 5;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: { name: string; id?: string; animated?: boolean };
  url?: string;
}

export interface LanyardState {
  status: DiscordStatusType;
  listeningToSpotify: boolean;
  spotify: SpotifyData | null;
  activities: DiscordActivity[];
}

// === Singleton Store ===
const DEFAULT_STATE: LanyardState = {
  status: "offline",
  listeningToSpotify: false,
  spotify: null,
  activities: [],
};

let currentState: LanyardState = DEFAULT_STATE;
let listeners = new Set<() => void>();
let ws: WebSocket | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | undefined;
let subscriberCount = 0;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function connect() {
  if (ws) return;

  ws = new WebSocket("wss://api.lanyard.rest/socket");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.op === 1) {
      ws!.send(
        JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_USER_ID },
        }),
      );
      heartbeatInterval = setInterval(() => {
        ws?.send(JSON.stringify({ op: 3 }));
      }, data.d.heartbeat_interval);
    }

    if (data.op === 0) {
      currentState = {
        status: data.d.discord_status ?? "offline",
        listeningToSpotify: data.d.listening_to_spotify ?? false,
        spotify: data.d.spotify ?? null,
        activities: data.d.activities ?? [],
      };
      emit();
    }
  };

  ws.onclose = () => {
    cleanup();
    // Reconnect if there are still subscribers
    if (subscriberCount > 0) {
      setTimeout(connect, 3000);
    }
  };

  ws.onerror = () => {
    ws?.close();
  };
}

function cleanup() {
  clearInterval(heartbeatInterval);
  heartbeatInterval = undefined;
  ws = null;
}

function disconnect() {
  if (ws) {
    // Prevent reconnect on intentional disconnect
    const socket = ws;
    ws = null;
    clearInterval(heartbeatInterval);
    heartbeatInterval = undefined;
    socket.onclose = null;
    socket.close();
  }
  currentState = DEFAULT_STATE;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  subscriberCount++;
  if (subscriberCount === 1) {
    connect();
  }
  return () => {
    listeners.delete(listener);
    subscriberCount--;
    if (subscriberCount === 0) {
      disconnect();
    }
  };
}

function getSnapshot(): LanyardState {
  return currentState;
}

function getServerSnapshot(): LanyardState {
  return DEFAULT_STATE;
}

// === Hook ===
export function useLanyard(): LanyardState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
