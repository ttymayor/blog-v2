import { useState } from "react";
import { Copy, Check, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { IconSwap } from "@/components/react/IconSwap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import claudeIconUrl from "@/assets/ai-icons/claude-color.svg?url";
import openaiIconUrl from "@/assets/ai-icons/openai.svg?url";
import geminiIconUrl from "@/assets/ai-icons/gemini-color.svg?url";

interface Props {
  body: string;
  encodedPrompt: string;
}

export default function PostActions({ body, encodedPrompt }: Props) {
  const [copied, setCopied] = useState(false);

  const aiLinks = [
    {
      name: "Claude",
      href: `https://claude.ai/new?q=${encodedPrompt}`,
      icon: claudeIconUrl,
    },
    {
      name: "ChatGPT",
      href: `https://chatgpt.com/?q=${encodedPrompt}`,
      icon: openaiIconUrl,
    },
    {
      name: "Gemini",
      href: `https://aistudio.google.com/app/prompts/new_chat?prompt=${encodedPrompt}`,
      icon: geminiIconUrl,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-fit">
      <ButtonGroup className="h-fit">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy as Markdown"
          className="group/copy relative"
        >
          <IconSwap
            iconA={<Copy className="size-3.5" />}
            iconB={<Check className="size-3.5" />}
            state={copied ? "b" : "a"}
          />
          <span className="bg-primary text-primary-foreground pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover/copy:opacity-100">
            {copied ? "Copied!" : "Copy as Markdown"}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Discuss with AI">
              <EllipsisVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {aiLinks.map((link) => (
              <DropdownMenuItem key={link.name} asChild>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <img src={link.icon} alt="" className="size-4" />
                  {link.name}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  );
}
