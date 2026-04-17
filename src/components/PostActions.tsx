import { toast } from "sonner";
import { Copy, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
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
    toast("已複製 Markdown", { icon: <Copy className="size-4" /> });
  };

  return (
    <div className="mb-4 flex justify-end">
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label="Copy as Markdown"
        >
          <Copy className="size-3.5" />
          <span className="hidden sm:inline">Copy</span>
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
