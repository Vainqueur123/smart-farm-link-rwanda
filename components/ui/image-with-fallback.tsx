'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/placeholder-product.png',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'Product image'}
      onError={() => setImgSrc(fallbackSrc)}
      className={props.className}
    />
  )
}
