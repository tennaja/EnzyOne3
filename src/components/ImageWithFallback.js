import Image from "next/image";
import React, { useState } from "react";

function ImageWithFallback(props) {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      onErrorCapture={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

export default ImageWithFallback;
