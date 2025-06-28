import { Image, ImageProps } from "antd";
import React from "react";

interface SmallImageProps extends ImageProps {}

const SmallImage: React.FC<SmallImageProps> = (props: SmallImageProps) => {
  return <Image {...props} height={30} />;
};

export default SmallImage;
