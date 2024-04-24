export function toUnorderedList(changeLog: string): string {
  return changeLog
    .split('\n')
    .map(line => `- ${line}`)
    .join('\n')
}
