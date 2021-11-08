import { readFile, parseFile, extractEmailsFromFiles } from "./emailParsing";

describe("Parsing", () => {
  describe("readFile", () => {
    it("returns promise which resolves to contents of the file", async () => {
      const fileContents = "matthaeiarnold@example.com\nbrita20@example.net\n";
      const file = new File([fileContents], "emails.txt", { type: "txt" });

      const read = await readFile(file);

      expect(read).toBe(fileContents);
    });

    it("returns rejected promise when reading of the file fails", () => {});
  });
  describe("parseFile", () => {
    it("returns a list of emails from a file", () => {
      const fileContents = "matthaeiarnold@example.com\nbrita20@example.net\n";
      const result = parseFile(fileContents);
      expect(result).toEqual([
        "matthaeiarnold@example.com",
        "brita20@example.net",
      ]);
    });
    it("trims excessive spaces", () => {
      const fileContents = "matthaeiarnold@example.com \nbrita20@example.net\n";
      const result = parseFile(fileContents);
      expect(result).toEqual([
        "matthaeiarnold@example.com",
        "brita20@example.net",
      ]);
    });
    it("trims excessive white characters", () => {
      const fileContents =
        "matthaeiarnold@example.com\t\nbrita20@example.net\n";
      const result = parseFile(fileContents);
      expect(result).toEqual([
        "matthaeiarnold@example.com",
        "brita20@example.net",
      ]);
    });
  });

  describe("extractEmailsFromFiles", () => {
    it("should extract emails from files", async () => {
      const file1 = new File(
        ["matthaeiarnold@example.com\nbrita20@example.net\n"],
        "emails1.txt",
        { type: "txt" }
      );
      const file2 = new File(["test@example.com\n"], "emails2.txt", {
        type: "txt",
      });

      const extracted = await extractEmailsFromFiles([file1, file2]);

      expect(extracted).toEqual([
        {
          fileName: "emails1.txt",
          emails: ["matthaeiarnold@example.com", "brita20@example.net"],
        },
        {
          fileName: "emails2.txt",
          emails: ["test@example.com"],
        },
      ]);
    });
  });
});
