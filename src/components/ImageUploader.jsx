
import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

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

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
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
    
    // Create new image objects with preview URLs
    const newImages = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file: file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Files uploaded",
      description: `${validFiles.length} image${validFiles.length !== 1 ? 's' : ''} added successfully!`,
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

  return (
    <div className="space-y-6 w-full">
      {/* Drag and drop zone */}
      <div
        ref={dropZoneRef}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-primary/50 bg-white",
          images.length > 0 ? "h-[180px]" : "h-[220px]"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className={cn(
            "rounded-full bg-primary/10 p-4 transition-transform duration-300",
            isDragging ? "scale-110" : ""
          )}>
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragging ? "Drop images here" : "Drag & drop images here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
          </div>
          <p className="text-xs text-gray-400">Supports: JPG, PNG, GIF, WebP, etc.</p>
        </div>
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Uploaded Images ({images.length})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(image => (
              <div 
                key={image.id} 
                className="group relative rounded-md overflow-hidden bg-gray-50 border border-gray-200 aspect-square"
              >
                <img 
                  src={image.preview} 
                  alt={image.file.name}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="rounded-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                  {image.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      {images.length > 0 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              images.forEach(image => URL.revokeObjectURL(image.preview));
              setImages([]);
              toast({
                title: "Images cleared",
                description: "All uploaded images have been cleared."
              });
            }}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // Placeholder for processing/saving images
              toast({
                title: "Processing images",
                description: `${images.length} image${images.length !== 1 ? 's' : ''} ready to be processed.`
              });
            }}
          >
            Process {images.length} Image{images.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};
