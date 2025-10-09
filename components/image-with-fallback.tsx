"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string
}

export const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}

export default ImageWithFallback
