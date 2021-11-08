export const readFile = async (file: File) => {
  const fileReader = new FileReader();
  const readerPromise = new Promise<string>((resolve, reject) => {
    fileReader.onload = function () {
      resolve(fileReader.result as string); // because we only use readAsText
    };
    fileReader.onerror = function () {
      reject(fileReader.error);
    };
  });
  fileReader.readAsText(file);

  return await readerPromise;
};

export const parseFile = (contents: string) => {
  return contents
    .split("\n")
    .map((email) => email.trim())
    .filter((email) => email.match(/\S/));
};

export const extractEmailsFromFiles = async (files: File[]) => {
  const emailsPerFile = await Promise.all(
    files.map(async (item) => ({
      fileName: item.name,
      emails: parseFile(await readFile(item)),
    }))
  );
  return emailsPerFile;
};
