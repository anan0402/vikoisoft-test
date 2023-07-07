import React from "react";
import { DragDrop } from "./components/DragDrop";
import { ChatBox } from "./components/ChatBox";
import classNames from "classnames/bind";
import style from "./AppStyles.module.scss";
const cx = classNames.bind(style);

function App() {
  return (
    <div className={cx("wrapper")}>
      <DragDrop />
      <ChatBox />
    </div>
  );
}

export default App;
