interface FileInputProps {
  accept: string;
  multiple: boolean;
  onChange: (files: File[]) => void;
  id: string;
}

const FileInput: React.FC<FileInputProps> = ({
  accept,
  multiple,
  onChange,
  id,
}) => {
  return (
    <input
      data-testid={id}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(event) =>
        onChange(event.target.files ? Array.from(event.target.files) : [])
      }
    />
  );
};

export default FileInput;
