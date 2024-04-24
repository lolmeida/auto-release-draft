export function toUnorderedList(items) {
  return items.map(item => `- ${item}`).join('\n')
}
