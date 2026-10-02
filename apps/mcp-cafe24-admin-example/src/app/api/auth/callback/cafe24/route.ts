const DEFAULT_LOCAL_BRIDGE_URL = "http://localhost:8787/cafe24/oauth/callback";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function buildHtml(params: {
  code?: string | null;
  error?: string | null;
  state?: string | null;
  localBridgeUrl: string;
}) {
  const { code, error, state, localBridgeUrl } = params;
  const statusMessage = error
    ? `Authorization failed: ${error}`
    : code
      ? "Authorization code received. Completing login..."
      : "No authorization code received.";
  const bridgeUrl = new URL(localBridgeUrl);
  if (code && !error) {
    bridgeUrl.searchParams.set("code", code);
    if (state) bridgeUrl.searchParams.set("state", state);
  }
  const redirectTarget = bridgeUrl.toString();
  const escapedTarget = escapeHtml(redirectTarget);
  const scriptTarget = JSON.stringify(redirectTarget).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe24 OAuth</title>
  </head>
  <body>
    <p>${escapeHtml(statusMessage)}</p>
    <p>If you are not redirected, open this link:</p>
    <p><a href="${escapedTarget}">${escapedTarget}</a></p>
    <script>
      ${code && !error ? `window.location.replace(${scriptTarget});` : ""}
    </script>
  </body>
</html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const localBridgeUrl =
    process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL?.trim() || DEFAULT_LOCAL_BRIDGE_URL;

  const html = buildHtml({ code, state, error, localBridgeUrl });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
