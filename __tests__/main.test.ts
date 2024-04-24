import * as core from '@actions/core';
import { run } from '../src/main';

jest.mock('@actions/core');

describe('When running in action', () => {
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>;
  
  test('it sets the release URL output', async () => {
    // Arrange
    const expectedUrl = expect.anything;

    // Act
    await run();

    // Assert
    expect(fakeSetOutput).toHaveBeenCalledWith('release-url', expectedUrl);
  })
})