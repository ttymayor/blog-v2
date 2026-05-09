import { MapPin, FileText, Calendar, Cpu } from "lucide-react";

interface Slide {
  title: string;
  date: string;
  link: string;
  made_with?: string[];
  location?: string;
  pdf?: string;
}

interface SlidesListProps {
  slides: Slide[];
}

export default function SlidesList({ slides }: SlidesListProps) {
  return (
    <div className="border-border relative ml-3 space-y-10 border-l py-4">
      {slides.map((slide, index) => (
        <div key={index} className="mb-10 ml-6">
          <span className="bg-primary/20 ring-background absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8">
            <Calendar className="text-primary h-3 w-3" />
          </span>
          <div className="bg-card border-border rounded-lg border p-4 shadow-sm">
            <div className="mb-3 items-center justify-between sm:flex">
              <time className="text-muted-foreground mb-1 text-xs font-normal sm:order-last sm:mb-0">
                {slide.date}
              </time>
              <div className="text-muted-foreground lex text-sm font-normal">
                {slide.location && (
                  <span className="mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {slide.location}
                  </span>
                )}
              </div>
            </div>
            <a href={slide.link} className="text-foreground hover:underline">
              <h3 className="text-lg font-semibold">{slide.title}</h3>
            </a>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {slide.made_with && (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Cpu className="h-4 w-4" />
                  <span>Made with: {slide.made_with.join(", ")}</span>
                </div>
              )}
              {slide.pdf && (
                <a
                  href={slide.pdf}
                  className="text-foreground bg-card border-border hover:bg-muted focus:ring-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium focus:z-10 focus:ring-4 focus:outline-none"
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
