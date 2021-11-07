import { useState } from "react";

export const post = async (url: string, body: Object) => {
  const response = await fetch(process.env.REACT_APP_API_URL + url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error);
  }
  return response;
};

export const useRequest = (request: any) => {
  //TODO: Improve type
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await request();
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message); //TODO: Improve type
    } finally {
      setLoading(false);
    }
  };

  return { success, loading, error, run };
};
