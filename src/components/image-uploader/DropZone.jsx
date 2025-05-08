
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export const DropZone = ({
  isDragging,
  isCompressing,
  onFileSelect,
  fileInputRef,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  dropZoneRef,
  imagesCount
}) => {
  return (
    <div
      ref={dropZoneRef}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out cursor-pointer",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-gray-300 hover:border-primary/50 bg-white",
        imagesCount > 0 ? "h-[180px]" : "h-[220px]",
        isCompressing ? "opacity-75 pointer-events-none" : ""
      )}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => onFileSelect()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
          }
        }}
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
        {isCompressing && (
          <p className="text-sm text-primary animate-pulse mt-2">Compressing images...</p>
        )}
      </div>
    </div>
  );
};
