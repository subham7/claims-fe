import Image from "next/image";
import React, { useEffect, useState } from "react";

const SafeImage = ({ src, fallbackSrc, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const img = new window.Image();

    img.onload = () => setImageSrc(src);
    img.onerror = () => setImageSrc(fallbackSrc);

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return <Image src={imageSrc} alt={alt} {...props} />;
};

export default SafeImage;
