export interface APIError {
  error: string;
  [key: string]: any;
}

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

export enum ResponseStatusType {
  "success",
  "loading",
  "error",
  "default",
}

type SuccessStatus = {
  type: ResponseStatusType.success;
};

type LoadingStatus = {
  type: ResponseStatusType.loading;
};

type ErrorStatus = {
  type: ResponseStatusType.error;
  error: APIError;
};

type DefaultStatus = {
  type: ResponseStatusType.default;
};

export type ResponseStatus =
  | SuccessStatus
  | LoadingStatus
  | ErrorStatus
  | DefaultStatus;
