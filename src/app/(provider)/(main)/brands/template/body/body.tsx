"use client";

import BrandClient from "@/apiClient/brand/BrandClient";
import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { BrandResponse } from "@/models/apiResponse/brand/BrandResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Image, Popconfirm, Table, TableColumnsType, TablePaginationConfig, message } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useMemo, useState } from "react";
import FormCreate from "./components/formCreate/FormCreate";

interface Pagination {
  page: number;
  size: number;
  sortBy: string;
  direction: "ASC" | "DESC";
}

const BodyTemplate = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 10,
    sortBy: "name",
    direction: "ASC",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isFetching, refetch } = useQuery<PageResponse<BrandResponse>>({
    queryKey: ["brands", pagination.page, pagination.size, pagination.sortBy, pagination.direction],
    queryFn: () => {
      return BrandClient.readAll(pagination.page, pagination.size, pagination.sortBy, pagination.direction);
    },
  });

  // Mutation để xóa brand
  const deleteBrandMutation = useMutation({
    mutationFn: (uid: string) => BrandClient.delete(uid),
    onSuccess: () => {
      message.success("Xóa thương hiệu thành công!");
      refetch(); // Refresh danh sách sau khi xóa
    },
    onError: (error: any) => {
      message.error(error?.message || "Có lỗi xảy ra khi xóa thương hiệu");
    },
  });

  const columns: TableColumnsType<BrandResponse> = useMemo(
    () => [
      {
        title: "UID",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Tên thương hiệu",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Hình ảnh",
        dataIndex: "photoUrl",
        key: "photo",
        render: (url: string) =>
          url ? <Image src={PhotoUrlHelper.GetPhotoUrl(url)} alt="Brand" style={{ width: 50, height: 50, objectFit: "cover" }} /> : "N/A",
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
        render: (_, record: BrandResponse) => (
          <Flex gap={10} wrap>
            <Popconfirm
              title="Xóa thương hiệu"
              description={`Bạn có chắc chắn muốn xóa thương hiệu "${record.name}"?`}
              onConfirm={() => handleDelete(record.uid)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" loading={deleteBrandMutation.isPending}>
                Xóa
              </Button>
            </Popconfirm>
            <Button type="link" icon={<EditOutlined />} size="small" loading={deleteBrandMutation.isPending} href={createLinkEdit(record.uid)}>
              Sửa
            </Button>
          </Flex>
        ),
      },
    ],
    [deleteBrandMutation.isPending]
  );

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<BrandResponse> | SorterResult<any>[]
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
    return `/brands/${uid}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch(); // Refresh danh sách sau khi thêm thành công
  };

  const handleCreateCancel = () => {
    setShowCreateModal(false);
  };

  const handleDelete = (uid: string) => {
    deleteBrandMutation.mutate(uid);
  };

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
      <FormCreate visible={showCreateModal} onSuccess={handleCreateSuccess} onCancel={handleCreateCancel} />
    </>
  );
};

export default BodyTemplate;
