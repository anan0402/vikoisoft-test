import React from "react";
import "./GlobalStyles.scss";

interface Props {
  children?: React.ReactNode;
}

export function GlobalStyles({ children }: Props) {
  return <div>{children}</div>;
}
