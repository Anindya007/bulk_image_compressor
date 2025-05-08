
import { Progress } from "@/components/ui/progress";

export const CompressionProgress = ({ current, total }) => {
  if (total === 0) return null;
  
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">Processing images...</span>
        <span className="text-sm font-medium">{current} of {total} ({percentage}%)</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};
