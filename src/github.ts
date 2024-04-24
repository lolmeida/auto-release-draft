import * as github from '@actions/github'
import * as core from '@actions/core'
import * as version from './version'
import * as markdown from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changeLog: string
): Promise<string> {
  const octokit = github.getOctokit(repoToken)
  const response = await octokit.rest.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: versionTag,
    name: version.removePrefix(versionTag),
    body: markdown.toUnorderedList(changeLog),
    prerelease: version.isPreRelease(versionTag),
    draft: true
  })

  if (response.status !== 201) {
    throw new Error(`Failed to create release draft: ${response.status}`)
  }
  core.info(`Created release draft: ${response.data.name}`)
  return response.data.html_url
}
