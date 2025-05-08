
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const compressImage = async (file, options = {}) => {
  try {
    const compressedFile = await imageCompression(file, options);
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      file: compressedFile,
      originalFile: file,
      preview: URL.createObjectURL(compressedFile),
      compressionRatio: (file.size / compressedFile.size).toFixed(1),
      compressed: true
    };
  } catch (error) {
    console.error("Error compressing image:", error);
    // Return original file if compression fails
    return {
      id: Math.random().toString(36).substring(2, 11),
      file: file,
      originalFile: file,
      preview: URL.createObjectURL(file),
      compressionRatio: 1,
      compressed: true
    };
  }
};

export const createImageEntry = (file) => {
  return {
    id: Math.random().toString(36).substring(2, 11),
    file: file,
    originalFile: file,
    preview: URL.createObjectURL(file),
    compressionRatio: 1,
    compressed: false
  };
};

export const createAndDownloadZip = async (images) => {
  const zip = new JSZip();
  
  images.forEach(image => {
    zip.file(image.file.name, image.file);
  });
  
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "compressed_images.zip");
};
