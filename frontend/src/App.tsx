import React, { FormEvent, useEffect, useState, useMemo, useRef } from "react";
import FileInput from "./components/FileInput";
import Loading from "./components/Loading";
import { post, ResponseStatus, ResponseStatusType } from "./utils/api";
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
  const form = useRef<HTMLFormElement>(null);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>({
    type: ResponseStatusType.default,
  });

  const emailsList = useMemo(
    () => emailFiles.flatMap((item) => item.emails),
    [emailFiles]
  );

  const sendEmails = async () => {
    try {
      setResponseStatus({ type: ResponseStatusType.loading });
      const response = await post("/api/send", { emails: emailsList });
      if ("error" in response) {
        setResponseStatus({ type: ResponseStatusType.error, error: response });
      } else {
        setResponseStatus({ type: ResponseStatusType.success });
        resetForm();
      }
    } catch (error) {
      setResponseStatus({
        type: ResponseStatusType.error,
        error: { error: "unexpected_api_error" },
      });
    }
  };

  const resetForm = () => {
    if (form.current) {
      form.current.reset();
    }
    setEmailFiles([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEmails();
  };

  const handleFileChange = (files: File[]) => {
    setFiles(files);
    setResponseStatus({ type: ResponseStatusType.default });
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

  const shouldButtonBeDisabled =
    responseStatus.type === ResponseStatusType.loading || emailProcessing;

  return (
    <div className="emails-container">
      <h1 className="emails-title">Emails</h1>
      <form className="emails-form" onSubmit={handleSubmit} ref={form}>
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
        <button disabled={shouldButtonBeDisabled}>
          {shouldButtonBeDisabled ? <Loading /> : "Send emails"}
        </button>
      </form>
      {responseStatus.type === ResponseStatusType.success ? (
        <div className="emails-success">Successfully sent!</div>
      ) : null}
      {responseStatus.type === ResponseStatusType.error ? (
        <div className="emails-error">{translate(responseStatus.error)}</div>
      ) : null}
    </div>
  );
}

export default App;
