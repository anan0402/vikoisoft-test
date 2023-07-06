import React from "react";
import { FaFileUpload } from "react-icons/fa";
import classNames from "classnames/bind";
import style from "./style.module.scss";
const cx = classNames.bind(style);

//icon duoi sgv

interface Props {}
export function DragDrop() {
  return (
    <div className={cx("container")}>
      <h1 className={cx("heading")}>Basic Drag and Drop</h1>
      <div className={cx("drag-content")}>
        <h3 className={cx("title")}>Upload your file</h3>
        <div className={cx("drag-area")}>
          <div className={cx("icon")}>
            <FaFileUpload />
          </div>
          <span className={cx("text")}>Drag & Drop</span>
          <span className={cx("text")}>
            or<span className={cx("button")}>browse</span>
          </span>
          <span className={cx("support")}>Support for 'file.txt'</span>
        </div>
      </div>
    </div>
  );
}
