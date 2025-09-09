import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import { motion } from 'framer-motion';

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
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          className="w-16 h-16 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-center text-gray-800 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Applied Jobs
      </motion.h1>

      {appliedJobs.length === 0 ? (
        <motion.div
          className="text-center py-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          You haven't applied to any jobs yet.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {appliedJobs.map((job, index) => (
            <motion.div
              key={job._id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 cursor-pointer"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-green-600">${job.salary.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">{job.location}</span>
              </div>

              <p className="text-gray-500 text-xs mb-4">
                Employer: <span className="font-medium text-gray-700">{job.employer.name}</span>
              </p>

              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                <span className="text-xs text-gray-400">
                  Applied: {new Date(job.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
