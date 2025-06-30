import { useState } from 'react';
import PdfViewer from '../components/PdfViewer';
import Chat from '../components/Chat';

const ResumeAnalyser = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <div className="shadow-2xl min-h-[92vh] min-w-[97vw] bg-gray-100 pt-10 px-8">
      <div className="text-4xl font-bold text-center text-gray-600 mb-8">
        Let's see where you can improve
      </div>

      <div className="flex flex-row justify-center items-start gap-24">
        {/* Chat panel */}
        <div
          className="
            flex flex-col
            w-[800px] h-[80vh]
            bg-[#ffffff] bg-opacity-95
            border border-green-500 rounded-xl
            shadow-lg
            overflow-hidden
            backdrop-blur-sm
          "
        >
          <Chat pdfFile={pdfFile} setPdfFile={setPdfFile} />
        </div>

        {/* PdfViewer panel */}
        <div
          className="
            flex flex-col
            w-[800px] h-[80vh]
            bg-white bg-opacity-90
            border border-green-300 rounded-xl
            shadow-lg
            overflow-hidden
            backdrop-blur-sm
          "
        >
          <PdfViewer pdfFile={pdfFile} setPdfFile={setPdfFile} />
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyser;
