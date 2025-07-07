"use client";

import ProductClient from "@/apiClient/product/ProductClient";
import AddButton from "@/components/button/addButton/AddButton";
import DeleteButton from "@/components/button/deleteButton/DeleteButton";
import { getMessageApi } from "@/context/message/MessageContext";
import { ProductLineResponse } from "@/models/apiResponse/productLine/ProductLineResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Flex, Row, Table, TableColumnsType } from "antd";
import { useMemo } from "react";

interface Pagination {
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

interface TemplateProps {
  productUid: string;
}

const BodyTemplate = ({ productUid }: TemplateProps) => {
  const {
    data: linkedProductLines,
    isFetching: linkedFetching,
    refetch: refetchLinked,
  } = useQuery<ProductLineResponse[]>({
    queryKey: ["product-lines", productUid, "linked"],
    queryFn: () => {
      return ProductClient.readAllProductLines(productUid, true);
    },
  });

  const {
    data: notLinkedProductLines,
    isFetching: notLinkedFetching,
    refetch: refetchNotLinked,
  } = useQuery<ProductLineResponse[]>({
    queryKey: ["product-lines", productUid, "notLinked"],
    queryFn: () => {
      return ProductClient.readAllProductLines(productUid, false);
    },
  });

  const addProductLineMutation = useMutation({
    mutationFn: (uid: string) => ProductClient.addProductLines(productUid, uid),
    onSuccess: () => {
      getMessageApi().success("Đã thêm!");
      refetchLinked();
      refetchNotLinked();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa dòng sản phẩm");
    },
  });

  const removeProductLineMutation = useMutation({
    mutationFn: (uid: string) => ProductClient.removeProductLines(productUid, uid),
    onSuccess: () => {
      getMessageApi().success("Đã xóa!");
      refetchLinked();
      refetchNotLinked();
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa dòng sản phẩm");
    },
  });

  const columnsLinked: TableColumnsType<ProductLineResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên dòng sản phẩm",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Lần cập nhật cuối",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: ProductLineResponse) => (
          <Flex gap={10} wrap>
            <DeleteButton type="text" danger size="small" onClick={() => handleDelete(record.uid)}>
              Xóa
            </DeleteButton>
          </Flex>
        ),
      },
    ],
    []
  );

  const columnsNotLinked: TableColumnsType<ProductLineResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên dòng sản phẩm",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Lần cập nhật cuối",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: true,
        render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 100,
        render: (_, record: ProductLineResponse) => (
          <Flex gap={10} wrap>
            <AddButton type="primary" size="small" onClick={() => handleAdd(record.uid)}>
              Thêm
            </AddButton>
          </Flex>
        ),
      },
    ],
    []
  );

  const handleAdd = (uid: string) => {
    addProductLineMutation.mutate(uid);
  };

  const handleDelete = (uid: string) => {
    removeProductLineMutation.mutate(uid);
  };

  return (
    <Row gutter={10} justify="space-between">
      <Col lg={{ span: 24 }} xl={{ span: 12 }}>
        <Table loading={linkedFetching} columns={columnsLinked} dataSource={linkedProductLines || []} rowKey="uid" />
      </Col>
      <Col lg={{ span: 24 }} xl={{ span: 12 }}>
        <Table loading={notLinkedFetching} columns={columnsNotLinked} dataSource={notLinkedProductLines || []} rowKey="uid" />
      </Col>
    </Row>
  );
};

export default BodyTemplate;
