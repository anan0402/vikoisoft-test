import React, { useEffect, useRef, useState } from "react";
import {
  FaCommentDots,
  FaTelegramPlane,
  FaTimes,
  FaGrinAlt,
  FaUsers,
} from "react-icons/fa";
import classNames from "classnames/bind";
import style from "./style.module.scss";
import EmojiPicker from "emoji-picker-react";

const cx = classNames.bind(style);

type Message = {
  text: string;
  time: string;
  type: boolean;
};

export function ChatBox() {
  //useState
  const [showChatBox, setShowChatBox] = useState(false);
  const [sendMessage, setSendMessage] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  //useRef
  let menuIcon = useRef(null);

  //All functions
  const handleShowChatBox = () => {
    setShowChatBox(!showChatBox);
  };
  const handleCloseChatBox = () => {
    setShowChatBox(false);
  };
  const handelOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  const handleSubmitNewSendMessage = (e: any) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      const newMessage = {
        text: inputMessage,
        time: getCurrentDate(),
        type: true,
      };
      const newMessages = [...sendMessage, newMessage];
      setSendMessage(newMessages);
      setTimeout(() => {
        setSendMessage([
          ...newMessages,
          {
            text: "Hello there! How can i help you?",
            time: getCurrentDate(),
            type: false,
          },
        ]);
      }, 1000);
      setInputMessage("");
    }
  };
  const handleShowEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  return (
    <div className={cx("wrapper")}>
      <button className={cx("chatbox-toggle")} onClick={handleShowChatBox}>
        <FaCommentDots className={cx("message-icon")} />
      </button>
      {showChatBox && (
        <div className={cx("chatbox-message-wapper")}>
          <div className={cx("chatbox-header")}>
            <div className={cx("user-profile")}>
              <div className={cx("image-background")}>
                <img
                  className={cx("user-img")}
                  src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
                  alt="User"
                />
              </div>

              <div className={cx("user-info")}>
                <h4 className={cx("user-name")}>Do An</h4>
                <p className={cx("user-status")}>online</p>
              </div>
            </div>
            <div className={cx("dropdown")} onClick={handleCloseChatBox}>
              <FaTimes />
            </div>
          </div>
          <div className={cx("chatbox-content")}>
            {sendMessage.length === 0 && (
              <div className={cx("anouncememt")}>
                <FaUsers className={cx("user-icon")} />
                <p className={cx("anouncement-text")}>
                  Start conversation with your friend
                </p>
              </div>
            )}
            {sendMessage.length >= 1 &&
              sendMessage.map((data) => {
                if (data.type) {
                  return (
                    <div className={cx("send-message")}>
                      <span className={cx("message-text")}>{data.text}</span>
                      <span className={cx("time")}>{data.time}</span>
                    </div>
                  );
                } else {
                  return (
                    <div className={cx("recieved-message")}>
                      <span className={cx("message-text")}>{data.text}</span>
                      <span className={cx("time")}>{data.time}</span>
                    </div>
                  );
                }
              })}
          </div>
          <div className={cx("chatbox-bottom")}>
            <form
              className={cx("chatbox-message-form")}
              onSubmit={handleSubmitNewSendMessage}
            >
              <div className={cx("message-input-wrapper")}>
                <input
                  placeholder="Type message..."
                  className={cx("message-input")}
                  value={inputMessage}
                  onChange={handelOnChangeInput}
                ></input>
              </div>
              <div className={cx("emoji-btn")} onClick={handleShowEmoji}>
                <FaGrinAlt />
              </div>
              <button className={cx("submit-btn")} type="submit">
                <FaTelegramPlane />
              </button>
            </form>
          </div>
        </div>
      )}
      {showEmoji && (
        <div className={cx("list-icon")} ref={menuIcon}>
          <EmojiPicker
            height={360}
            width={280}
            autoFocusSearch={false}
            lazyLoadEmojis
            skinTonesDisabled
            onEmojiClick={(e) => {
              setInputMessage(`${inputMessage}${e.emoji}`);
            }}
          />
        </div>
      )}
    </div>
  );
}
