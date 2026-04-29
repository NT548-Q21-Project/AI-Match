import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, Loader2, Save, Send, ShieldCheck, HelpCircle } from "lucide-react";
import { jobApi } from "../../services/jobApi";
import { JobStatus } from "../../types/job";
import { cn } from "../../utils";

const RecruiterCreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
    nice_to_have: "",
    benefits: "",
    location: "Remote",
    expired_at: "",
    status: "active" as JobStatus
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newJob = await jobApi.createJob(formData);
      navigate(`/recruiter/jobs/${newJob.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 font-bold hover:text-blue-600 transition-colors uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={16} /> Back to My Jobs
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Post Job Opportunity</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
            Build your team with AI-driven candidate matching
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-900 transition-all"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-900 transition-all"
                    placeholder="e.g. Remote, UK"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={formData.expired_at}
                    onChange={(e) => setFormData({ ...formData, expired_at: e.target.value })}
                    className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold text-gray-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Role Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-gray-700 transition-all resize-none"
                placeholder="What will they be doing? Describe the daily impact and vision..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Responsibilities (Semi-colon separated)</label>
              <textarea
                rows={3}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-gray-700 transition-all resize-none"
                placeholder="Build APIs; Design database schema; Work with DevOps team..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Key Requirements (Semi-colon separated)</label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-gray-700 transition-all resize-none"
                placeholder="Python mastery; 5+ years experience; Cloud infrastructure..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nice to Have (Semi-colon separated)</label>
              <textarea
                rows={3}
                value={formData.nice_to_have}
                onChange={(e) => setFormData({ ...formData, nice_to_have: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-gray-700 transition-all resize-none"
                placeholder="AWS; Kubernetes; Redis; LangChain..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Benefits & Perks (Semi-colon separated)</label>
              <textarea
                rows={3}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium text-gray-700 transition-all resize-none"
                placeholder="Remote work; Health insurance; Learning budget..."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24 space-y-6">
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-3">Initial Status</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "active" })}
                  className={cn(
                    "flex-1 p-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all",
                    formData.status === "active" ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"
                  )}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "draft" })}
                  className={cn(
                    "flex-1 p-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all",
                    formData.status === "draft" ? "bg-gray-100 border-gray-900 text-gray-900" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"
                  )}
                >
                  Draft
                </button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase">
                <ShieldCheck size={16} /> Recruitment Policy
              </h4>
              <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase">
                By posting, you agree to fair recruitment practices. Our AI will analyze your JD to improve matches.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 text-white rounded-3xl font-black text-lg uppercase tracking-tight hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                <>PUBLISH JOB <Send size={20} /></>
              )}
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
            >
              <Save size={16} /> Save as Private Draft
            </button>
          </div>

          <div className="text-center">
            <button type="button" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest">
              <HelpCircle size={14} /> Need help writing this?
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecruiterCreateJobPage;
