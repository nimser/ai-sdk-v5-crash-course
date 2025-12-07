import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { evalite } from 'evalite';

evalite('Capitals', {
  data: () => [
    {
      input: 'What is the capital of France?',
      expected: 'Paris',
    },
    {
      input: 'What is the capital of Germany?',
      expected: 'Berlin',
    },
    {
      input: 'What is the capital of Italy?',
      expected: 'Rome',
    },
  ],
  task: async (input) => {
    const prompt = `
      ${input}

      <output-format>
        Return only the name of the Capital asked in the question
      </output-format>
    `
    const capitalResult = streamText({
      model: google('gemini-2.0-flash-lite'),
      prompt: prompt
    })

    return capitalResult.text;
  },
  scorers: [
    {
      name: 'includes',
      scorer: ({ input, output, expected }) => {
        return output.includes(expected!) ? 1 : 0;
      },
    },
  ],
});
