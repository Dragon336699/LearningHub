import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, Award } from "lucide-react";
import { Certificate } from "../../../types/certificate";
import { certificateService } from "../../../services/certificate.service";

interface CertificateEditModalProps {
  userId: string;
  editingCertificate: Certificate | null; // null nghĩa là đang chế độ ADD NEW, có object là EDIT
  onClose: () => void;
  onSuccess: () => void; // Trigger ép trang cha tải lại dữ liệu sạch từ DB
}

export const CertificateEditModal = ({ userId, editingCertificate, onClose, onSuccess }: CertificateEditModalProps) => {
  const [certName, setCertName] = useState("");
  const [org, setOrg] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đổ dữ liệu cũ vào form nếu ở chế độ Chỉnh sửa (Edit)
  useEffect(() => {
    if (editingCertificate) {
      setCertName(editingCertificate.certificateName);
      setOrg(editingCertificate.organization);
      setIssueDate(editingCertificate.issueDate ? editingCertificate.issueDate.split("T")[0] : "");
      setExpDate(editingCertificate.expirationDate ? editingCertificate.expirationDate.split("T")[0] : "");
    }
  }, [editingCertificate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !org.trim() || !issueDate) {
      setError("Please fill in all required fields (*).");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCertificate) {
        // Gọi API PUT /certificate
        await certificateService.update(userId, editingCertificate.id, certName, org, issueDate, expDate || null, selectedFile);
      } else {
        // Gọi API POST /certificate
        await certificateService.create(userId, certName, org, issueDate, expDate || null, selectedFile);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to save certificate data. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-950 p-6 shadow-xl text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            {editingCertificate ? "Edit Professional Certificate" : "Add New Certificate"}
          </h3>
          <button title="close" onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="certificateEditName" className="block text-xs font-semibold text-gray-400 mb-1">Certificate Name *</label>
            <input
              id="certificateEditName"
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              placeholder="e.g. AWS Certified Solutions Architect"
              required
            />
          </div>

          <div>
            <label htmlFor="certificateEditOrg" className="block text-xs font-semibold text-gray-400 mb-1">Issuing Organization *</label>
            <input
              id="certificateEditOrg"
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              placeholder="e.g. Amazon Web Services"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificateEditIssueDate" className="block text-xs font-semibold text-gray-400 mb-1">Issue Date *</label>
              <input
                id="certificateEditIssueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="certificateEditExpDate" className="block text-xs font-semibold text-gray-400 mb-1">Expiration Date (Optional)</label>
              <input
                id="certificateEditExpDate"
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="certificateEditCredential" className="block text-xs font-semibold text-gray-400 mb-1">Credential Document / Image File</label>
            <div className="flex items-center gap-3">
              <input
                id="certificateEditCredential"
                type="file"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-200 transition"
              >
                <Upload className="h-4 w-4" /> Upload File
              </button>
              <span className="text-xs text-gray-400 truncate max-w-[250px]">
                {selectedFile ? selectedFile.name : editingCertificate?.credentialUrl ? "Keep existing document" : "No file selected"}
              </span>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">⚠️ {error}</p>}

          <div className="mt-6 flex gap-3 border-t border-gray-800 pt-4 justify-end">
            <button type="button" disabled={isSubmitting} onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-800 text-white rounded-xl text-xs px-6 font-bold flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};