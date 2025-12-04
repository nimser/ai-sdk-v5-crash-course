import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { z } from 'zod'
import { createDirectory, deletePath, exists, listDirectory, readFile, searchFiles, writeFile } from './file-system-functionality.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      You have access to the following tools:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Use these to record notes, create todo lists, and edit documents for the user.

      Use markdown files to store information.
    `,
    tools: {
      // TODO add missing describe() calls where they're missing
      writeFile: {
        description: 'Writes content to a file',
        inputSchema: z.object({
          path: z.string().describe('Path of the resulting file'),
          content: z.string().describe('Content of the resulting file')
        }),
        execute: ({ path, content }) => writeFile(path, content)
      },
      readFile: {
        description: 'Read content from a file',
        inputSchema: z.object({ path: z.string() }),
        execute: ({ path }) => readFile(path)
      },
      deletePath: {
        description: 'Delete the file at a given path',
        inputSchema: z.object({ path: z.string() }),
        execute: ({ path }) => deletePath(path)
      },
      listDirectory: {
        description: 'List all the files and directories within a given path',
        inputSchema: z.object({ path: z.string() }),
        execute: ({ path }) => listDirectory(path)
      },
      createDirectory: {
        description: 'Create a new directory at the provided location',
        inputSchema: z.object({ path: z.string() }),
        execute: ({ path }) => createDirectory(path)
      },
      exists: {
        description: 'Checks whether the provided path exists',
        inputSchema: z.object({ path: z.string() }),
        execute: ({ path }) => exists(path)
      },
      searchFiles: {
        description: 'Checks whether the provided path exists',
        inputSchema: z.object({
          pattern: z.string().describe('Pattern to match a file with'),
          searchDir: z.string().optional().describe('Directory path in which the search should be performed')
        }),
        execute: ({ pattern, searchDir }) => searchFiles(pattern, searchDir || null)
      },
    },

    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse();
};
