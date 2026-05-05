import { execSync } from "child_process";

export function remarkModifiedTime() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (tree, file) {
    const filepath = file.history[0];
    const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
    file.data.astro.frontmatter.lastModified = result.toString();
  };
}
