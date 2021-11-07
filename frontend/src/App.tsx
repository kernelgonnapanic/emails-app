import React, { FormEvent, useEffect, useState } from "react";
import FileInput from "./components/FileInput";
import { post, useRequest } from "./utils/api";
import { extractEmailsFromFiles } from "./utils/emailParsing";
import { translate } from "./utils/translate";

function App() {
  const [emailFiles, setEmailFiles] = useState<File[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const {
    success,
    loading,
    error,
    run: sendEmails,
  } = useRequest(() => post("/api/send", { emails }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEmails();
  };

  useEffect(() => {
    async function getEmails() {
      if (emailFiles.length < 1) {
        return;
      }
      setEmails(await extractEmailsFromFiles(emailFiles));
    }

    getEmails();
  }, [emailFiles]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileInput
          accept=".txt"
          multiple={true}
          onChange={setEmailFiles}
          id="emails"
        />
        <ul>
          {emailFiles
            ? emailFiles.map((elem) => <li key={elem.name}>{elem.name}</li>)
            : null}
        </ul>
        <button>Send emails</button>
      </form>
      {success ? <div>Successfully sent!</div> : null}
      {loading ? <div>Loading...</div> : null}
      {error ? <div>{translate(error)}</div> : null}
    </div>
  );
}

export default App;
