import { useEffect, useState } from "react";
import './Curated-Cards.css';

interface Job {
  title: string;
  company: string;
  salary: string;
  employment_type: string;
  location: string;
  apply_link: string;
  description?: string;
  requirements?: string;
}

const CuratedCards = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLocationAndJobs = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to get location");
        const data = await res.json();
        const city = data.city || "Manchester";

        const jobRes = await fetch(`${apiUrl}/api/jobs?query=no experience jobs in ${encodeURIComponent(city)}`);
        if (!jobRes.ok) throw new Error("Failed to fetch jobs");
        const jobData = await jobRes.json();

        setJobs(jobData.data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndJobs();
  }, []);

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowModal(false);
  };

  return (
    <div className="curated-cards-container">
      <h2 className="curated-cards-title">Check Out These Recent Jobs!</h2>
      <div className="curated-cards-scroll">
        {loading && <div className="curated-card fetching">Fetching Jobs...</div>}
        {error && <div className="curated-card error">Error: {error}</div>}
        {!loading && !error && jobs.length === 0 && (
          <div className="curated-card no-jobs">No jobs found.</div>
        )}
        {!loading && !error && jobs.map((job, idx) => (
          <div
            className="curated-card hoverable flex flex-col"
            key={idx}
            onClick={() => openModal(job)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{job.title}</strong> <em>at {job.company}</em>
            <small>{job.location} | {job.employment_type}</small>
            <em>Salary: {job.salary}</em>
            <span className="text-emerald-600 underline ml-auto">View Details</span>
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

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedJob.title}</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Company:</span> {selectedJob.company}
            </p>
            <p className="text-gray-600 mb-4">
              {selectedJob.location} | {selectedJob.employment_type}
            </p>

            {selectedJob.description && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Description:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
            )}

            {selectedJob.requirements && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Requirements:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
              </div>
            )}

            <p className="text-gray-700 mb-2"><strong>Salary:</strong> {selectedJob.salary}</p>

            <a
              href={selectedJob.apply_link}
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
};

export default CuratedCards;
