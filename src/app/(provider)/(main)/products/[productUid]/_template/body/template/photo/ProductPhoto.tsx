import { PhotoUrlHelper } from "@/helpers/photoUrl/PhotoUrlHelper";
import { ProductPhotoResponse } from "@/models/apiResponse/productPhoto/ProductPhotoResponse";

import { Carousel, Flex, Image } from "antd";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "400px",
  color: "#fff",
  lineHeight: "400px",
  textAlign: "center",
  background: "#364d79",
};
type Props = {
  photos: ProductPhotoResponse[];
};

const ProductPhoto = ({ photos }: Props) => {
  const sortedPhotos = photos.sort((a, b) => Number(b.isMain) - Number(a.isMain));

  console.log(sortedPhotos);

  return (
    <Flex vertical gap={10}>
      <h3>Hình ảnh</h3>
      <Carousel arrows>
        {sortedPhotos.map((photo: ProductPhotoResponse) => (
          <div key={photo.uid}>
            <div style={contentStyle}>
              <Image style={{ maxHeight: "400px" }} src={PhotoUrlHelper.GetPhotoUrl(photo.photoUrl)} />
            </div>
          </div>
        ))}
      </Carousel>
    </Flex>
  );
};

export default ProductPhoto;
