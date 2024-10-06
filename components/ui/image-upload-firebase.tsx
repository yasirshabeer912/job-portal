import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import toast from "react-hot-toast";
import { storage } from "@/config/firebase.config";
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
  value
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

      const fileName = `JobCoverImage/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          setIsLoading(false);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onChange) {
              onChange(downloadUrl);
            }
            toast.success("Image uploaded successfully");
          } catch (error) {
            console.error("Download URL error:", error);
            toast.error("Failed to get image URL");
          } finally {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Upload handler error:", error);
      toast.error("An error occurred while uploading");
      setIsLoading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(value);
      deleteObject(ref(storage,value)).then(()=>{
        toast.success("Image Removed")
      })
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt="Upload"
            src={value}
          />
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