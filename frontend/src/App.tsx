import React, { FormEvent, useEffect, useState } from "react";
import FileInput from "./components/FileInput";
import Loading from "./components/Loading";
import { post, useRequest } from "./utils/api";
import { extractEmailsFromFiles } from "./utils/emailParsing";
import { translate } from "./utils/translate";

function App() {
  const [emailFiles, setEmailFiles] = useState<File[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailProcessing, setEmailProcessing] = useState(false);
  const {
    success,
    loading,
    error,
    run: sendEmails,
    reset: resetRequestStates,
  } = useRequest(() => post("/api/send", { emails }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEmails();
  };

  const handleFileChange = (files: File[]) => {
    setEmailFiles(files);
    resetRequestStates();
  };

  useEffect(() => {
    async function getEmails() {
      if (emailFiles.length < 1) {
        return;
      }
      setEmailProcessing(true);
      setEmails(await extractEmailsFromFiles(emailFiles));
      setEmailProcessing(false);
    }

    getEmails();
  }, [emailFiles]);

  return (
    <div className="emails-container">
      <h1 className="emails-title">Emails</h1>
      <form className="emails-form" onSubmit={handleSubmit}>
        <FileInput
          accept=".txt"
          multiple={true}
          onChange={handleFileChange}
          id="emails"
        />
        <ul>
          {emailFiles
            ? emailFiles.map((elem) => <li key={elem.name}>{elem.name}</li>)
            : null}
        </ul>
        <button disabled={loading || emailProcessing}>
          {loading ? <Loading /> : "Send emails"}
        </button>
      </form>
      {success ? (
        <div className="emails-success">Successfully sent!</div>
      ) : null}
      {error ? <div className="emails-error">{translate(error)}</div> : null}
    </div>
  );
}

export default App;
