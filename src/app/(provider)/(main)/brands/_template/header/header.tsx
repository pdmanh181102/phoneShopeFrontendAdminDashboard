import { Breadcrumb, Flex } from "antd";

const HeaderTemplate = () => {
  return (
    <Flex vertical gap={20}>
      <Breadcrumb
        items={[
          {
            title: <a href="/home">Home</a>,
          },
          {
            title: "Thương hiệu",
          },
        ]}
      />
      <h1>Quản lý thương hiệu</h1>
    </Flex>
  );
};

export default HeaderTemplate;
