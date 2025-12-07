import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { evalite } from 'evalite';

const links = [
  {
    title: 'TypeScript 5.8',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html',
  },
  {
    title: 'TypeScript 5.7',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html',
  },
  {
    title: 'TypeScript 5.6',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-6.html',
  },
  {
    title: 'TypeScript 5.5',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html',
  },
  {
    title: 'TypeScript 5.4',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html',
  },
  {
    title: 'TypeScript 5.3',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html',
  },
  {
    title: 'TypeScript 5.2',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html',
  },
  {
    title: 'TypeScript 5.1',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html',
  },
  {
    title: 'TypeScript 5.0',
    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html',
  },
];

evalite('TS Release Notes', {
  data: () => [
    {
      input: 'Tell me about the TypeScript 5.8 release',
    },
    {
      input: 'Tell me about the TypeScript 5.2 release',
    },
  ],
  task: async (input) => {
    const capitalResult = await generateText({
      model: google('gemini-2.0-flash-lite'),
      prompt: `
        You are a helpful assistant that can answer questions about TypeScript releases.

        <question>
        ${input}
        </question>

        <output-format>
        Answer briefly, simply providing a markdown link to the typescriptlang.org's website release notes about the specific version. Use the TS version in the link text (e.g. "TypeScript 5.2"). The url is: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-<version>.html with <version> digits separeted by a dash.
        </output-format>
      `,
    });

    return capitalResult.text;
  },
  scorers: [
    {
      name: 'Includes Markdown Links to typescriptlang.org',
      scorer: ({ input, output, expected }) => {
        console.log(`result: ${input}`)
        const regex = new RegExp(/\[TypeScript 5\.[0-8]\]\(https:\/\/www\.typescriptlang\.org\/docs\/handbook\/release-notes\/typescript-5-[0-8]\.html\)/)
        return output.match(regex) ? 1 : 0
      },
    },
    {
      name: 'Output length',
      scorer: ({ input, output, expected }) => {
        return output.length <= 500 ? 1 : 0
      },
    },
  ],
});
