import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

const INPUT = `Do some research on induction hobs and how I can replace a 100cm wide AGA cooker with an induction range cooker. Which is the cheapest, which is the best?`;

// NOTE: A good output would be: "Induction hobs vs AGA cookers"

const result = await streamText({
  model: google('gemini-2.0-flash-lite'),
  prompt: `
<task-context>
You are an helpful assistant who generates titles for conversations.
</task-context>

Here is the initial chat prompt:
<history>
  ${INPUT}
</history>

<rules>
  Here are some important rules for the task:
  - Find the most concise title that accurately sums up the conversation.
  - Always return titles that are between 18 and 30 characters longs
</rules>

Generate a title for the conversation.

Return only the title.
  `,
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
