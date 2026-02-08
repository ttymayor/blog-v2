import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
    // readingTime.words gives us the word count
    data.astro.frontmatter.wordCount = readingTime.words;
    data.astro.frontmatter.readMinutes = readingTime.minutes;
  };
}
