import React, { useState, useEffect } from "react";
import { jobAPI } from "../services/api";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { X, Mail, Phone, User, Calendar } from 'lucide-react';

// Helper function to safely format dates
const formatDateSafely = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) 
      ? formatDistanceToNow(date, { addSuffix: true })
      : 'recently';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'recently';
  }
};

interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  salary: number;
  location: string;
  type?: string;
  experience?: string;
  createdAt: string;
}

interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  appliedAt: string;
  status?: string;
}

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter jobs based on search term
  useEffect(() => {
    const filtered = jobs.filter(job => {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        job.location.toLowerCase().includes(searchLower)
      );
    });
    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getMyJobs();
      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewApplicants = async (job: Job) => {
    setSelectedJob(job);
    try {
      const response = await jobAPI.getApplicants(job._id);
      setApplicants(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      setDeletingId(jobId);
      try {
        await jobAPI.deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
          setApplicants([]);
        }
      } catch (error) {
        console.error("Failed to delete job:", error);
        alert("Failed to delete job. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            My Job Postings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your job listings and view applications
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mt-8 mb-8 max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className={`h-5 w-5 transition-colors duration-300 ${searchTerm ? 'text-indigo-600' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              className={`block w-full pl-12 pr-10 py-3 text-gray-700 bg-white/90 backdrop-blur-sm border-2 ${
                searchTerm 
                  ? 'border-indigo-400 shadow-lg' 
                  : 'border-gray-200 hover:border-indigo-300'
              } rounded-xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm`}
              placeholder="Search jobs by title, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search jobs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center group/clear"
                aria-label="Clear search"
              >
                <div className="p-1 rounded-full bg-gray-100 group-hover/clear:bg-gray-200 transition-colors duration-200">
                  <svg 
                    className="h-4 w-4 text-gray-500 group-hover/clear:text-gray-700 transition-colors duration-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </div>
              </button>
            )}
            <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${
              searchTerm ? 'w-full' : 'w-0'
            }`}></div>
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-500 text-right animate-fade-in">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          )}
        </div>

        {/* View Applicants Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Applicants for {selectedJob.title}
                  </h2>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {applicants.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No applicants yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Check back later or share this job to get more applicants.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <div key={applicant._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              <User className="mr-2 h-5 w-5 text-indigo-600" />
                              {applicant.name}
                            </h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                {applicant.email}
                              </p>
                              {applicant.phone && (
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                  {applicant.phone}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                Applied {formatDateSafely(applicant.appliedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {applicant.coverLetter && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {applicant.coverLetter}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex space-x-2">
                          <a
                            href={`mailto:${applicant.email}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Mail className="-ml-0.5 mr-1.5 h-4 w-4" />
                            Email
                          </a>
                          {applicant.phone && (
                            <a
                              href={`tel:${applicant.phone}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Phone className="-ml-0.5 mr-1.5 h-4 w-4" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No job postings
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating a new job posting.
            </p>
            <div className="mt-6">
              <a
                href="/post-job"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow"
              >
                + New Job Posting
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-white/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        📍 {job.location}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {job.type || "Full-time"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {job.experience || "Mid-level"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${job.salary.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">/year</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50"
                      >
                        👥 View Applicants
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={deletingId === job._id}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === job._id ? "Deleting..." : "🗑 Delete"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    ⏱ Posted{" "}
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicants Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Applicants for {selectedJob.title}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {applicants.length === 0 ? (
              <p className="text-center text-gray-500 py-6">
                No applicants yet.
              </p>
            ) : (
              <div className="space-y-4">
                {applicants.map((a) => (
                  <div
                    key={a._id}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{a.name}</h4>
                        <p className="text-sm text-gray-500">{a.email}</p>
                        {a.phone && (
                          <p className="text-sm text-gray-500">{a.phone}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        Applied{" "}
                        {formatDateSafely(a.appliedAt)}
                      </span>
                    </div>
                    {a.coverLetter && (
                      <p className="mt-2 text-sm text-gray-600">
                        {a.coverLetter}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`mailto:${a.email}`}
                        className="px-3 py-1.5 text-xs rounded-lg border bg-white hover:bg-gray-50"
                      >
                        📧 Email
                      </a>
                      {a.phone && (
                        <a
                          href={`tel:${a.phone}`}
                          className="px-3 py-1.5 text-xs rounded-lg border bg-white hover:bg-gray-50"
                        >
                          📞 Call
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
