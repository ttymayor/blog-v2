import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const FORTUNES = [
  { kanji: "大吉", en: "Great Blessing", desc: "Excellent luck awaits you." },
  { kanji: "中吉", en: "Middle Blessing", desc: "Good things are coming." },
  { kanji: "小吉", en: "Small Blessing", desc: "A modest happiness." },
  { kanji: "吉", en: "Blessing", desc: "Good fortune." },
  { kanji: "末吉", en: "Future Blessing", desc: "Luck will come eventually." },
  { kanji: "凶", en: "Misfortune", desc: "Exercise caution." },
];

export default function FortuneCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [fortune, setFortune] = useState<(typeof FORTUNES)[0] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("daily-fortune");
    if (saved) {
      try {
        const { date, data } = JSON.parse(saved);
        const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local time
        if (date === today) {
          setFortune(data);
        } else {
          localStorage.removeItem("daily-fortune"); // Clear old fortune
        }
      } catch (e) {
        console.error("Failed to parse daily fortune", e);
        localStorage.removeItem("daily-fortune");
      }
    }
  }, []);

  const handleClick = () => {
    if (!isOpen) {
      if (!fortune) {
        const randomFortune =
          FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        setFortune(randomFortune);

        const today = new Date().toLocaleDateString("en-CA");
        localStorage.setItem(
          "daily-fortune",
          JSON.stringify({ date: today, data: randomFortune }),
        );
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-[90] transition-opacity duration-500 backdrop-blur-sm",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      <div
        onClick={handleClick}
        className={cn(
          "fixed z-[100] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl overflow-hidden cursor-pointer bg-[#fdfaf5] border-2 border-red-800 will-change-transform",
          // Closed State (Hexagon/Box shape illusion or just a card)
          !isOpen &&
            "top-4/5 -right-4 -translate-y-1/2 w-24 h-40 rounded-lg bg-red-700 hover:brightness-110 transform translate-x-12 rotate-[-15deg] hover:translate-x-8 hover:rotate-[-20deg]",
          // Open State (Long strip)
          isOpen &&
            "top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-48 h-[500px] rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-0",
        )}
      >
        {/* Closed Content (Omikuji Box/Charm Look) */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-100 p-2 border-4 border-yellow-500/30 m-1 rounded-md",
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          <div className="writing-vertical-rl text-2xl font-serif font-bold text-yellow-100 tracking-widest select-none border-2 border-yellow-100/50 py-2 px-1">
            御神籤
          </div>
        </div>

        {/* Open Content (The Strip) */}
        <div
          className={cn(
            "w-full h-full flex flex-col items-center py-6 px-4 text-center transition-all duration-500 delay-100 font-serif text-slate-800 relative",
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none",
          )}
        >
          {/* Decorative Top Pattern */}
          <div className="absolute top-4 left-0 right-0 flex justify-center opacity-30">
            <div className="w-16 h-1 bg-red-800 rounded-full" />
          </div>

          <div className="mt-2 mb-2 text-sm text-red-700 tracking-[0.2em] font-bold">
            OMIKUJI
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full my-2 border-y border-slate-200 py-4">
            <div
              className={cn(
                "writing-vertical-rl text-5xl font-black text-slate-900 tracking-wider",
                isOpen
                  ? "animate-in zoom-in-90 duration-1000 fade-in slide-in-from-bottom-4"
                  : "",
              )}
            >
              {fortune?.kanji}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="text-xl font-bold text-red-800">{fortune?.en}</div>
            <p className="text-sm text-slate-500 italic font-medium px-4">
              {fortune?.desc}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">
            Tap to fold
          </div>

          {/* Decorative Bottom Pattern */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30">
            <div className="w-16 h-1 bg-red-800 rounded-full" />
          </div>
        </div>
      </div>

      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
}
