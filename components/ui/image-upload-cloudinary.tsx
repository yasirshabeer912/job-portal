import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || !e.target.files[0]) return;

      const file: File = e.target.files[0];
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "job-portal");
      formData.append("cloud_name", "dsfr7nm3a");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsfr7nm3a/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const imageUrl = data.url;

      if (onChange) {
        onChange(imageUrl);
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(value);
      toast.success("Image removed");
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image fill className="object-cover" alt="Upload" src={value} />
          <Button
            onClick={handleRemove}
            className="absolute top-2 right-2"
            variant="destructive"
            size="sm"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="h-60 relative rounded-lg border-2 border-dashed border-gray-300 p-12">
          <div className="flex flex-col items-center justify-center h-full">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                <p className="text-sm text-gray-500">{progress.toFixed(0)}%</p>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <ImagePlus className="h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload an image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleOnChange}
                  disabled={disabled || isLoading}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
