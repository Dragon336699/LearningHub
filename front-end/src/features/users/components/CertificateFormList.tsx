import React, { memo, useRef } from "react";
import { Certificate } from "../../../types/certificate";
import { faArrowUpRightFromSquare, faExclamationTriangle, faFolder, faPlus, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CertificateFormListProps {
  certificates: Certificate[];
  onChange: (updatedCerts: Certificate[]) => void;
  onFileChange: (indexOrId: string | number, file: File) => void;
  selectedFilesMap: Record<string | number, File>;
  onError: (errorMsg: string) => void;
}

const formatDateForInput = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

export const CertificateFormList = memo(({ 
  certificates, 
  onChange, 
  onFileChange,
  selectedFilesMap,
  onError 
}: CertificateFormListProps) => {

  const fileInputsRef = useRef<Record<number, HTMLInputElement | null>>({});

  const handleAdd = () => {
    const newCert: Certificate = {
      id: "", 
      certificateName: "",
      organization: "",
      issueDate: new Date().toISOString().split("T")[0],
      expirationDate: "",
      credentialUrl: "",
    };
    onChange([...certificates, newCert]);
  };

  const handleRemove = (indexToRemove: number, certId: string) => {
    const updated = certificates.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  const handleFieldChange = (index: number, field: keyof Certificate, value: string) => {
    const updated = certificates.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    onChange(updated);
  };

  return (
    <div className="border-t border-slate-900 pt-6 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Certificates
        </h3>
        <button
          title="Add New Certificate"
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 px-4 py-2 text-xs font-bold text-white transition shadow-md"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        {certificates.map((cert, index) => {
          const isNameEmpty = cert.certificateName?.trim() === "";
          const isOrgEmpty = cert.organization?.trim() === "";

          const fileKey = cert.id || index;
          const hasNewFile = selectedFilesMap[fileKey];
          
          let credentialStatusContent: React.ReactNode;

          if (hasNewFile) {
            credentialStatusContent = (
            <span className="text-emerald-400 italic font-medium inline-flex items-center gap-1.5 truncate">
                <FontAwesomeIcon icon={faFolder} className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="truncate">Selected: {hasNewFile.name}</span>
            </span>
            );
          } else if (cert.credentialUrl) {
            credentialStatusContent = (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-0.5 font-medium transition"
              >
                <span>View Credential</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3.5 w-3.5" />
              </a>
            );
          } else {
            credentialStatusContent = (
              <span className="italic text-slate-500">No document attached</span>
            );
          }

          return (
            <div
              key={cert.id || index}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Certificate {index + 1}
                </span>
                <button
                  title="Remove Certificate"
                  type="button"
                  onClick={() => handleRemove(index, cert.id)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition font-medium"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                {/* Name */}
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`certName-${index}`}>
                    Certificate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`certName-${index}`}
                    type="text"
                    required
                    value={cert.certificateName}
                    onChange={(e) => handleFieldChange(index, "certificateName", e.target.value)}
                    className={`w-full bg-slate-900 border text-white rounded-xl text-sm px-3 py-2 focus:outline-none ${
                      isNameEmpty ? "border-red-500/80 focus:border-red-500" : "border-slate-800 focus:border-orange-500/50"
                    }`}
                    placeholder="e.g. AWS Solutions Architect"
                    maxLength={100}
                  />
                  {isNameEmpty && (
                    <p className="text-[11px] text-red-400 font-medium flex items-center mt-1.5 animate-in fade-in duration-100">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 shrink-0" />
                      Certificate name is required.
                    </p>
                  )}
                </div>

                {/* Organization */}
                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`org-${index}`}>
                    Issuing Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`org-${index}`}
                    type="text"
                    required
                    value={cert.organization}
                    onChange={(e) => handleFieldChange(index, "organization", e.target.value)}
                    className={`w-full bg-slate-900 border text-white rounded-xl text-sm px-3 py-2 focus:outline-none ${
                      isOrgEmpty ? "border-red-500/80 focus:border-red-500" : "border-slate-800 focus:border-orange-500/50"
                    }`}
                    placeholder="e.g. Amazon Web Services"
                    maxLength={100}
                  />
                  {isOrgEmpty && (
                    <p className="text-[11px] text-red-400 font-medium flex items-center mt-1.5 animate-in fade-in duration-100">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 shrink-0" />
                      Issuing organization is required.
                    </p>
                  )}
                </div>

                {/* Issue Date */}
                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`issue-${index}`}>
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`issue-${index}`}
                    type="date"
                    required
                    value={formatDateForInput(cert.issueDate)}
                    onChange={(e) => handleFieldChange(index, "issueDate", e.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm focus:border-orange-500/50"
                  />
                </div>

                {/* Expired Date */}
                <div>
                  <label className="label text-xs font-semibold text-slate-400 mb-1" htmlFor={`exp-${index}`}>
                    Expiration Date (Optional)
                  </label>
                  <input
                    id={`exp-${index}`}
                    type="date"
                    value={formatDateForInput(cert.expirationDate)}
                    onChange={(e) => handleFieldChange(index, "expirationDate", e.target.value)}
                    className="input w-full bg-slate-900 border-slate-800 text-white rounded-xl text-sm focus:border-orange-500/50"
                  />
                </div>

                {/* File Upload */}
                <div className="md:col-span-2 pt-2">
                  <label htmlFor={`credential-${index}`} className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Credential Document / Image File
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      id={`credential-${index}`}
                      type="file"
                      ref={(el) => { fileInputsRef.current[index] = el; }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          console.log("File loaded into List component:", e.target.files[0]);
                          onFileChange(fileKey, e.target.files[0]);
                        }
                      }}
                      accept=".pdf,image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputsRef.current[index]?.click()}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 text-xs font-semibold text-gray-200 transition select-none"
                    >
                      <FontAwesomeIcon icon={faUpload} className="h-4 w-4" /> Browse Certificate File
                    </button>
                    
                    {/* Dynamic File Status */}
                    <div className="text-xs text-slate-400 max-w-full flex items-center gap-1.5 min-h-[32px]">
                      {credentialStatusContent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty certificate list */}
        {certificates.length === 0 && (
          <p className="text-xs text-slate-500 italic text-center py-4">
            No certificate records specified yet.
          </p>
        )}
      </div>
    </div>
  );
});

CertificateFormList.displayName = "CertificateFormList";