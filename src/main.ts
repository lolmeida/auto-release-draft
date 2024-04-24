import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'
import * as git from './git'
import * as github from './github'

export async function run(): Promise<void> {
  try {
    const repoToken = core.getInput('repo-token')

    const versionTag = event.getCreatedTag()
    let releaseUrl = ''

    if (versionTag && version.isSemVer(versionTag)) {
      const changeLog = await git.getChangesIntroducedByTag(versionTag)
      releaseUrl = await github.createReleaseDraft(versionTag, repoToken, changeLog)
    }

    core.setOutput('release-url', releaseUrl)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
