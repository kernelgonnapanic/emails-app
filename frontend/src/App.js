import React, { useState } from "react";
import FileInput from "./components/FileInput";

function App() {
  const [emailFiles, setEmailFiles] = useState([]);

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
