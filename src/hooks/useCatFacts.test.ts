import {renderHook, waitFor} from "@testing-library/react";
import useCatFacts from "./useCatFacts";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

it("should initially set isLoading to true and then to false after fetching", async () => {
  fetchMock.mockResponseOnce(JSON.stringify({message: "Cats are great!"}));

  const {result} = renderHook(() => useCatFacts(0));
  expect(result.current.isLoading).toBe(true);

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fact).toBe("Cats are great!");
  });
});

it("should use fallback fact when fetch fails", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  fetchMock.mockReject(new Error("API is down"));
  const {result} = renderHook(() => useCatFacts(1));

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fact).toBe("A group of cats is called a clowder.");
  });

  consoleSpy.mockRestore();
});

it("should fetch a new fact when submitCount changes", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify({message: "Cats are great!"}))
    .mockResponseOnce(
      JSON.stringify({message: "Cats sleep 70% of their lives."})
    );

  const {result, rerender} = renderHook(
    ({submitCount}) => useCatFacts(submitCount),
    {
      initialProps: {submitCount: 0}
    }
  );

  await waitFor(() => expect(result.current.fact).toBe("Cats are great!"));

  // Trigger another fetch
  rerender({submitCount: 1});

  await waitFor(() =>
    expect(result.current.fact).toBe("Cats sleep 70% of their lives.")
  );
});
