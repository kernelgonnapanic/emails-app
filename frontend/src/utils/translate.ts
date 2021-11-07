export const translate = (code: string) => {
  switch (code) {
    case "invalid_email_address":
      return "Invalid email address";
    case "server_error":
    case "invalid_http_method":
    case "invalid_request_body":
    case "send_failure":
    default:
      return "Oops! Something went wrong";
  }
};
