import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { GET } from "@/app/api/auth/callback/cafe24/route";

describe("Cafe24 OAuth callback", () => {
  const originalBridgeUrl = process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL;

  afterEach(() => {
    if (originalBridgeUrl === undefined) {
      delete process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL;
    } else {
      process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL = originalBridgeUrl;
    }
  });

  it("escapes authorization errors before rendering HTML", async () => {
    const url = new URL("https://example.com/api/auth/callback/cafe24");
    url.searchParams.set("error", '<img src=x onerror="alert(1)">');
    const response = await GET(new Request(url));
    const html = await response.text();

    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("&lt;img"));
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  });

  it("preserves an existing bridge query and escapes the link", async () => {
    process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL =
      "http://localhost:8787/cafe24/oauth/callback?existing=1";
    const response = await GET(
      new Request("https://example.com/api/auth/callback/cafe24?code=abc&state=xyz"),
    );
    const html = await response.text();

    assert.ok(html.includes("?existing=1&amp;code=abc&amp;state=xyz"));
    assert.ok(html.includes("?existing=1&code=abc&state=xyz"));
  });

  it("does not redirect a response containing an authorization error", async () => {
    const response = await GET(
      new Request("https://example.com/api/auth/callback/cafe24?code=abc&error=denied"),
    );

    assert.ok(!(await response.text()).includes("window.location.replace"));
  });

  it("prevents a configured bridge from closing the inline script", async () => {
    process.env.CAFE24_OAUTH_LOCAL_BRIDGE_URL =
      "http://localhost:8787/callback#</script><script>alert(1)</script>";
    const response = await GET(
      new Request("https://example.com/api/auth/callback/cafe24?code=abc"),
    );
    const html = await response.text();

    assert.equal(html.match(/<script>/g)?.length, 1);
  });
});
