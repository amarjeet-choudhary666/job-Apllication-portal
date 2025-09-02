import React from 'react';
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

  const handleApply = async () => {
    if (onApply) {
      onApply(job._id);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
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
      <p className="text-sm text-gray-500 mb-4">
        Posted by: {job.employer.name}
      </p>
      {showApplyButton && isDeveloper && (
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;
