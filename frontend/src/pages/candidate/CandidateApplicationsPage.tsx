import React, { useState, useEffect } from "react";
import { ClipboardList, Briefcase, Calendar, ChevronRight, FileText, CheckCircle2, Clock, XCircle, Trash2, Ban } from "lucide-react";
import { applicationApi } from "../../services/applicationApi";
import { Application } from "../../types/application";
import { formatDate, cn, getMatchScoreColor } from "../../utils";
import { Link } from "react-router-dom";

const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this application?")) return;

    try {
      // In a real app, we'd call the API. Here we update mock state
      setApplications(prev => prev.map(app =>
        app.id === id ? { ...app, status: "withdrawn" } : app
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "interviewing": return "bg-blue-100 text-blue-700";
      case "viewed": return "bg-purple-100 text-purple-700";
      case "withdrawn": return "bg-gray-100 text-gray-500";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return <CheckCircle2 size={12} />;
      case "rejected": return <XCircle size={12} />;
      case "withdrawn": return <Ban size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">My Applications</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
            Track your journey and application status in real-time
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-dashed border-gray-200 text-center space-y-6">
          <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
            <ClipboardList size={48} />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-gray-900">No applications yet</h3>
            <p className="text-gray-500 mt-2 font-medium">
              Start applying to jobs to see your application history and AI match results here.
            </p>
          </div>
          <Link
            to="/candidate/jobs"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Browse Jobs <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="overflow-x-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">CV Upload</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied At</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Result</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Cancel Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app, index) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <Link to={`/candidate/jobs/${app.job_id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors block leading-tight mb-1">
                            {app.job?.title || "Unknown Job Role"}
                          </Link>
                          <p className="text-xs text-gray-500 font-bold">Global Tech Solutions</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-blue-400" />
                        {app.cv?.file_name || app.cv_title || "Standard CV"}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <Calendar size={14} />
                        {formatDate(app.applied_at)}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {app.match_result ? (
                        <div className="relative group/tooltip inline-block">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border cursor-help shadow-sm transition-all hover:scale-105",
                            getMatchScoreColor(app.match_result.score)
                          )}>
                            {app.match_result.score}%
                          </div>

                          {/* Tooltip Content */}
                          <div className={cn(
                            "absolute left-full ml-3 w-80 p-5 bg-white text-gray-900 border border-gray-100 rounded-3xl opacity-0 translate-x-2 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 group-hover/tooltip:visible transition-all duration-300 z-[100] shadow-2xl pointer-events-none",
                            index === 0 ? "top-0 translate-y-0" : "top-1/2 -translate-y-1/2"
                          )}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Match Details</span>
                                <span className={cn("text-xs font-black", getMatchScoreColor(app.match_result.score).split(' ')[1])}>{app.match_result.score}%</span>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Strengths</h4>
                                  <div className="space-y-1">
                                    {app.match_result.strengths.slice(0, 2).map((s, i) => (
                                      <p key={i} className="text-[10px] font-bold text-gray-600 leading-tight flex gap-1.5">
                                        <span className="text-emerald-500">•</span> {s}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Weaknesses</h4>
                                  <div className="space-y-1">
                                    {app.match_result.weaknesses.slice(0, 2).map((w, i) => (
                                      <p key={i} className="text-[10px] font-bold text-gray-600 leading-tight flex gap-1.5">
                                        <span className="text-orange-500">•</span> {w}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                  <p className="text-[10px] text-gray-500 italic leading-relaxed">
                                    "{app.match_result.explanation}"
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className={cn(
                              "absolute right-full border-[6px] border-transparent border-r-white drop-shadow-[-1px_0_0_rgba(0,0,0,0.05)]",
                              index === 0 ? "top-4" : "top-1/2 -translate-y-1/2"
                            )} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 tracking-widest">NO SCORE</span>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        getStatusStyle(app.status)
                      )}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {app.status === "withdrawn" ? (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 inline-block">
                          Withdrawn
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCancelApplication(app.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 group/cancel"
                        >
                          <Trash2 size={12} className="group-hover/cancel:rotate-12 transition-transform" />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateApplicationsPage;
