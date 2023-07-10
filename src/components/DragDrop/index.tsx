import React, { useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import classNames from "classnames/bind";
import style from "./style.module.scss";
const cx = classNames.bind(style);

export function DragDrop() {
  //All states
  const [active, setActive] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [isValidFile, setValidFile] = useState(false);
  const [wordsArray, setWordsArray] = useState<string[]>([]);
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
    const statistic: Record<string, number> = {};

    words?.forEach((word) => {
      statistic[word] = (statistic[word] || 0) + 1;
    });
    if (!words || words.length < 3) return false;

    const sortedWords = Object.keys(statistic).sort(
      (a, b) => statistic[b] - statistic[a]
    );

    const array = sortedWords
      .slice(0, 3)
      .map((word) => ({ word, count: statistic[word] }));
    setMoreApperance(array);
    setWordsArray(sortedWords);
    return true;
  };

  const workerReadFile = (selectedFile: File | undefined) => {
    if (selectedFile) {
      const url = new URL("../../functions/worker.js", import.meta.url);
      const worker = new Worker(url);
      worker.onmessage = (event) => {
        const content = event.data as string;
        const statistic = processFileContent(content);
        if (statistic === false) setValidFile(true);
        else setValidFile(false);
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
        setValidFile(false);
      } else {
        setValidFile(true);
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
        {isValidFile && (
          <div className={cx("error-upload")}>
            <span className={cx("error-message")}>
              Whoops! This file is satisfy the condition. The file must be .txt
              extension and not contain any digits or characters that are not
              alphanumeric, comma (,), space ( ), or period (.). Additionally,
              the file must contain more than three distinct words.
            </span>
          </div>
        )}
      </div>
      {wordsArray.length >= 1 && !isValidFile && (
        <div className={cx("result")}>
          <table className={cx("word-number-table")}>
            <thead className={cx("table-header")}>
              <h4 className={cx("header-text")}>
                The total number of distinct words: {wordsArray.length}
              </h4>
            </thead>
            <tbody>
              <tr className={cx("body-row")}>
                <th className={cx("rank")}>
                  <span className={cx("content")}>1 st</span>
                </th>
                <th className={cx("word")}>
                  <span className={cx("content")}>{moreApperance[0].word}</span>
                </th>
                <th className={cx("count")}>
                  <span className={cx("content")}>
                    {moreApperance[0].count}
                  </span>
                </th>
              </tr>
              <tr className={cx("body-row")}>
                <th className={cx("rank")}>
                  <span className={cx("content")}>2 nd</span>
                </th>
                <th className={cx("word")}>
                  <span className={cx("content")}>{moreApperance[1].word}</span>
                </th>
                <th className={cx("count")}>
                  <span className={cx("content")}>
                    {moreApperance[1].count}
                  </span>
                </th>
              </tr>
              <tr className={cx("body-row")}>
                <th className={cx("rank")}>
                  <span className={cx("content")}>3 rd</span>
                </th>
                <th className={cx("word")}>
                  <span className={cx("content")}>{moreApperance[2].word}</span>
                </th>

                <th className={cx("count")}>
                  <span className={cx("content")}>
                    {moreApperance[2].count}
                  </span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
