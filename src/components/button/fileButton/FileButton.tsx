"use client";

import { Button, ButtonProps } from "antd";
import { useRef } from "react";

interface FileButtonProps extends ButtonProps {
  onSelectFile?: (file: File) => void;
}

const FileButton = ({ children, onSelectFile, onClick, ...props }: FileButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onSelectFile) {
      onSelectFile(file);
    }
  };

  return (
    <>
      <input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
    </>
  );
};

export default FileButton;
