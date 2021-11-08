import React, { FormEvent, useEffect, useState, useMemo } from "react";
import FileInput from "./components/FileInput";
import Loading from "./components/Loading";
import { post, useRequest } from "./utils/api";
import { extractEmailsFromFiles } from "./utils/emailParsing";
import { translate } from "./utils/translate";

interface EmailFile {
  fileName: string;
  emails: string[];
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [emailFiles, setEmailFiles] = useState<EmailFile[]>([]);
  const [emailProcessing, setEmailProcessing] = useState(false);
  const emailsList = useMemo(
    () => emailFiles.flatMap((item) => item.emails),
    [emailFiles]
  );

  const {
    success,
    loading,
    error,
    run: sendEmails,
    reset: resetRequestStates,
  } = useRequest(() => post("/api/send", { emails: emailsList }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEmails();
  };

  const handleFileChange = (files: File[]) => {
    setFiles(files);
    resetRequestStates();
  };

  useEffect(() => {
    async function getEmails() {
      if (files.length < 1) {
        return;
      }
      setEmailProcessing(true);
      setEmailFiles(await extractEmailsFromFiles(files));
      setEmailProcessing(false);
    }

    getEmails();
  }, [files]);

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
            ? emailFiles.map((elem) => (
                <li key={elem.fileName}>
                  {elem.fileName} - Number of emails: {elem.emails.length}
                </li>
              ))
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
