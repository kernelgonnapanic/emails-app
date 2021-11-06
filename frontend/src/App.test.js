import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

describe("Email collection app", () => {
  it("lists all selected files", () => {
    const file = new File(["email@example.com"], "emails.txt", { type: "txt" });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, file);

    expect(screen.getByText("emails.txt")).toBeInTheDocument();
  });

  it("allows for adding multiple files", () => {
    const file1 = new File(["email@example.com"], "emails-1.txt", {
      type: "txt",
    });
    const file2 = new File(["email@example.com"], "emails-2.txt", {
      type: "txt",
    });

    render(<App />);
    const input = screen.getByTestId("emails");
    userEvent.upload(input, [file1, file2]);

    expect(screen.getByText("emails-1.txt")).toBeInTheDocument();
    expect(screen.getByText("emails-2.txt")).toBeInTheDocument();
  });
});
