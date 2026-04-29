import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Building2, ChevronRight, X, Sparkles, Loader2, FileText, ClipboardList } from "lucide-react";
import { jobApi } from "../../services/jobApi";
import { Job } from "../../types/job";
import { formatDate, cn } from "../../utils";
import { Link } from "react-router-dom";

const CandidateHomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    status: "active"
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobApi.getJobs(filters);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-4 tracking-tighter">Find your next career move with AI</h2>
          <p className="text-emerald-50 text-lg mb-6 leading-relaxed font-medium">
            Upload your CV and let our AI match you with the most relevant opportunities based on your unique skills and experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/candidate/cvs"
              className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-[0.98] shadow-sm uppercase text-xs tracking-widest"
            >
              <FileText size={18} />
              Manage My CVs
            </Link>
            <Link
              to="/candidate/applications"
              className="bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all active:scale-[0.98] border border-emerald-500 uppercase text-xs tracking-widest"
            >
              <ClipboardList size={18} />
              My Applications
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <Sparkles size={300} className="-mr-20 -mt-20" />
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by job title, skills, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-gray-900 font-bold"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-gray-700 min-w-[140px] cursor-pointer"
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Singapore">Singapore</option>
              <option value="London">London</option>
              <option value="Hồ Chí Minh (cũ)">TP. HCM</option>
              <option value="Hà Nội">Hà Nội</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-gray-700 min-w-[140px] cursor-pointer"
            >
              <option value="">Job Type</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
            </select>
            {(searchQuery || filters.location || filters.type) && (
              <button
                onClick={() => { setSearchQuery(""); setFilters({ location: "", type: "", status: "active" }); }}
                className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                title="Clear Filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {isLoading ? "Looking for jobs..." : `${filteredJobs.length} Positions Found`}
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl border border-gray-100 shadow-sm" />
          ))
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase">No jobs found</h3>
            <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => { setSearchQuery(""); setFilters({ location: "", type: "", status: "active" }); }}
              className="mt-6 text-emerald-600 font-black hover:underline uppercase text-sm tracking-widest"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/candidate/jobs/${job.id}`}
              className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-100 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <Building2 className="text-gray-400 group-hover:text-emerald-600" size={28} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border",
                    job.status === "active" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-gray-50 border-gray-100 text-gray-500"
                  )}>
                    {job.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight mb-2 line-clamp-2 uppercase tracking-tighter">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Global Innovators Inc.</p>
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 font-black mb-8">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                  <MapPin size={14} className="text-emerald-500" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                  <Briefcase size={14} className="text-emerald-500" />
                  Full-time
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {formatDate(job.created_at)}
                </span>
                <div className="text-emerald-600 font-black text-xs flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-widest">
                  Apply Now <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateHomePage;
