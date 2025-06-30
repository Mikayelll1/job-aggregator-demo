import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatProps = {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
};

const TypingDots = () => {
  const [dotCount, setDotCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((count) => (count + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return <span>{'.'.repeat(dotCount)}</span>;
};

export default function Chat({ pdfFile, setPdfFile }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        user_input: input,
      });
      const reply = response.data.response;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Error communicating with backend.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Send PDF file to backend for analysis
  const sendPdf = async () => {
    if (!pdfFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post('http://localhost:8000/analyze-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { role: 'assistant', content: 'Failed to analyze PDF.' },
      ]);
    } finally {
      setLoading(false);
      setPdfFile(null); // Clear PDF after analysis
    }
  };

  return (
    <div
      className="flex flex-col w-full mx-auto h-full bg-[#ffffff] rounded-lg shadow-lg p-4"
    >
      {/* Messages container */}
      <div
        className="flex flex-col flex-grow overflow-y-auto space-y-3 px-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.slice(1).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              maxWidth: '70%',
              padding: '8px 16px',
              borderRadius: 12,
              wordBreak: 'break-word',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor:
                msg.role === 'user' ? '#37b' : 'rgba(72, 79, 90, 0.8)',
              color: msg.role === 'user' ? '#eee' : '#eee',
            }}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600"
          >
            AI is responding<TypingDots />
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Hidden PDF file input */}
      <input
        type="file"
        accept="application/pdf"
        id="pdf-upload"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
          }
        }}
        disabled={loading}
      />

      {/* Input & buttons */}
      <div className="mt-4 flex space-x-3 items-center justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
               sendMessage();
              }
          }}
          placeholder="Ask a question or type a message..."
          disabled={loading}
          style={{
            maxWidth: '39.1%',
            flex: 1,
            borderRadius: 8,
            border: '1px solid #eee',
            backgroundColor: 'rgba(172, 172, 172, 0.35)',
            color: '#000',
            padding: '8px 12px',
            outline: 'none',
            resize: 'vertical',
            overflowY: 'auto',
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #eee',
            backgroundColor: 'rgba(0, 99, 192, 0.75)',
            color: '#eee',
            fontWeight: '600',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
            userSelect: 'none',
          }}
        >
          Send
        </button>

        <button
          onClick={sendPdf}
          disabled={loading || !pdfFile}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #eee',
            backgroundColor: 'rgba(0, 99, 192, 0.75)',
            color: '#eee',
            fontWeight: '600',
            cursor: loading || !pdfFile ? 'not-allowed' : 'pointer',
            opacity: loading || !pdfFile ? 0.5 : 1,
            userSelect: 'none',
          }}
          title={!pdfFile ? 'Upload a PDF to analyze' : 'Analyze Resume'}
        >
          Analyze Resume
        </button>
      </div>
    </div>
  );
}