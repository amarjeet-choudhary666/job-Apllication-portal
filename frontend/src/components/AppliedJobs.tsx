import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';

interface AppliedJob {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  salary: number;
  location: string;
  employer: {
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

const AppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const response = await jobAPI.getAppliedJobs();
      setAppliedJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your applications...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Applied Jobs</h1>

      {appliedJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((job) => (
            <div key={job._id} className="border rounded-lg p-4 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">${job.salary}</span>
                <span className="text-gray-500">{job.location}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Posted by: {job.employer.name}
              </p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(job.status)}`}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  Applied: {new Date(job.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
