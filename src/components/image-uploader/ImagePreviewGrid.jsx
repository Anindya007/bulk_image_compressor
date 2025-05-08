
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ImagePreviewGrid = ({ images, onRemove }) => {
  if (images.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-600 mb-3">
        Uploaded Images ({images.length})
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
                  onRemove(image.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
              {image.file.name}
            </div>
            {image.compressed && image.compressionRatio > 1 && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-sm">
                {image.compressionRatio}x
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
