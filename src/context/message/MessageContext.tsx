// MessageProvider.tsx
import { message } from "antd";
import React from "react";

let messageApiRef: ReturnType<typeof message.useMessage>[0];

export const getMessageApi = () => {
  if (!messageApiRef) throw new Error("Message API chưa sẵn sàng");
  return messageApiRef;
};

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();
  messageApiRef = messageApi; // lưu vào biến toàn cục

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};
