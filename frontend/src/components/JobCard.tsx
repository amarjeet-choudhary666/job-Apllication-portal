import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface Job {
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
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, showApplyButton = true }) => {
  const { isDeveloper } = useAuth();

  const handleApply = () => {
    if (onApply) {
      onApply(job._id);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{job.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, index) => (
          <motion.span
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-green-600">${job.salary.toLocaleString()}</span>
        <span className="text-gray-500 text-sm">{job.location}</span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Posted by: <span className="text-gray-700 font-medium">{job.employer.name}</span>
      </p>

      {showApplyButton && isDeveloper && (
        <motion.button
          onClick={handleApply}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded hover:opacity-90 w-full font-semibold"
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Apply Now
        </motion.button>
      )}
    </motion.div>
  );
};

export default JobCard;
