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
  // Trim any whitespace from the source URL
  const cleanSrc = typeof src === 'string' ? src.trim() : src
  const [imgSrc, setImgSrc] = useState(cleanSrc || fallbackSrc)
  
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
