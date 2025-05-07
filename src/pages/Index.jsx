
import { ImageUploader } from "../components/ImageUploader";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Image Uploader</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Drag and drop multiple images or click to select files from your device
      </p>
      
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-5">
        <ImageUploader />
      </div>
      
      <p className="text-gray-400 text-xs mt-8 text-center">
        Images are processed in your browser and not uploaded to any server
      </p>
      <Toaster />
    </div>
  );
};

export default Index;
