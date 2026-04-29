import React, { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Loader2, File, ExternalLink, Eye } from "lucide-react";
import { cvApi } from "../../services/cvApi";
import { CV } from "../../types/cv";
import { formatDate, cn } from "../../utils";

const CandidateCVPage: React.FC = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCv, setSelectedCv] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const data = await cvApi.getCVs();
      setCvs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", uploadTitle || file.name);

    try {
      const newCv = await cvApi.uploadCV(formData);
      setCvs([newCv, ...cvs]);
      setUploadTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!window.confirm("Are you sure you want to delete this CV?")) return;
    try {
      await cvApi.deleteCV(cvId);
      setCvs(cvs.filter(c => c.id !== cvId));
      if (selectedCv?.id === cvId) {
        setSelectedCv(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & List */}
        <div className="lg:col-span-4 space-y-8">
          {/* Upload Card */}
          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Upload size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                Upload New CV
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">CV Title/Role</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-bold text-sm"
                />
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer bg-gray-50 group"
              >
                <div className="w-12 h-12 bg-white text-gray-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:text-emerald-500 transition-colors">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">Upload File</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">PDF, DOCX (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest animate-pulse">
                    <Loader2 className="animate-spin" size={14} />
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CV List Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} />
                My CVs ({cvs.length})
              </h3>
            </div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />)}
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No CVs uploaded yet.</p>
            </div>
          ) : (
            cvs.map((cv) => (
              <div
                key={cv.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer group",
                  selectedCv?.id === cv.id
                    ? "bg-blue-50 border-blue-600 shadow-sm"
                    : "bg-white border-gray-100 hover:border-blue-200 shadow-sm"
                )}
                onClick={() => setSelectedCv(cv)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedCv?.id === cv.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{cv.title}</h4>
                      <p className="text-xs text-gray-500">{cv.file_name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>{formatDate(cv.created_at)}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cv.id); }}
                      className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors title='Delete'"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors title='View'">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          </section>
        </div>

        {/* View Detail */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedCv ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-[400px]">
              <File size={64} className="text-blue-200 mb-6" />
              <h4 className="text-xl font-bold text-gray-900">Select a CV to preview the original file</h4>
              <p className="text-gray-500 mt-2">
                Choose a CV from the list or upload a new one.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px] lg:h-[800px]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-blue-600" size={20} />
                  {selectedCv.file_name || selectedCv.title}
                </h3>
                {selectedCv.file_url && (
                  <a
                    href={selectedCv.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    <ExternalLink size={16} /> Open File
                  </a>
                )}
              </div>
              <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
                {selectedCv.file_url ? (
                  selectedCv.file_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={selectedCv.file_url}
                      className="w-full h-full rounded-2xl border border-gray-200 shadow-sm"
                      title={selectedCv.title}
                    />
                  ) : (
                    <div className="text-center p-8 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md w-full">
                      <File size={48} className="mx-auto text-blue-300 mb-4" />
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedCv.file_name}</h4>
                      <p className="text-sm text-gray-500 mb-6">Preview is not available for this file type.</p>
                      <a
                        href={selectedCv.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={16} /> Download or Open
                      </a>
                    </div>
                  )
                ) : (
                  <div className="text-center p-8 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md w-full">
                    <File size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-sm text-gray-500 mb-2">No file available for preview.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default CandidateCVPage;
