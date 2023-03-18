
export function trimIndent(s: string): string {
  const lines = s.split("\n");
  const spaces = lines.reduce((min, line) => {
    if (line === null) {
      return min;
    } else {
      const match = line.match(/^\s+/gi);
      if (match === null) {
        return 0;
      } else {
        return Math.min(min, match[0].length);
      }
    }
  }, Number.MAX_SAFE_INTEGER);
  return lines.map(line => line.substring(spaces)).join("\n");
}
