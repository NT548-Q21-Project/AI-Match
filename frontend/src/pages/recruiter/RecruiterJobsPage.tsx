import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, MapPin, Calendar, ChevronRight, Lock, Unlock } from "lucide-react";
import { jobApi } from "../../services/jobApi";
import { Job } from "../../types/job";
import { formatDate, cn } from "../../utils";

const formatJobType = (jobType?: string) => {
  switch (jobType) {
    case "full_time":
    case "full-time":
      return "Full-time";
    case "part_time":
      return "Part-time";
    case "internship":
      return "Internship";
    case "contract":
      return "Contract";
    default:
      return "Unknown";
  }
};

const RecruiterJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const data = await jobApi.getMyJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      const updated = await jobApi.updateJob(jobId, { status: newStatus as any });
      setJobs(jobs.map(j => j.id === jobId ? updated : j));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Job Posts</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Manage your active job listings and review applications
          </p>
        </div>
        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} />
          Post New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-dashed border-gray-200 text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
            <Briefcase size={48} />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-gray-900">No job posts yet</h3>
            <p className="text-gray-500 mt-2 font-medium">
              Ready to find new talent? Create your first job post to start receiving AI-matched applications.
            </p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Create Your First Job <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-6 md:items-center justify-between"
            >
              <div className="flex-1 flex gap-5">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-colors",
                  job.status === "active" ? "bg-green-50 border-green-100 text-green-600" : "bg-gray-50 border-gray-100 text-gray-400"
                )}>
                  {job.status === "active" ? <Unlock size={28} /> : <Lock size={28} />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 leading-tight mb-2 tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> Created {formatDate(job.created_at)}</div>
                    <div className="flex items-center gap-1.5"><Briefcase size={14} /> {formatJobType(job.job_type)}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex flex-col items-center px-6 border-x border-gray-50">
                  <span className="text-2xl font-black text-gray-900">{job.applications_count || 0}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/recruiter/jobs/${job.id}`}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className={cn(
                      "p-2 rounded-xl border transition-all",
                      job.status === "active" ? "hover:bg-red-50 text-red-600 border-red-50" : "hover:bg-green-50 text-green-600 border-green-50"
                    )}
                  >
                    {job.status === "active" ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;
