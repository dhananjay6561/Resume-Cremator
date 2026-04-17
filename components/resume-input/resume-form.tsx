'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { InputToggle } from './input-toggle';
import { TextInput } from './text-input';
import { PdfUpload } from './pdf-upload';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useAnalysis } from '@/hooks/useAnalysis';

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', delay: 0.3 },
  },
};

export function ResumeForm() {
  const [inputType, setInputType] = React.useState<'text' | 'pdf'>('text');
  const [textValue, setTextValue] = React.useState('');
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [localError, setLocalError] = React.useState<string | null>(null);

  const { analyzeText, analyzePdf, isAnalyzing, error, setError } = useAnalysis();

  const handleSubmit = async () => {
    setLocalError(null);
    setError(null);

    if (inputType === 'text') {
      if (textValue.trim().length < 200) {
        setLocalError('Please paste at least 200 characters of your resume.');
        return;
      }
      await analyzeText(textValue);
    } else {
      if (!pdfFile) {
        setLocalError('Please upload a PDF file first.');
        return;
      }
      await analyzePdf(pdfFile);
    }
  };

  const displayError = localError || error;

  return (
    <>
      {isAnalyzing && <LoadingOverlay />}
      <motion.section
        className="flex-1 flex flex-col items-center w-full"
        variants={formVariants}
        initial="hidden"
        animate="show"
      >
        <InputToggle value={inputType} onChange={setInputType} />

        <div className="w-full mb-5">
          {inputType === 'text' ? (
            <TextInput
              value={textValue}
              onChange={setTextValue}
              error={displayError || undefined}
            />
          ) : (
            <PdfUpload
              file={pdfFile}
              onFileSelect={setPdfFile}
              error={displayError || undefined}
            />
          )}
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={isAnalyzing}
          whileHover={{ scale: isAnalyzing ? 1 : 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full font-heading text-sm font-semibold py-3 px-4 sm:px-6 rounded-lg text-white transition-colors duration-150 cursor-pointer disabled:opacity-60"
          style={{ background: isAnalyzing ? '#5BA3D9' : 'var(--steel)' }}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze My Resume'
          )}
        </motion.button>

        <motion.p
          className="mt-3 text-xs text-center"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Results are private. Nothing is stored.
        </motion.p>
      </motion.section>
    </>
  );
}
