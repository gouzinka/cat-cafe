import {useState, useEffect} from "react";

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

const useCatFacts = (shouldFetchFact: boolean): UseCatFactsResult => {
  const [fact, setFact] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!shouldFetchFact) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          setFact(CAT_FACT_FALLBACK);
          console.error("An error occurred while fetching the data.");
        }

        const {message, error}: CatFactApiResponse = await response.json();

        // If we don't receive message use fallback and fail silently
        setFact(message || CAT_FACT_FALLBACK);

        if (error) {
          console.error("Received an error from API:", error);
        }
      } catch (error) {
        // Non-critical approach w/ fallback
        setFact(CAT_FACT_FALLBACK);
        console.error("Failed to fetch cat fact:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shouldFetchFact]);

  return {fact, isLoading};
};

export default useCatFacts;
