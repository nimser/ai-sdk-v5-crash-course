import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai';

export type MyUIMessage = UIMessage<{ duration: number }>;

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: MyUIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });

  const startTime = Date.now();

  return result.toUIMessageStreamResponse<MyUIMessage>({
    // If it encounters a 'finish' part, it should return the duration
    // of the stream in milliseconds
    messageMetadata: ({ part }) => {
      if (part.type === "finish")
        return { duration: (Date.now() - startTime) }
    }
  });
};
