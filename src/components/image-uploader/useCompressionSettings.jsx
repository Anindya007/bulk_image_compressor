
import { useState } from "react";

export const useCompressionSettings = () => {
  const [quality, setQuality] = useState(0.8); // Default to 80% quality
  const [maxWidth, setMaxWidth] = useState(1920);

  const getCompressionOptions = () => {
    // Convert quality (0-1) to maxSizeMB roughly (inverse relationship)
    // Higher quality = less compression = larger file size
    const maxSizeMB = quality < 0.5 ? 0.5 : (1 - quality) + 0.5;
    
    return {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
    };
  };

  return {
    quality,
    setQuality,
    maxWidth,
    setMaxWidth,
    getCompressionOptions
  };
};
