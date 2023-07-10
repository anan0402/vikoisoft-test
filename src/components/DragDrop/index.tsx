import React, { useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import classNames from "classnames/bind";
import style from "./style.module.scss";
const cx = classNames.bind(style);

export function DragDrop() {
  //All states
  const [active, setActive] = useState(false);
  const [notTXTFile, setNotTXTFile] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [fileRequirement, setFileRequirement] = useState(false);
  const [wordsArray, setWordsArray] = useState<string[] | boolean>([]);
  const [moreApperance, setMoreApperance] = useState<
    { word: string; count: any }[]
  >([]);
  //useRef
  const inputRef = useRef<HTMLInputElement>(null);
  //Functions that handle all the upload file events\

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
    workerReadFile(e.dataTransfer.files[0]);
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setActive(true);
      setFile(e.target.files[0]);
      workerReadFile(e.target.files[0]);
    }
  };
  const handleOnClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const processFileContent = (content: string) => {
    if (/([\d]|[^\w ,.])/.test(content)) return false;
    const words = content.toLowerCase().match(/\w+/g);
    const statistic = new Map<string, number>();

    words?.forEach((word) => {
      // @ts-ignore
      statistic[word] = (statistic[word] || 0) + 1;
    });
    if (!words || words.length < 3) return false;

    const sortedWords = Object.keys(statistic).sort(
      // @ts-ignore
      (a, b) => statistic[b] - statistic[a]
    );
    const array = sortedWords
      .slice(0, 3)
      .map((word) => ({ word, count: statistic[word] }));
    setMoreApperance(array);
    setWordsArray(sortedWords);
    return sortedWords;
  };
  console.log(processFileContent);
  const workerReadFile = (selectedFile: File | undefined) => {
    if (selectedFile) {
      const url = new URL("../../functions/worker.js", import.meta.url);
      const worker = new Worker(url);
      worker.onmessage = (event) => {
        const content = event.data as string;
        const statistic = processFileContent(content);
        if (statistic === false) setFileRequirement(true);
        else setFileRequirement(false);
        setWordsArray(processFileContent(content));
        worker.terminate();
      };
      worker.onerror = (e) => {
        console.log("worker.onerror", e);
      };
      worker.postMessage(selectedFile);
    }
  };
  // useEffect
  useEffect(() => {
    if (file) {
      if (file.type === "text/plain") {
        setNotTXTFile(false);
      } else {
        setNotTXTFile(true);
      }
    }
  }, [file]);

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
            border: active
              ? "1px solid #1e78f7 "
              : "1px dashed rgb(220, 221, 222)",
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
            // onChange={handleFileChange}
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
        {notTXTFile && (
          <div className={cx("error-upload")}>
            <span className={cx("error-message")}>
              Whoops! This file is the wrong format. Try choosing a valid TXT
              for conversion.
            </span>
          </div>
        )}
        {fileRequirement && (
          <div className={cx("error-upload")}>
            <span className={cx("error-message")}>
              The file must not contain any digits or characters that are not
              alphanumeric, comma (,), space ( ), or period (.). Additionally,
              the file must contain more than three distinct words.
            </span>
          </div>
        )}
      </div>
      <div className={cx("result")}>
        <table className={cx("word-number")}>
          <thead>
            <tr>
              <h4>The total number of distinct words:</h4> {wordsArray.length}
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
