export function TrafficLights({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClose}
        className="size-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
      />
      <div className="size-3 rounded-full bg-[#febc2e]" />
      <div className="size-3 rounded-full bg-[#28c840]" />
    </div>
  );
}

export function FinderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="2" width="18" height="20" rx="3" fill="#4A90D9" />
      <path
        d="M8 8.5C8 8.5 9 7 12 7C15 7 16 8.5 16 8.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="11" r="1.5" fill="white" />
      <circle cx="15" cy="11" r="1.5" fill="white" />
      <path
        d="M12 13V16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 17.5C9 17.5 10 19 12 19C14 19 15 17.5 15 17.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" fill="none">
      <rect x="4" y="3" width="24" height="26" rx="2" fill="#e8d5b7" />
      <rect x="6" y="5" width="20" height="22" rx="1" fill="#f5e6cc" />
      <rect x="4" y="3" width="5" height="26" rx="1" fill="#c9a96e" />
      <line
        x1="12"
        y1="10"
        x2="22"
        y2="10"
        stroke="#c9a96e"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="14"
        x2="20"
        y2="14"
        stroke="#d4b88c"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="17"
        x2="18"
        y2="17"
        stroke="#d4b88c"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SlideIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" fill="none">
      <rect x="4" y="4" width="24" height="18" rx="2" fill="#5b8def" />
      <rect x="6" y="6" width="20" height="14" rx="1" fill="#4a7bd9" />
      <rect x="12" y="22" width="8" height="2" rx="0.5" fill="#888" />
      <rect x="10" y="24" width="12" height="1.5" rx="0.5" fill="#666" />
      <line
        x1="10"
        y1="11"
        x2="22"
        y2="11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <line
        x1="10"
        y1="14"
        x2="18"
        y2="14"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function FolderIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" fill="none">
      <path
        d="M4 8a2 2 0 012-2h7.172a2 2 0 011.414.586L16 8h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
        fill="#64b5f6"
      />
      <path d="M4 10h24v14a2 2 0 01-2 2H6a2 2 0 01-2-2V10z" fill="#42a5f5" />
    </svg>
  );
}

export function EventIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" fill="none">
      <rect x="4" y="6" width="24" height="20" rx="3" fill="#e57373" />
      <rect x="4" y="6" width="24" height="7" rx="3" fill="#ef5350" />
      <rect x="10" y="3" width="3" height="6" rx="1.5" fill="#bbb" />
      <rect x="19" y="3" width="3" height="6" rx="1.5" fill="#bbb" />
      <circle cx="11" cy="19" r="1.5" fill="white" opacity="0.8" />
      <circle cx="16" cy="19" r="1.5" fill="white" opacity="0.8" />
      <circle cx="21" cy="19" r="1.5" fill="white" opacity="0.8" />
      <circle cx="11" cy="23" r="1.5" fill="white" opacity="0.5" />
      <circle cx="16" cy="23" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

export function RuleIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" fill="none">
      <rect x="4" y="3" width="24" height="26" rx="3" fill="#7c7c7c" />
      <rect x="6" y="5" width="20" height="22" rx="2" fill="#9e9e9e" />
      <line
        x1="10"
        y1="10"
        x2="22"
        y2="10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="10"
        y1="14.5"
        x2="22"
        y2="14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="10"
        y1="19"
        x2="17"
        y2="19"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M6 3H3v10h10v-3M9 2h5v5M14 2L7 9" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// Small 16x16 sidebar icons
export const sidebarIcons = {
  grid: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 1v2h3V4H4zm5 0v2h3V4H9zM4 8v2h3V8H4zm5 0v2h3V8H9z" />
    </svg>
  ),
  halfCircle: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 010 10V3z" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <rect x="4" y="4" width="8" height="8" rx="1" />
      <path
        d="M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  presentation: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <rect x="2" y="2" width="12" height="9" rx="1" />
      <path
        d="M8 11v3M5 14h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <path d="M2 4a1 1 0 011-1h3.586a1 1 0 01.707.293L8 4h5a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 00-1 1 1 1 0 001 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 001-1 1 1 0 00-1-1V4z" />
    </svg>
  ),
  radar: (
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <polygon points="8,2 13.5,5.5 12,12 4,12 2.5,5.5" />
      <polygon points="8,4.5 11,6.5 10,10.5 6,10.5 5,6.5" opacity="0.5" />
      <line x1="8" y1="2" x2="8" y2="8" opacity="0.3" />
      <line x1="13.5" y1="5.5" x2="8" y2="8" opacity="0.3" />
      <line x1="2.5" y1="5.5" x2="8" y2="8" opacity="0.3" />
    </svg>
  ),
  rules: (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
      <path d="M3 2a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H3zm1 2h8v1H4V4zm0 3h8v1H4V7zm0 3h5v1H4v-1z" />
    </svg>
  ),
};
