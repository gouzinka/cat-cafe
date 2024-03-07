import fetchWithTimeout from "./fetchWithTimeout";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("utils/fetchWithTimeout", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  it("returns a response if the fetch completes within the timeout", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({data: "test data"}));
    const response = await fetchWithTimeout("https://example.com", {
      timeout: 5000
    });
    const responseData = await response.json();

    expect(responseData).toEqual({data: "test data"});
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("aborts the fetch if it exceeds the timeout", async () => {
    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(JSON.stringify({data: "delayed data"})), 100)
        )
    );

    const fetchPromise = fetchWithTimeout("https://example.com", {
      timeout: 1000
    });

    // Fast-forward to trigger timeout
    jest.advanceTimersByTime(1000);

    await expect(fetchPromise).rejects.toThrow("The operation was aborted.");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  }, 10000);
});
