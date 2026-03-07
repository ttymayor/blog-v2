import { useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

type ReadingItem = {
  title: string;
  author?: string;
  percentage: number;
  href?: string;
  tags?: string[];
  recommended?: boolean;
};

const Book: ReadingItem[] = [
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

const INITIAL_VISIBLE_COUNT = 3;

export function Reading() {
  const [showAll, setShowAll] = useState(false);
  const visibleBooks = showAll ? Book : Book.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <section id="reading">
      <h2 className="mb-8 text-3xl font-bold">Reading</h2>
      <div className="grid grid-cols-1 gap-4">
        {visibleBooks.map((item) => (
          <Item
            key={item.title}
            className="bg-card flex flex-col items-start rounded-lg border p-4 transition-colors"
          >
            <ItemContent className="w-full gap-2">
              <ItemTitle className="flex w-full flex-row items-start justify-between gap-1">
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  {item.author && (
                    <span className="text-xs text-gray-400 md:text-sm">
                      {item.author}
                    </span>
                  )}
                </div>
                {item.recommended && <ThumbsUp className="size-4" />}
              </ItemTitle>
              <ItemDescription className="w-full space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-700 text-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-muted-foreground flex items-center justify-between text-[10px] font-medium tracking-wider uppercase">
                    <span>Progress</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="bg-secondary/50 h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full bg-[#eebbc3] transition-all duration-500 ease-out"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
      {Book.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="w-full md:w-auto"
          >
            {showAll
              ? "Show Less"
              : `Show More (${Book.length - INITIAL_VISIBLE_COUNT} more)`}
          </Button>
        </div>
      )}
    </section>
  );
}
