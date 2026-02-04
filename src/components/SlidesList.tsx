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
    <div className="relative border-l border-border ml-3 space-y-10 py-4">
      {slides.map((slide, index) => (
        <div key={index} className="mb-10 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full -left-3 ring-8 ring-background">
            <Calendar className="w-3 h-3 text-primary" />
          </span>
          <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
            <div className="items-center justify-between mb-3 sm:flex">
              <time className="mb-1 text-xs font-normal text-muted-foreground sm:order-last sm:mb-0">
                {slide.date}
              </time>
              <div className="text-sm font-normal text-muted-foreground lex">
                {slide.location && (
                  <span className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    {slide.location}
                  </span>
                )}
              </div>
            </div>
            <a
              href={slide.link}
              className="text-foreground hover:underline"
            >
              <h3 className="text-lg font-semibold">{slide.title}</h3>
            </a>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {slide.made_with && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cpu className="w-4 h-4" />
                  <span>Made with: {slide.made_with.join(", ")}</span>
                </div>
              )}
              {slide.pdf && (
                <a
                  href={slide.pdf}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted focus:z-10 focus:ring-4 focus:outline-none focus:ring-ring"
                >
                  <FileText className="w-4 h-4" />
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
