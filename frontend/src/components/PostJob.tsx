import React, { useState } from 'react';
import { jobAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    salary: '',
    location: '',
    type: 'Full-time',
    experience: 'Mid-level'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      const jobData = {
        ...formData,
        skills: skillsArray,
        salary: Number(formData.salary),
      };

      await jobAPI.postJob(jobData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        skills: '',
        salary: '',
        location: '',
        type: 'Full-time',
        experience: 'Mid-level'
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to post job. Please try again.';
      setError(errorMessage || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full relative">
        {/* Floating gradient blob */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        {/* Card */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-10 transform transition-all hover:scale-[1.01] hover:shadow-3xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-lg">
              ✨ Post a New Job
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Fill in the details below and let top talent find you 🚀
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-100/80 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-sm animate-fade-in">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-100/80 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-sm animate-fade-in">
              ✅ Job posted successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                />
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Temporary</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                >
                  <option>Intern</option>
                  <option>Entry-level</option>
                  <option>Mid-level</option>
                  <option>Senior</option>
                  <option>Lead</option>
                  <option>Manager</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">Salary (USD)</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="85000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                />
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white/80"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe the role, responsibilities, and perks..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white/80"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                ⬅ Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-md transition-all transform hover:scale-[1.03] ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Posting...' : '✨ Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
