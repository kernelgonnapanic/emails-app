import React, { useEffect, useState } from "react";
import FileInput from "./components/FileInput";
import { extractEmailsFromFiles } from "./utils/emailParsing";

function App() {
  const [emailFiles, setEmailFiles] = useState<File[]>([]);

  useEffect(() => {
    async function getEmails() {
      console.log(await extractEmailsFromFiles(emailFiles));
    }

    getEmails();
  }, [emailFiles]);

  return (
    <div>
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
    </div>
  );
}

export default App;
