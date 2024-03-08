import {useState, useEffect} from "react";
import fetchWithTimeout from "../utils/fetchWithTimeout";

const API_URL =
  "https://mtpgyho8j0.execute-api.us-east-1.amazonaws.com/default/catFacts";
const CAT_FACT_FALLBACK = "A group of cats is called a clowder.";

interface CatFactApiResponse {
  message?: string;
  error?: string;
}

interface UseCatFactsResult {
  fact: string | null;
  isLoading: boolean;
}

/*
    Fetch fun cat fact!

    Since the API response is not exactly critical :) I used a fallback fact (ideally multiple)
    Also any error thrown doesn't affect application run, fails silently (I would send a log to a Sentry for example)
*/
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCatFacts = (
  fetchTrigger: boolean,
  maxRetries: number = 1
): UseCatFactsResult => {
  const [fact, setFact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let attempt = 0;

      while (attempt <= maxRetries) {
        try {
          const response = await fetchWithTimeout(API_URL);

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const {message, error}: CatFactApiResponse = await response.json();

          if (error) {
            if (attempt < maxRetries) {
              attempt++;
              // Exponential back-off, 1s, 2s, etc.
              await delay(attempt * 1000);
              continue;
            } else {
              throw new Error(
                `Received an error from API after ${attempt} retries: ${error}`
              );
            }
          }

          setFact(message || CAT_FACT_FALLBACK);
          return;
        } catch (error) {
          console.error("Failed to fetch cat fact:", error);
          setFact(CAT_FACT_FALLBACK);
          break;
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [fetchTrigger]);

  return {fact, isLoading};
};

export default useCatFacts;
