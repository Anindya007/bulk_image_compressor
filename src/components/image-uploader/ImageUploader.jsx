
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DropZone } from "./DropZone";
import { ImagePreviewGrid } from "./ImagePreviewGrid";
import { CompressionSettings } from "./CompressionSettings";
import { CompressionProgress } from "./CompressionProgress";
import { useCompressionSettings } from "./useCompressionSettings";
import { compressImage, createImageEntry, createAndDownloadZip } from "./imageUtils";

export const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const { quality, setQuality, getCompressionOptions } = useCompressionSettings();

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the dropzone
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (files) => {
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleCompressAndDownloadImages = async () => {
    const uncompressedImages = images.filter(image => !image.compressed);

    if (uncompressedImages.length === 0) {
      toast({
        title: "No images to compress",
        description: "All images have already been compressed.",
      });
      return;
    }

    setIsCompressing(true);
    setProcessedCount(0);
    
    toast({
      title: "Compressing images",
      description: `Processing ${uncompressedImages.length} image${uncompressedImages.length !== 1 ? 's' : ''}...`,
    });

    try {
      const options = getCompressionOptions();
      
      // Compress images in batches to avoid overwhelming the browser
      const batchSize = 4; // Process 4 images at a time
      const totalBatches = Math.ceil(uncompressedImages.length / batchSize);
      const compressedImages = [];

      for (let i = 0; i < totalBatches; i++) {
        const batch = uncompressedImages.slice(i * batchSize, (i + 1) * batchSize);
        
        // Process batch in parallel
        const batchResults = await Promise.all(
          batch.map(async (image) => {
            const compressed = await compressImage(image.originalFile, options);
            setProcessedCount(prev => prev + 1);
            return compressed;
          })
        );
        
        compressedImages.push(...batchResults);
      }

      // Replace uncompressed images with compressed versions in the state
      setImages(prevImages =>
        prevImages.map(image => {
          const compressedVersion = compressedImages.find(
            compImg => compImg.originalFile === image.originalFile && !image.compressed
          );
          return compressedVersion || image;
        })
      );

      // Download as zip
      await createAndDownloadZip(compressedImages);

      toast({
        title: "Compression complete",
        description: `${uncompressedImages.length} image${uncompressedImages.length !== 1 ? 's were' : ' was'} compressed and downloaded successfully!`,
      });
    } catch (error) {
      console.error("Error compressing images:", error);
      toast({
        title: "Compression error",
        description: "There was an error compressing one or more images.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
      setProcessedCount(0);
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = [];
    
    // Filter for image files only
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    });
    
    if (validFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select image files only (JPEG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Add images without compression initially
    const newImages = validFiles.map(file => createImageEntry(file));
    
    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Images added",
      description: `${validFiles.length} image${validFiles.length !== 1 ? 's' : ''} added. Click "Compress Images" to optimize them.`
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id) => {
    setImages(prevImages => {
      const imageToRemove = prevImages.find(image => image.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prevImages.filter(image => image.id !== id);
    });
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearAllImages = () => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    toast({
      title: "Images cleared",
      description: "All uploaded images have been cleared."
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Quality settings */}
      {images.length > 0 && (
        <CompressionSettings 
          quality={quality} 
          onQualityChange={setQuality} 
        />
      )}

      {/* Compression progress */}
      {isCompressing && images.length > 0 && (
        <CompressionProgress 
          current={processedCount} 
          total={images.filter(img => !img.compressed).length} 
        />
      )}

      {/* Drag and drop zone */}
      <DropZone
        isDragging={isDragging}
        isCompressing={isCompressing}
        onFileSelect={openFileDialog}
        fileInputRef={fileInputRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        dropZoneRef={dropZoneRef}
        imagesCount={images.length}
      />

      {/* Image preview grid */}
      <ImagePreviewGrid images={images} onRemove={removeImage} />
      
      {/* Action buttons */}
      {images.length > 0 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllImages}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            onClick={handleCompressAndDownloadImages}
            disabled={isCompressing}
          >
            {isCompressing ? 
              "Compressing..." : 
              `Compress and Download ${images.filter(img => !img.compressed).length || images.length} Image${images.filter(img => !img.compressed).length !== 1 || images.length !== 1 ? 's' : ''}`
            }
          </Button>
        </div>
      )}
    </div>
  );
};
