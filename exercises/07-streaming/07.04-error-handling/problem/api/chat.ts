import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  RetryError,
} from 'ai';

export const POST = async (req: Request): Promise<Response> => {
  // All the AI SDK errors are available here:
  // https://ai-sdk.dev/docs/reference/ai-sdk-errors
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      throw new RetryError({
        errors: [new Error('An error occurred')],
        message: 'Maximum retries exceeded',
        reason: 'maxRetriesExceeded',
      });
    },
    onError(error) {
      if (RetryError.isInstance(error)) {
        return "Too many retries. Aborting.";
      }

      return "Oopsies, something went wrong! You might need to try that again :/";
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
};
