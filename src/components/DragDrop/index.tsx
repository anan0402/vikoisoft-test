import React, { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import classNames from "classnames/bind";
import style from "./style.module.scss";
const cx = classNames.bind(style);

export function DragDrop() {
  //All states
  const [active, setActive] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  //Functions that handle all the upload file events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
    console.log(e.dataTransfer.files[0]);
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setActive(true);
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };
  const handleOnClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handelCancel = () => {
    setFile(undefined);
    setActive(false);
  };

  if (file && file.type === "text/plain") {
    return (
      <>
        <button className={cx("cancel-btn")} onClick={handelCancel}>
          Delete
        </button>
      </>
    );
  }

  return (
    <div className={cx("container")}>
      <h1 className={cx("heading")}>Basic Drag and Drop </h1>
      <div className={cx("drag-content")}>
        <h3 className={cx("title")}>Upload your file</h3>
        <div
          className={cx("drag-area")}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
          onDragLeave={(e: React.DragEvent<HTMLDivElement>) =>
            handleDragLeave(e)
          }
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
          style={{
            border: active ? "1px solid #1e78f7 " : "1px dashed #e0eafc",
          }}
        >
          <div className={cx("icon")}>
            <FaFileUpload />
          </div>
          <span className={cx("text")}>
            Drag and drop document here to upload
          </span>
          <input
            type="file"
            multiple
            hidden
            onChange={handleOnChange}
            ref={inputRef}
          />
          <button className={cx("select-btn")} onClick={handleOnClick}>
            Select from device
          </button>
          <span className={cx("support")}>
            Upload document support for TXT files
          </span>
        </div>
      </div>
    </div>
  );
}
