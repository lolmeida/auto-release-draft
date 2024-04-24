export function toUnorderedList(items: string[]) {
return items.map((item: string) => `- ${item}`).join('\n')
}
