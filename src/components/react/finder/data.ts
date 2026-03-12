export type ReadingItem = {
  title: string;
  author?: string;
  percentage: number;
  href?: string;
  tags?: string[];
  recommended?: boolean;
};

export type SlideItem = {
  title: string;
  date: string;
  link: string;
  made_with: string[];
  location: string;
  pdf?: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  site?: string;
  repo?: string;
};

export type EventItem = {
  title: string;
  description: string;
  roles: string[];
};

export type TechItem = {
  name: string;
  icon: string;
};

export const CDN =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const books: ReadingItem[] = [
  {
    title: "被討厭的勇氣",
    author: "岸見一郎 & 古賀史健",
    percentage: 50,
    tags: ["心理學", "心理勵志"],
    recommended: true,
  },
  {
    title: "蛤蟆先生去看心理醫生",
    author: "羅伯特．戴博德（Robert de Board）",
    percentage: 15,
    tags: ["心理勵志"],
    recommended: true,
  },
  {
    title: "逆思維",
    author: "亞當．格蘭特（Adam Grant）",
    percentage: 40,
    tags: ["自我成長", "心理勵志"],
    recommended: true,
  },
  {
    title: "焦慮的意義",
    author: "薩米爾．喬普拉（Samir Chopra）",
    percentage: 1,
    tags: ["心理學", "心理勵志", "哲學"],
  },
  {
    title: "不能沒有父母",
    author: "珊卓拉．康拉德（Sandra Konrad）",
    percentage: 1,
    tags: ["心理勵志", "家庭關係"],
  },
  {
    title: "變成自己想望的大人",
    author: "侯文詠",
    percentage: 1,
    tags: ["人生故事", "文學小說", "散文", "心理勵志"],
  },
  {
    title: "厭世者求生指南",
    author: "李豪",
    percentage: 20,
    tags: ["散文", "文學小說"],
  },
];

export const techStacks: TechItem[] = [
  { name: "Astro", icon: "astro/astro-original" },
  { name: "React", icon: "react/react-original" },
  { name: "Next.js", icon: "nextjs/nextjs-original" },
  { name: "PHP", icon: "php/php-original" },
  { name: "Laravel", icon: "laravel/laravel-original" },
  { name: "Python", icon: "python/python-original" },
  { name: "Flask", icon: "flask/flask-original" },
  { name: "C++", icon: "cplusplus/cplusplus-original" },
  { name: "TypeScript", icon: "typescript/typescript-original" },
  { name: "Vue.js", icon: "vuejs/vuejs-original" },
  { name: "MongoDB", icon: "mongodb/mongodb-original" },
  { name: "MariaDB", icon: "mariadb/mariadb-original" },
  { name: "MySQL", icon: "mysql/mysql-original" },
  { name: "Docker", icon: "docker/docker-original" },
  { name: "Golang", icon: "go/go-original-wordmark" },
  { name: "Google Cloud", icon: "googlecloud/googlecloud-original" },
  { name: "Vercel", icon: "vercel/vercel-original" },
  { name: "Cloudflare", icon: "cloudflare/cloudflare-original" },
  { name: "Ubuntu", icon: "ubuntu/ubuntu-original" },
  { name: "Git", icon: "git/git-original" },
  { name: "pnpm", icon: "pnpm/pnpm-original" },
  { name: "VS Code", icon: "vscode/vscode-original" },
  { name: "Bash", icon: "bash/bash-original" },
  { name: "GitHub", icon: "github/github-original" },
  { name: "Tailwind CSS", icon: "tailwindcss/tailwindcss-original" },
  { name: "Markdown", icon: "markdown/markdown-original" },
  { name: "Hugo", icon: "hugo/hugo-original" },
  { name: "Figma", icon: "figma/figma-original" },
];

