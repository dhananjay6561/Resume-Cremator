'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PdfUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  error?: string;
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function PdfUpload({ file, onFileSelect, error }: PdfUploadProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFileSelect(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div className="w-full space-y-2">
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragActive
            ? '#0077b5'
            : error
            ? 'rgba(255,59,48,0.4)'
            : file
            ? 'rgba(34,197,94,0.4)'
            : 'rgba(255,255,255,0.1)',
          backgroundColor: isDragActive
            ? 'rgba(0,119,181,0.08)'
            : error
            ? 'rgba(255,59,48,0.05)'
            : file
            ? 'rgba(34,197,94,0.05)'
            : 'var(--navy-800)',
          scale: isDragActive ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        whileHover={{ borderColor: '#0077b5' }}
        className="relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-2xl border-2 border-dashed transition-colors duration-200 cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 15 11 17 15 13" />
                </svg>
              </div>
              <div>
                <p className="font-heading font-semibold text-[#F8FAFC] text-sm truncate max-w-[260px]">{file.name}</p>
                <p className="text-xs text-[#22C55E] mt-1 font-medium">{formatSize(file.size)} · Ready to analyze</p>
              </div>
              <p className="text-xs text-[#475569]">Click or drag to replace</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 px-6 text-center"
            >
              <motion.div
                animate={{ y: isDragActive ? [-4, 0, -4] : 0 }}
                transition={{ duration: 1.2, repeat: isDragActive ? Infinity : 0, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-[#334155]/60 border border-[#334155] flex items-center justify-center"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </motion.div>
              <div>
                <p className="font-heading font-semibold text-[#F8FAFC] text-sm">
                  {isDragActive ? 'Drop it here' : 'Click to browse or drag PDF here'}
                </p>
                <p className="text-xs text-[#475569] mt-1">PDF only &mdash; max 5 MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-[#E5451F] font-medium flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
