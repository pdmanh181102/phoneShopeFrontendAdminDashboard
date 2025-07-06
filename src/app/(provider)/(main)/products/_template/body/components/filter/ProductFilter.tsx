import BrandClient from "@/apiClient/brand/BrandClient";
import ProductLineClient from "@/apiClient/productLine/ProductLineClient";
import ProductStatusClient from "@/apiClient/productStatus/ProductStatusClient";
import { BrandResponse } from "@/models/apiResponse/brand/BrandResponse";
import { PageResponse } from "@/models/apiResponse/page/PageResponse";
import { ProductLineResponse } from "@/models/apiResponse/productLine/ProductLineResponse";
import { ProductStatusResponse } from "@/models/apiResponse/productStatus/ProductStatusResponse";
import { useQuery } from "@tanstack/react-query";
import { Col, Input, Row, Select } from "antd";
import { debounce } from "lodash";
import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";

const selectStyle: CSSProperties = {
  width: "100%",
};

export interface ProductFilterParams {
  nameLike: string;
  brandUids: string[];
  statusUids: string[];
  productLineUids: string[];
}

export const initProductFilterParams: ProductFilterParams = {
  brandUids: [],
  statusUids: [],
  productLineUids: [],
  nameLike: "",
};

interface ComponentProps {
  onChange?: (params: ProductFilterParams) => void;
}

const ProductFilter: React.FC<ComponentProps> = ({ onChange }) => {
  const [filterParams, setFilterParams] = useState<ProductFilterParams>(initProductFilterParams);
  const [nameInput, setNameInput] = useState<string>("");

  const { data: brandData } = useQuery<PageResponse<BrandResponse>>({
    queryKey: ["brands", 0, 1000, "name", "ASC"],
    queryFn: () => {
      return BrandClient.readAll(0, 1000, "name", "ASC");
    },
  });

  const brandOptions = useMemo(
    () =>
      brandData?.content.map((item) => ({
        value: item.uid,
        label: item.name,
      })),
    [brandData?.content]
  );

  const { data: productStatusData } = useQuery<PageResponse<ProductStatusResponse>>({
    queryKey: ["product-status", 0, 1000, "name", "ASC"],
    queryFn: () => {
      return ProductStatusClient.readAll(0, 1000, "name", "ASC");
    },
  });

  const productStatusOptions = useMemo(
    () =>
      productStatusData?.content.map((item) => ({
        value: item.uid,
        label: item.name,
      })),
    [productStatusData?.content]
  );

  const { data: productLineData } = useQuery<PageResponse<ProductLineResponse>>({
    queryKey: ["product-lines", [filterParams.brandUids], 0, 1000, "name", "ASC"],
    queryFn: () => {
      return ProductLineClient.readAll(filterParams.brandUids, 0, 1000, "name", "ASC");
    },
  });

  const productLineOptions = useMemo(
    () =>
      productLineData?.content.map((item) => ({
        value: item.uid,
        label: item.name,
      })),
    [productLineData?.content]
  );

  const handleChangeUids = (type: "brandUids" | "statusUids" | "productLineUids", uids: string[]) => {
    if (type == "brandUids") {
      setFilterParams({ ...filterParams, [type]: uids, productLineUids: [] });
      return;
    }
    setFilterParams({ ...filterParams, [type]: uids });
  };

  const handleChangeNameLike = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameInput(value);
    debouncedSetNameLike(value);
  };

  const debouncedSetNameLike = useCallback(
    debounce((value: string) => {
      setFilterParams((prev) => ({
        ...prev,
        nameLike: value,
      }));
    }, 500),
    []
  );

  useEffect(() => {
    if (onChange) onChange(filterParams);
  }, [filterParams]);

  return (
    <>
      <Row>
        <Col
          xs={{
            span: 24,
          }}
          md={{
            span: 12,
          }}
        >
          <Input placeholder="Tên sản phẩm" value={nameInput} onChange={handleChangeNameLike} />
        </Col>
      </Row>
      <Row gutter={10}>
        <Col
          xs={{
            span: 24,
          }}
          sm={{
            span: 8,
          }}
        >
          <label>Thương hiệu</label>
          <Select mode="multiple" options={brandOptions} style={selectStyle} onChange={(uids) => handleChangeUids("brandUids", uids)} />
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          sm={{
            span: 8,
          }}
        >
          <label>Trạng thái</label>
          <Select mode="multiple" options={productStatusOptions} style={selectStyle} onChange={(uids) => handleChangeUids("statusUids", uids)} />
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          sm={{
            span: 8,
          }}
        >
          <label>Dòng sản phẩm</label>
          <Select
            mode="multiple"
            options={productLineOptions}
            style={selectStyle}
            onChange={(uids) => handleChangeUids("productLineUids", uids)}
            value={filterParams.productLineUids}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProductFilter;
