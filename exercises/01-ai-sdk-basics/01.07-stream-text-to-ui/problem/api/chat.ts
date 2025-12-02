import { google, } from '@ai-sdk/google';
import {
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
  type ModelMessage,
  type UIMessage,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  console.log(body)
  const messages: UIMessage[] = body.messages;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: google('gemini-2.0-flash'),
    messages: modelMessages
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
