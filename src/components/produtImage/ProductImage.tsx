import { Image, ImageProps } from "antd";
import React from "react";

interface ProductImageProps extends ImageProps {}

const ProductImage: React.FC<ProductImageProps> = (props: ProductImageProps) => {
  return <Image {...props} height={100} />;
};

export default ProductImage;
