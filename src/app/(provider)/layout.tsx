"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import React from "react";

const queryClient = new QueryClient();

const PageName = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          fontSize: 20,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <>{children}</>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default PageName;
