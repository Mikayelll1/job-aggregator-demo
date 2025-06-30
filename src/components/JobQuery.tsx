import {  useState } from "react";
import axios from "axios";

type JobListing = {
  job_title: string;
  employer_name: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_description?: string;
  job_requirements?: string;
  job_apply_link?: string;
  job_offer_link?: string;
};

export default function JobSearch() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (job: JobListing) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowModal(false);
  };

  const fetchJobs = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const params: any = { query };

      if (location) params.location = location;
      if (country) params.country = country;
      if (employmentType) params.employment_type = employmentType;

      const response = await axios.get(`${apiUrl}/api/search`, {
        params
      });

      setJobs(response.data.data || []);
    } catch (err) {
      setError("Failed to find jobs. Check the spelling and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchSubmitted(true);
    fetchJobs();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-gray-800 mb-4">Search for Jobs</div>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Job title (e.g., Software Engineer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-600 text-black"
        />
        <input
          type="text"
          placeholder="City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-600 text-black"
        />
        <input
          type="text"
          placeholder="Country (e.g., GB, US)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-600 text-black"
        />
        <input
          type="text"
          placeholder="Employment Type (e.g., Full-time)"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-600 text-black"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && jobs.length === 0 && searchSubmitted && (
        <p className="text-gray-600">No jobs found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <div 
          key={index}
          onClick={() => openModal(job)}
          className="border p-4 rounded-xl bg-gray-50 transition duration-300 hover:ring-2 hover:ring-emerald-400 hover:shadow-lg hover:shadow-emerald-300/40 cursor-pointer">
          
            <h2 className="text-xl font-semibold text-gray-700">{job.job_title}</h2>
            <p className="text-gray-600">{job.employer_name}</p>
            <p className="text-gray-500 text-sm">
              {job.job_city}, {job.job_state}, {job.job_country}
            </p>
            <a
              href={job.job_apply_link || job.job_offer_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline text-sm"
            >
              Job Link Here
            </a>
          </div>
        ))}
      </div>
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[800px] max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl relative p-8 pt-16">
            <button
            onClick={closeModal}
            className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedJob.job_title}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Employer:</span> {selectedJob.employer_name}
            </p>
            <p className="text-gray-600 mb-4">
              {selectedJob.job_city}, {selectedJob.job_state}, {selectedJob.job_country}
            </p>
            
            {selectedJob.job_description && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Description:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJob.job_description}
                </p>
              </div>
            )}
            
            {selectedJob.job_requirements && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Requirements:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedJob.job_requirements}
                </p>
              </div>
            )}
            
            <a
              href={selectedJob.job_apply_link || selectedJob.job_offer_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Apply Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
