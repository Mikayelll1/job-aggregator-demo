import React, { useCallback, useMemo, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type PdfViewerProps = {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFile, setPdfFile }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Memoize the URL for the pdfFile to prevent constant re-creation
  const fileUrl = useMemo(() => {
    if (pdfFile) {
      return URL.createObjectURL(pdfFile);
    }
    return null;
  }, [pdfFile]);

  // Clean up the object URL when pdfFile changes or component unmounts
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length === 0) return;

      const file = files[0];
      if (file.type !== 'application/pdf') {
        alert('Please drop a PDF file');
        return;
      }

      setPdfFile(file);
    },
    [setPdfFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleClearPdf = () => {
    setPdfFile(null);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col h-full relative select-none border border-gray-300 rounded p-4"
    >
      <h1 className="text-center mb-4 text-lg font-semibold">
        PDF Viewer (Drag & Drop PDF here)
      </h1>

      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={handleClearPdf}
          disabled={!pdfFile}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Clear PDF
        </button>
      </div>

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        {fileUrl ? (
          <div className="flex-1 min-h-0 border h-[600px]">
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center text-gray-500 italic p-10 text-center border h-[600px]">
            Drop a PDF file here to view
          </div>
        )}
      </Worker>
    </div>
  );
};

export default PdfViewer;