export const slides: SlideItem[] = [
  {
    title: "入門 Docker 開發技能 +1",
    date: "2025-05-15",
    link: "https://url.ttymayor.com/docker-slide",
    made_with: ["Figma"],
    location: "東海大學 - 駭客社",
    pdf: "https://url.ttymayor.com/docker-slide-pdf",
  },
  {
    title: "Linux - 你應該要認識的企鵝",
    date: "2025-09-18",
    link: "https://url.ttymayor.com/linux-slide",
    made_with: ["Figma"],
    location: "東海大學 - 駭客社",
    pdf: "https://url.ttymayor.com/linux-slide-pdf",
  },
  {
    title: "入門網頁漏洞",
    date: "2025-10-02",
    link: "https://url.ttymayor.com/web-vuln-slide",
    made_with: ["Slidev"],
    location: "東海大學 - 駭客社",
  },
];

export const projects: ProjectItem[] = [
  {
    title: "東海選課資訊",
    description: "利用爬蟲獲取選課資訊，優化 UI 介面，提供更方便的排課模擬功能",
    tags: ["Next.js", "Vercel", "Tailwind CSS", "Mongoose"],
    site: "https://thc.ttymayor.com/",
    repo: "https://github.com/ttymayor/thu-course-frontend",
  },
  {
    title: "東海選課資訊（爬蟲）",
    description: "使用 Python 爬蟲獲取東海選課資訊，並儲存到 MongoDB 中",
    tags: ["Python", "uv", "MongoDB", "GitHub Actions"],
    repo: "https://github.com/ttymayor/thu-course-crawler",
  },
  {
    title: "THU Hacker Club",
    description:
      "114 THU Hacker Club 的官網，雖然我在資安方面沒有過多深入研究，但在網頁開發上，為駭客社留下一個網站",
    tags: ["Astro", "React", "Tailwind CSS"],
    site: "https://thu-hacker-club.zeabur.app/",
    repo: "https://github.com/ttymayor/thu-hacker-club",
  },
];

export const events: EventItem[] = [
  {
    title: "SITCON",
    description:
      "SITCON 是由學生組成、投身資訊教育與推廣開源精神的社群。也是一個由學生主辦的資訊研討會。",
    roles: [
      "Attendee · 2026/03/08",
      "Attendee · 2025/03/08",
      "Attendee · 2024/03/09",
      "Attendee · 2022/09/04",
    ],
  },
  {
    title: "COSCUP",
    description:
      "COSCUP 是由一群自由與開放原始碼軟體愛好者發起，致力於推廣開放原始碼精神與技術。",
    roles: ["Attendee · 2025/08/09 – 08/10"],
  },
  {
    title: "THU Hacker Club",
    description: "東海駭客社",
    roles: ["Leader and Academic · 2025/07 – Present"],
  },
  {
    title: "TSC 2026",
    description:
      "Taiwan Security Club。此次活動是第一次完全由學生聯合舉辦的 CTF。",
    roles: ["Sponsor Group · 2025/11/08"],
  },
];

export type DevRuleItem = {
  title: string;
  href: string;
};

export type PersonalityItem = {
  traits: string;
  Score: number;
};

export const devRules: DevRuleItem[] = [
  {
    title: "Conventional Commits",
    href: "https://www.conventionalcommits.org/en/v1.0.0/",
  },
  {
    title: "中文文案排版指北",
    href: "https://github.com/sparanoid/chinese-copywriting-guidelines",
  },
  {
    title: "No Hello",
    href: "https://nohello.net/en/",
  },
];

export const personalityData: PersonalityItem[] = [
  { traits: "Self-Learning", Score: 80 },
  { traits: "Creativity", Score: 50 },
  { traits: "Execution", Score: 80 },
  { traits: "Leadership", Score: 45 },
  { traits: "Responsible", Score: 70 },
  { traits: "Teamwork", Score: 55 },
];

export type Category = "books" | "tech" | "slides" | "projects" | "events" | "personality" | "devRules";
export type BookFilter = "all" | "recommended" | "in-progress" | "not-started";

export const categoryLabels: Record<Category, string> = {
  books: "Reading List",
  tech: "Tech Stacks",
  slides: "Slides",
  projects: "Projects",
  events: "Events",
  personality: "Personality",
  devRules: "Dev Rules",
};
