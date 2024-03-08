/*
    Fetch doesn't allow programmatically canceling a request, so we wrap it in our own function
    Otherwise we would rely on browser's behaviour 300s (Chrome), 90s (Firefox)
    This solution is from https://dmitripavlutin.com/timeout-fetch-request/
*/
async function fetchWithTimeout(
  resource: string,
  options: RequestInit & {timeout?: number} = {}
): Promise<Response> {
  const {timeout = 5000} = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });

  clearTimeout(id);

  return response;
}

export default fetchWithTimeout;
