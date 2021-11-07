import { APIError } from "./api";

export const translate = (error: APIError) => {
  switch (error.error) {
    case "invalid_email_address":
      return `Invalid email address ${error.emails.join(", ")}`;
    case "send_failure":
      return `Failed to send emails to ${error.emails.join(", ")}`;
    case "server_error":
    case "invalid_http_method":
    case "invalid_request_body":
    default:
      return "Oops! Something went wrong";
  }
};
