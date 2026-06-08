import React, { useState, useRef } from "react";
import { userService } from "../../../services/user.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faFileImage, faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DialogShell } from "../../../shared/ui/components/DialogShell";

interface AvatarUploadModalProps {
  userId: string;
  currentAvatar: string;
  userLetter: string;
  onClose: () => void;
  onSuccess: (newUrl: string) => void;
}

export const AvatarUploadModal = ({ userId, currentAvatar, userLetter, onClose, onSuccess }: AvatarUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(file.type) && !["jpg", "jpeg", "png"].includes(fileExtension || "")) {
        setError("Only .jpg, .jpeg, .png image files are allowed."); 
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      if (file.size === 0) {
        setError("File size must be greater than 0 byte.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must not exceed 5MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleRemoveSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Giải phóng bộ nhớ RAM đã cấp phát cho Object URL preview
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset giá trị value của thẻ input để có thể chọn lại chính file đó nếu muốn
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    try {
      const res: any = await userService.uploadAvatar(userId, selectedFile);
      // Result<UploadAvatarResponse> { isSuccess, data: { avatarUrl } }
      if (res?.isSuccess) {
        onSuccess(res.data.avatarUrl);
        onClose();
      } else {
        setError(res.errors?.[0] || "Upload failed from server.");
      }
    } catch (err) {
      setError("Network error occurred during uploading.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const renderAvatarContent = () => {
    if (previewUrl) {
        return <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />;
    }
    
    if (currentAvatar && !currentAvatar.includes("ui-avatars.com")) {
        return <img src={currentAvatar} alt="Current" className="h-full w-full object-cover" />;
    }
    
    return <span>{userLetter}</span>;
  };

  return (
    <DialogShell
      open={true}
      title="Update Profile Photo"
      isLoading={isUploading}
      onClose={onClose}
    >
              <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-dashed border-gray-700 bg-gray-900 flex items-center justify-center text-white text-5xl font-bold">
            {renderAvatarContent()}
          </div>

          <label htmlFor="avatarFile" className="sr-only">Upload Avatar Image</label>  
          <input 
            id="avatarFile" 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".jpg,.jpeg,.png" 
            multiple={false}
            className="hidden" 
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 transition"
          >
            <FontAwesomeIcon icon={faUpload} className="h-4 w-4" /> Browse Image File
          </button>

          {selectedFile && !error && (
            <div className="mt-2 flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1.5 rounded-xl text-xs text-emerald-400 max-w-xs font-medium animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5 truncate">
              <FontAwesomeIcon icon={faFileImage} className="text-emerald-500 shrink-0" />
              <span className="truncate" title={selectedFile.name}>{selectedFile.name}</span>
            </span>
            
            <button
              type="button"
              title="Cancel selected photo"
              disabled={isUploading}
              onClick={handleRemoveSelectedFile}
              className="w-4 h-4 rounded-full bg-emerald-900/60 hover:bg-red-600 hover:text-white flex items-center justify-center text-[10px] text-emerald-400 transition-colors duration-150 focus:outline-none disabled:opacity-40 disabled:hover:bg-emerald-900/60"
            >
              ✕
            </button>
          </div>
          )}
          {error && <p className="text-xs text-red-400 mt-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-1" /> {error}
          </p>}
        </div>

        <div className="mt-8 flex gap-3 border-t border-gray-800 pt-4 justify-end">
          <button type="button" disabled={isUploading} onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-xs">
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-md text-xs px-6 font-bold flex items-center gap-1.5"
          >
            {isUploading && <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />}
            Save Photo
          </button>
        </div>
    </DialogShell>
    
  );
};