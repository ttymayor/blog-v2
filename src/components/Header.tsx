import { SITE_TITLE } from "../consts";
import { useState, useEffect } from "react";
import AvatarImage from "../assets/avatar.jpg";

interface HeaderProps {
  currentPath: string;
}

const Link = ({
  href,
  currentPath,
  children,
  className,
  ...props
}: {
  href: string;
  currentPath: string;
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const pathname = currentPath.replace(import.meta.env.BASE_URL, "");
  const subpath = pathname.match(/[^\/]+/g);
  const isActive = href === pathname || href === "/" + (subpath?.[0] || "");

  return (
    <a
      href={href}
      className={`inline-block px-4 py-4 text-[rgb(var(--black))] no-underline border-b-4 border-transparent hover:text-[rgb(var(--black))] ${
        isActive ? "!border-[var(--link-color)]" : ""
      } ${className || ""}`}
      {...props}
    >
      {children}
    </a>
  );
};

export default function Header({ currentPath }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed bottom-4 left-0 z-50 w-full pointer-events-none flex flex-col items-center md:sticky md:top-0 md:bottom-auto md:left-auto">
      <div
        className={`
          mx-auto transition-all duration-500 ease-in-out pointer-events-auto
          ${
            isScrolled
              ? "w-[95%] max-w-4xl rounded-2xl border border-black/10 shadow-xl bg-white/80 backdrop-blur-sm px-6 md:mt-6"
              : "w-[95%] max-w-4xl rounded-2xl border border-black/10 shadow-xl bg-white/80 backdrop-blur-sm px-6 md:w-full md:max-w-none md:rounded-none md:border-transparent md:shadow-[0_2px_8px_rgba(var(--black),5%)] md:bg-white md:backdrop-blur-none md:px-4 md:mt-0"
          }
        `}
      >
        <nav className="flex items-center justify-between gap-4 w-full">
          <h2 className="hidden md:block m-0 text-[1em]">
            <a
              href="/"
              className="text-[rgb(var(--black))] no-underline hover:no-underline"
            >
              {SITE_TITLE}
            </a>
          </h2>
          <a href="/" className="md:hidden flex-shrink-0 block">
            <img
              src={AvatarImage.src}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </a>
          <div className="flex flex-1 md:flex-none md:block">
            <Link
              href="/"
              currentPath={currentPath}
              className="flex-1 text-center md:flex-none md:text-left"
            >
              Home
            </Link>
            <Link
              href="/blog"
              currentPath={currentPath}
              className="flex-1 text-center md:flex-none md:text-left"
            >
              Blog
            </Link>
            <Link
              href="/about"
              currentPath={currentPath}
              className="flex-1 text-center md:flex-none md:text-left"
            >
              About
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
