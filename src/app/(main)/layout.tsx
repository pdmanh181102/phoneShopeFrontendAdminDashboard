"use client";

import React, { useMemo, useState } from "react";

import { App, ConfigProvider, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer } from "antd/es/layout/layout";
import { ItemType } from "antd/es/menu/interface";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();

  const menuItems = useMemo<ItemType[]>(
    () => [
      { key: "1", label: "Home", onClick: () => router.push("/home") },
      {
        key: "2",
        label: "Thương hiệu",
        onClick: () => router.push("/brands"),
      },
    ],
    []
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          fontSize: 20,
        },
      }}
    >
      <App>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} breakpoint="md" onCollapse={(value: boolean) => setCollapsed(value)}>
            <Menu defaultSelectedKeys={["1"]} mode="inline" items={menuItems} theme="dark" />
          </Sider>
          <Layout>
            <Content className="m-5">{children}</Content>
            <Footer>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
}
