import * as core from '@actions/core'
import { ExecOptions, exec } from '@actions/exec';

export async function getChangesIntroducedByTag(tag: string): Promise<string> {
    const previousVersionTag = await getPreviousVersionTag(tag);
    
    return previousVersionTag
        ? getChangesBetweenTags(previousVersionTag, tag)
        : getCommitedMessageFromTag(tag);
}

export async function getPreviousVersionTag(tag: string): Promise<string | null> {
    let previousTag = "";

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                previousTag += data.toString();
            }
        },
        silent: true, // Do not print the command output
        ignoreReturnCode: true // Do not throw an error if the command fails
    };
    const exitCode = await exec(
        "git", // Command
        ["describe", // Arguments
        "--match", "v[0-9]*", // Only consider tags that start with "v"
        "--abbrev=0", // Do not abbreviate the output
        "--first-parent", // Only consider the first parent of the commit
            `${tag}^`], // The commit to start from
        options)
    
    core.debug(`The previous version tag is: ${exitCode}`); // Debug message

    return exitCode === 0 ? previousTag.trim() : null; // Remove the trailing newline
}

export async function getChangesBetweenTags(firstTag: string, secondTag: string): Promise<string> {
    let commitMessage = "";

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessage += data.toString();
            }
        },
        silent: true, // Do not print the command output
        
    };
    await exec(
        "git", // Command
        ["log", // Arguments
        "--format:%s", // Only print the commit message
        `${firstTag}..${secondTag}`], // The range of commits to consider
        options)
    
    core.debug(`The commit message between ${firstTag} and ${secondTag}`); // Debug message

    return commitMessage.trim(); // Remove the trailing newline
}

export async function getCommitedMessageFromTag(tag: string): Promise<string> {
    let commitMessage = "";

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessage += data.toString();
            }
        },
        silent: true, // Do not print the command output
    };
    await exec(
        "git", // Command
        ["log", // Arguments
        "--format:%s", // Only print the commit message
        tag], // The tag to consider
        options)
    
    core.debug(`The commit message from tag ${tag} are:\n${commitMessage}`); // Debug message

    return commitMessage.trim(); // Remove the trailing newline
}
