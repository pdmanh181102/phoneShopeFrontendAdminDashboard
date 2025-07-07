"use client";

import ProductAttributeClient from "@/apiClient/productAttribute/ProductAttributeClient";
import DeleteButton from "@/components/button/deleteButton/DeleteButton";
import EditButton from "@/components/button/editButton/EditButton";
import { getMessageApi } from "@/context/message/MessageContext";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductAttributeResponse } from "@/models/apiResponse/productAttribute/ProductAttributeResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Popconfirm, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useRef, useState } from "react";
import FormCreate from "./components/formCreate/FormCreate";
import FormEditGroupName from "./components/formEditGroupName/formEditGroupName";
import FormEditName from "./components/formEditName/FormEditName";
import FormEditValue from "./components/formEditValue/FormEditValue";

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
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortBy: "name",
    direction: "ASC",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditValueModal, setShowEditValueModal] = useState(false);
  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState(false);
  const selectedUidRef = useRef<string>(null);

  const { data, isFetching, refetch } = useQuery<PageResponse<ProductAttributeResponse>>({
    queryKey: ["product-attributes", productUid, pagination.page, pagination.size, pagination.sortBy, pagination.direction],
    queryFn: () => {
      1;
      return ProductAttributeClient.readAll(productUid, pagination.page, pagination.size, pagination.sortBy, pagination.direction);
    },
  });

  // Mutation để xóa item
  const deleteItemMutation = useMutation({
    mutationFn: (uid: string) => ProductAttributeClient.delete(uid),
    onSuccess: () => {
      getMessageApi().success("Xóa thuộc tính sản phẩm thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      getMessageApi().error(error?.message || "Có lỗi xảy ra khi xóa thuộc tính sản phẩm");
    },
  });

  const columns: TableColumnsType<ProductAttributeResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Giá trị",
        dataIndex: "value",
        key: "value",
        sorter: true,
      },
      {
        title: "Nhóm",
        dataIndex: "groupName",
        key: "groupName",
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
        render: (_, record: ProductAttributeResponse) => (
          <Flex gap={10} wrap>
            <Popconfirm
              title="Xóa thuộc tính sản phẩm"
              description={`Bạn có chắc chắn muốn xóa thuộc tính sản phẩm "${record.name}"?`}
              onConfirm={() => handleDelete(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <DeleteButton type="text" danger size="small" loading={deleteItemMutation.isPending}>
                Xóa
              </DeleteButton>
            </Popconfirm>
            <EditButton type="link" size="small" loading={deleteItemMutation.isPending} onClick={() => handleEditName(record.uid)}>
              Sửa tên
            </EditButton>
            <EditButton type="link" size="small" loading={deleteItemMutation.isPending} onClick={() => handleEditValue(record.uid)}>
              Sửa giá trị
            </EditButton>
            <EditButton type="link" size="small" loading={deleteItemMutation.isPending} onClick={() => handleEditGroupName(record.uid)}>
              Sửa tên nhóm
            </EditButton>
          </Flex>
        ),
      },
    ],
    [deleteItemMutation.isPending]
  );

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProductAttributeResponse> | SorterResult<any>[]
  ) => {
    const { current, pageSize } = paginationConfig;

    // Handle sorting
    let newSortBy = pagination.sortBy;
    let newDirection = pagination.direction;

    if (!Array.isArray(sorter) && sorter.field && sorter.order) {
      newSortBy = sorter.field as string;
      newDirection = sorter.order === "ascend" ? "ASC" : "DESC";
    }

    setPagination({
      page: (current || 1) - 1, // Convert to 0-based indexing
      size: pageSize || 10,
      sortBy: newSortBy,
      direction: newDirection,
    });
  };

  const createLinkEdit = (uid: string) => {
    return `/products/${productUid}/product-attributes/${uid}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleEditName = (uid: string) => {
    selectedUidRef.current = uid;
    setShowEditNameModal(true);
  };

  const handleEditValue = (uid: string) => {
    selectedUidRef.current = uid;
    setShowEditValueModal(true);
  };

  const handleEditGroupName = (uid: string) => {
    selectedUidRef.current = uid;
    setShowEditGroupNameModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleCreateCancel = () => {
    setShowCreateModal(false);
  };

  const handleEditNameSuccess = () => {
    setShowEditNameModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleEditNameCancel = () => {
    setShowEditNameModal(false);
  };

  const handleEditValueSuccess = () => {
    setShowEditValueModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleEditValueCancel = () => {
    setShowEditValueModal(false);
  };

  const handleEditGroupNameSuccess = () => {
    setShowEditGroupNameModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleEditGroupNameCancel = () => {
    setShowEditGroupNameModal(false);
  };

  const handleDelete = (uid: string) => {
    deleteItemMutation.mutate(uid);
  };

  console.log("product lines: ", data?.content);

  return (
    <>
      <Flex vertical gap={10}>
        <Flex gap={10}>
          <Button size="small" type="primary" onClick={handleAdd}>
            Thêm
          </Button>
          <Button size="small" onClick={handleRefresh} loading={isFetching}>
            Tải lại
          </Button>
        </Flex>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data?.content || []}
          rowKey="uid"
          onChange={handleTableChange}
          pagination={{
            current: pagination.page + 1, // Convert back to 1-based for display
            pageSize: pagination.size,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            total: data?.totalElements || 0,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          }}
        />
      </Flex>
      <FormCreate productUid={productUid} visible={showCreateModal} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
      <FormEditName
        productUid={productUid}
        uid={selectedUidRef.current!}
        visible={showEditNameModal}
        onSuccess={handleEditNameSuccess}
        onCancel={handleEditNameCancel}
      />
      <FormEditValue uid={selectedUidRef.current!} visible={showEditValueModal} onSuccess={handleEditValueSuccess} onCancel={handleEditValueCancel} />
      <FormEditGroupName
        uid={selectedUidRef.current!}
        visible={showEditGroupNameModal}
        onSuccess={handleEditGroupNameSuccess}
        onCancel={handleEditGroupNameCancel}
      />
    </>
  );
};

export default BodyTemplate;
