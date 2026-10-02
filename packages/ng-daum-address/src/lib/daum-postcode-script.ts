const DAUM_POSTCODE_SCRIPT_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

const scriptLoads = new WeakMap<Document, Promise<void>>();

export function loadDaumPostcodeScript(document: Document): Promise<void> {
  if (document.defaultView?.daum?.Postcode) return Promise.resolve();

  const pending = scriptLoads.get(document);
  if (pending) return pending;

  const load = new Promise<void>((resolve, reject) => {
    const existingScript = Array.from(document.scripts).find(
      (script) => script.src === DAUM_POSTCODE_SCRIPT_URL,
    );
    const script = existingScript ?? document.createElement("script");
    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
    const handleLoad = () => {
      cleanup();
      if (document.defaultView?.daum?.Postcode) {
        scriptLoads.delete(document);
        resolve();
      } else {
        scriptLoads.delete(document);
        script.remove();
        reject(new Error("Daum Postcode SDK is unavailable after loading"));
      }
    };
    const handleError = () => {
      cleanup();
      scriptLoads.delete(document);
      script.remove();
      reject(new Error("Failed to load Daum Postcode script"));
    };
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!existingScript) {
      script.src = DAUM_POSTCODE_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  });
  scriptLoads.set(document, load);
  return load;
}
