import { RPCHandler } from "@orpc/server/fetch";
import { CORSHandlerPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { router } from "./router";
import { env } from "./config/env";
import { PinoHandlerPlugin } from "@orpc/pino";
import pino from "pino";

const logger = pino();

const handler = new RPCHandler(router, {
  plugins: [
    new CORSHandlerPlugin({
      exposeHeaders: ["Content-Disposition", "Standard-Server"],
    }),
    new PinoHandlerPlugin({
      logger,
      generateRequestId: ({ request }) => crypto.randomUUID(),
      logLifecycle: true,
      logAbort: true,
    }),
  ],
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

const server = Bun.serve({
  fetch,
  port: env.PORT,
});

console.log(`Server running at ${server.url}`);
