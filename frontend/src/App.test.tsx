import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import fetchMock from "jest-fetch-mock";

import App from "./App";

describe("Email collection app", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("lists all selected files", async () => {
    const file = new File(["email@example.com"], "emails.txt", { type: "txt" });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      expect(screen.getByText(/emails.txt/)).toBeInTheDocument();
    });
  });

  it("allows for adding multiple files", async () => {
    const file1 = new File(["email@example.com"], "emails-1.txt", {
      type: "txt",
    });
    const file2 = new File(["email@example.com"], "emails-2.txt", {
      type: "txt",
    });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1, file2]);

    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      expect(screen.getByText(/emails-1.txt/)).toBeInTheDocument();
      expect(screen.getByText(/emails-2.txt/)).toBeInTheDocument();
    });
  });

  it("successfully uploads emails and displays success message", async () => {
    fetchMock.mockResponseOnce("");
    const file1 = new File(["email@example.com"], "emails-1.txt", {
      type: "txt",
    });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1]);
    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      userEvent.click(screen.getByText("Send emails"));
    });
    expect(screen.getByText("Successfully sent!")).toBeInTheDocument();
  });

  it("correctly displays error message when email is invalid", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: "invalid_email_address",
        emails: ["invalid_test_email"],
      }),
      { status: 422 }
    );
    const file1 = new File(["email@example.com"], "emails-1.txt", {
      type: "txt",
    });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1]);

    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      userEvent.click(screen.getByText("Send emails"));
    });

    expect(
      screen.getByText("Invalid email addresses: invalid_test_email")
    ).toBeInTheDocument();
  });

  it("correctly displays error message when email was not send", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: "send_failure",
        emails: ["just_a_normal_email@example.com"],
      }),
      { status: 500 }
    );
    const file1 = new File(
      ["just_a_normal_email@example.com"],
      "emails-1.txt",
      {
        type: "txt",
      }
    );

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1]);

    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      userEvent.click(screen.getByText("Send emails"));
    });

    expect(
      screen.getByText(
        "Failed to send emails to just_a_normal_email@example.com"
      )
    ).toBeInTheDocument();
  });

  it("correctly displays error message when there was unexpected server error", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: "server_error",
      }),
      { status: 500 }
    );
    const file1 = new File(
      ["just_a_normal_email@example.com"],
      "emails-1.txt",
      {
        type: "txt",
      }
    );

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1]);

    await waitFor(() => {
      expect(screen.getByText("Send emails")).not.toBeDisabled();
      userEvent.click(screen.getByText("Send emails"));
    });

    expect(screen.getByText("Oops! Something went wrong")).toBeInTheDocument();
  });
});
