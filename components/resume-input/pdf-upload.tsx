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
            ? 'var(--steel)'
            : error
            ? 'var(--red)'
            : file
            ? 'var(--green)'
            : 'var(--border-medium)',
          backgroundColor: isDragActive
            ? 'var(--steel-light)'
            : error
            ? 'var(--red-light)'
            : file
            ? 'var(--green-light)'
            : 'var(--bg-card)',
        }}
        transition={{ duration: 0.18 }}
        className="relative flex flex-col items-center justify-center w-full min-h-[260px] rounded-xl border-2 border-dashed cursor-pointer"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-3 px-6 text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--green-light)', border: '1px solid rgba(21,128,61,0.2)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 15 11 17 15 13" />
                </svg>
              </div>
              <div className="min-w-0 w-full">
                <p className="font-heading font-semibold text-sm break-words" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--green)' }}>{formatSize(file.size)} &middot; Ready to analyze</p>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click or drag to replace</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 px-6 text-center"
            >
              <motion.div
                animate={{ y: isDragActive ? [-3, 0, -3] : 0 }}
                transition={{ duration: 1.2, repeat: isDragActive ? Infinity : 0, ease: "easeInOut" }}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: '#F0F0F0', border: '1px solid var(--border-medium)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </motion.div>
              <div>
                <p className="font-heading font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {isDragActive ? 'Drop it here' : 'Click to browse or drag PDF here'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>PDF only &mdash; max 5 MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm font-medium flex items-center gap-1.5"
            style={{ color: 'var(--red)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
