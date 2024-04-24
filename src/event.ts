import * as core from '@actions/core'
import * as github from '@actions/github'

export function getCreatedTag(): string | null {
  core.info('github.context.eventName:')
  if (github.context.eventName.toLocaleLowerCase() !== 'create') {
    core.info(`The event name was ${github.context.eventName}`)
    return null
  }

  if (github.context.payload.ref_type.toLowerCase() !== 'tag') {
    core.info('The created reference was a branch, not a tag')
    return null
  }
  return github.context.payload.ref
}
