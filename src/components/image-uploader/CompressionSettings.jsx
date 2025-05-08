
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CompressionSettings = ({ quality, onQualityChange }) => {
  const qualityPercentage = Math.round(quality * 100);
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Image Quality</span>
          <Badge variant="secondary">{qualityPercentage}%</Badge>
        </div>
        <Slider
          value={[quality * 100]}
          min={10}
          max={100}
          step={5}
          onValueChange={(vals) => onQualityChange(vals[0] / 100)}
          className="w-full"
          aria-label="Image quality"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Compression Settings</h4>
            <div className="text-xs text-muted-foreground">
              <p>Higher quality = larger file size</p>
              <p>Lower quality = smaller file size</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
