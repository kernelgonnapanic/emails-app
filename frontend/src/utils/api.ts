import { useState } from "react";
export interface APIError {
  error: string;
  [key: string]: any;
}

type Response = Object | APIError;

export const post = async (url: string, body: Object) => {
  const response = await fetch(process.env.REACT_APP_API_URL + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return await response.json();
  }
  return response;
};

export const useRequest = (request: () => Response) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await request();
      if ("error" in response) {
        setError(response);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError({ error: "unexpected_api_error" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  };

  return { success, loading, error, run, reset };
};
