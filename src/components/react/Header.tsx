import AvatarImage from "@/assets/avatar.jpg";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { SITE_TITLE } from "@/consts";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/blog", label: "文" },
  // { href: "/about", label: "我" },
];

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const subpath = pathname.match(/[^\/]+/g);
  const isActive = (href: string) => {
    return href === pathname || href === "/" + (subpath?.[0] || "");
  };

  return (
    <header className="top pointer-events-auto fixed bottom-4 left-0 z-50 flex w-full flex-col items-center md:sticky md:top-0 md:bottom-auto md:left-auto">
      <nav className="bg-secondary/50 mx-auto flex w-[95%] max-w-5xl items-center justify-between gap-4 rounded-2xl border p-4 shadow-xl backdrop-blur-sm transition-all duration-500 ease-in-out md:mt-4">
        <div className="flex items-center gap-3">
          <a href="/" className="block shrink-0">
            <img
              src={AvatarImage.src}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          </a>
          <h2 className="m-0 hidden text-[1em] md:block">
            <a href="/" className="font-bold">
              {SITE_TITLE}
            </a>
          </h2>
        </div>

        <div className="flex flex-row gap-4">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              <Button
                variant="link"
                // className={cn(isActive(item.href) && "bg-secondary/50")}
              >
                {item.label}
              </Button>
            </a>
          ))}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
