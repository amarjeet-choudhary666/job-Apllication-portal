import React, { useState, useEffect, useCallback } from 'react';
import { jobAPI } from '../services/api';
import JobCard from './JobCard';

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
  status?: 'pending' | 'accepted' | 'rejected';
  appliedAt?: string;
  createdAt: string;
}

interface JobFilters {
  page: number;
  skills?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  search?: string;
  sortBy?: 'newest' | 'salary';
}

const JobList: React.FC<{ showAppliedOnly?: boolean }> = ({ showAppliedOnly = false }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');
  const [filters, setFilters] = useState({
    skills: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (showAppliedOnly) {
        // Fetch only applied jobs
        response = await jobAPI.getAppliedJobs();
        setJobs(response.data.data);
        setTotalPages(1); // No pagination for applied jobs
      } else {
        // Fetch all jobs with filters
        const params: JobFilters = { 
          page,
          sortBy: sortBy === 'salary' ? 'salary' : 'newest'
        };
        
        if (searchQuery) params.search = searchQuery;
        if (filters.skills) params.skills = filters.skills;
        if (filters.salaryMin) params.salaryMin = Number(filters.salaryMin);
        if (filters.salaryMax) params.salaryMax = Number(filters.salaryMax);
        if (filters.location) params.location = filters.location;

        response = await jobAPI.getJobs(params);
        setJobs(response.data.data.jobs);
        setTotalPages(response.data.data.pages);
      }
      
      if (response.data.data.length === 0) {
        setError(showAppliedOnly 
          ? 'You have not applied to any jobs yet.' 
          : 'No jobs found matching your criteria.'
        );
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [filters, page, searchQuery, sortBy, showAppliedOnly]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'newest' | 'salary');
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      skills: '',
      salaryMin: '',
      salaryMax: '',
      location: ''
    });
    setSearchQuery('');
    setPage(1);
    // Don't fetch here, let the user click search
  };

  const handleApply = async (jobId: string) => {
    try {
      await jobAPI.applyForJob(jobId, {});
      alert('Application submitted successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to apply for job';
      alert(errorMessage);
    }
  };

  if (loading && !isSearching) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <div className="mt-4 md:mt-0">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded p-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="salary">Highest Salary</option>
          </select>
        </div>
      </div>
      
      {!showAppliedOnly ? (
        <>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button 
                type="submit"
                className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g., React, Node, Python"
                  className="border p-2 rounded"
                  value={filters.skills}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Min Salary</label>
                <input
                  type="number"
                  name="salaryMin"
                  placeholder="Min"
                  className="border p-2 rounded"
                  value={filters.salaryMin}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Max Salary</label>
                <input
                  type="number"
                  name="salaryMax"
                  placeholder="Max"
                  className="border p-2 rounded"
                  value={filters.salaryMax}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Remote, New York"
                  className="border p-2 rounded"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Job Applications</h2>
          <p className="text-gray-600">View the status of your job applications</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="relative">
            <JobCard job={job} onApply={handleApply} />
            {showAppliedOnly && job.status && (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${job.status === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : job.status === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jobs found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default JobList;
