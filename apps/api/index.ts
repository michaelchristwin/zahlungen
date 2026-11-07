import { RPCHandler } from "@orpc/server/fetch";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { router } from "./router";

const handler = new RPCHandler(router, {
  plugins: [new CORSHandlerPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export async function fetch(request: Request): Promise<Response> {
  const { matched, response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {}, // Provide initial context if needed, can be an async function
  });

  if (matched) {
    return response;
  }

  return new Response("Not found", { status: 404 });
}

Bun.serve({
  fetch,
});
