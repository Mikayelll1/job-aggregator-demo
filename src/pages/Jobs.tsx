import JobSearch from "../components/JobQuery"

export default function Jobs() {
  return (
    <div className="shadow-2xl min-h-[92vh] min-w-[97vw] bg-gray-100 flex flex-col items-center pt-8">
      <div className="w-full flex justify-center">
        <div className="text-4xl font-bold text-gray-600 mb-6">
          Let's help you find your role
        </div>
      </div>

      <JobSearch />
    </div>
  );
}
