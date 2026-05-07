import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, Loader2, User, FileText, XCircle, MoreHorizontal, Filter, TrendingUp, Trophy, Search, Users, Target } from "lucide-react";
import { jobApi } from "../../services/jobApi";
import { applicationApi } from "../../services/applicationApi";
import { Job } from "../../types/job";
import { Application, ApplicationStatus } from "../../types/application";
import { formatDate, cn } from "../../utils";

const RecruiterJobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"applications" | "details">("applications");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!jobId) return;
      try {
        const [jobData, appData] = await Promise.all([
          jobApi.getJob(jobId),
          applicationApi.getJobApplications(jobId),
        ]);
        setJob(jobData);
        setApplications(appData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [jobId]);

  const handleUpdateStatus = async (appId: string, status: ApplicationStatus) => {
    setIsUpdating(appId);
    try {
      const updated = await applicationApi.updateStatus(appId, status);
      setApplications(applications.map(a => a.id === appId ? updated : a));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Accessing Command Center...</p>
      </div>
    );
  }

  if (!job) return <div>Job not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 font-bold hover:text-blue-600 transition-colors uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft size={14} /> Back to dashboard
          </button>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-tight">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className={cn(
                "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                job.status === "active" ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-100 text-gray-500 border border-gray-200"
              )}>
                {job.status}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <MapPin size={14} /> {job.location} • <Calendar size={14} /> {formatDate(job.created_at)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            Edit Listing
          </button>
          <button className="px-6 py-3 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg">
            Promote Post
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
        {[
          { label: "Applications", id: "applications", count: applications.length },
          { label: "Job Details", id: "details" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.label} {tab.count !== undefined && <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">{tab.count}</span>}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search candidate name or skill..."
                    className="w-full pl-12 pr-4 py-2 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm text-gray-900"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
                    <Filter size={18} />
                  </button>
                  <button className="p-2.5 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
                    <TrendingUp size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                  <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="text-xl font-bold text-gray-900">No applications yet</h4>
                    <p className="text-gray-500 mt-1">Candidates have not applied to this position yet.</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between group"
                    >
                      <div className="flex-1 flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 relative group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <User size={32} />
                          {app.match_result && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ring-2 ring-yellow-400 ring-offset-2 animate-pulse">
                              {app.match_result.score}%
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{app.candidate_name}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14} /> Applied {formatDate(app.applied_at)}</span>
                            <span className="flex items-center gap-1"><FileText size={14} /> {app.cv_title}</span>
                          </div>
                          {app.match_result && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {app.match_result.matched_skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100">{skill}</span>
                              ))}
                              {app.match_result.matched_skills.length > 3 && <span className="text-[10px] font-bold text-gray-400 mt-0.5">+{app.match_result.matched_skills.length - 3}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-8">
                        <div className="text-center min-w-[100px]">
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            app.status === "accepted" ? "bg-green-100 text-green-700" :
                            app.status === "rejected" ? "bg-red-100 text-red-700" :
                            app.status === "interviewing" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          )}>
                            {app.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                           <button
                             onClick={() => handleUpdateStatus(app.id, "rejected")}
                             disabled={isUpdating === app.id}
                             className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                           >
                             {isUpdating === app.id ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
                           </button>
                           <button
                             onClick={() => handleUpdateStatus(app.id, "interviewing")}
                             disabled={isUpdating === app.id}
                             className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                           >
                             {isUpdating === app.id ? <Loader2 className="animate-spin" size={16} /> : "Interview"}
                           </button>
                           <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors">
                             <MoreHorizontal size={20} />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-10">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Description</h4>
                <p className="text-gray-700 leading-relaxed font-medium bg-gray-50 p-8 rounded-3xl border border-gray-100">{job.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                 <div>
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Target className="text-blue-500" size={16} /> Responsibilities
                   </h4>
                   {(!job.responsibilities || job.responsibilities.trim() === "") ? (
                     <p className="text-sm text-gray-500 italic">No responsibilities provided</p>
                   ) : (
                     <ul className="space-y-4">
                       {job.responsibilities.split(/[;\n]/).filter(r => r.trim()).map((req, i) => (
                         <li key={i} className="flex gap-4 font-bold text-gray-900 text-sm">
                           <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                           {req.trim()}
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>

                 <div>
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Target className="text-blue-500" size={16} /> Key Requirements
                   </h4>
                   {(!job.requirements || job.requirements.trim() === "") ? (
                     <p className="text-sm text-gray-500 italic">No requirements provided</p>
                   ) : (
                     <ul className="space-y-4">
                       {job.requirements.split(/[;\n]/).filter(r => r.trim()).map((req, i) => (
                         <li key={i} className="flex gap-4 font-bold text-gray-900 text-sm">
                           <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                           {req.trim()}
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>

                 <div>
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Target className="text-purple-500" size={16} /> Nice to Have
                   </h4>
                   {(!job.nice_to_have || job.nice_to_have.trim() === "") ? (
                     <p className="text-sm text-gray-500 italic">No nice-to-have skills provided</p>
                   ) : (
                     <ul className="space-y-4">
                       {job.nice_to_have.split(/[;\n]/).filter(r => r.trim()).map((req, i) => (
                         <li key={i} className="flex gap-4 font-bold text-gray-900 text-sm">
                           <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                           {req.trim()}
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>

                 <div>
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <Trophy className="text-green-500" size={16} /> Benefits & Perks
                   </h4>
                   {(!job.benefits || job.benefits.trim() === "") ? (
                     <p className="text-sm text-gray-500 italic">No benefits provided</p>
                   ) : (
                     <ul className="space-y-4">
                       {job.benefits.split(/[;\n]/).filter(b => b.trim()).map((ben, i) => (
                         <li key={i} className="flex gap-4 font-bold text-gray-900 text-sm">
                           <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                           {ben.trim()}
                         </li>
                       ))}
                     </ul>
                   )}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobDetailPage;
