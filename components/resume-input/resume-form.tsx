'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { InputToggle } from './input-toggle';
import { TextInput } from './text-input';
import { PdfUpload } from './pdf-upload';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useAnalysis } from '@/hooks/useAnalysis';

const formVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.4 },
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

        <div className="w-full mb-6">
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

        <motion.div
          className="w-full flex justify-center"
          whileHover={{ scale: isAnalyzing ? 1 : 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="w-full md:w-[320px] font-heading text-base font-bold tracking-wide py-3 px-6 rounded-xl text-white transition-all duration-200 cursor-pointer disabled:opacity-60"
            style={{ background: isAnalyzing ? 'var(--steel-dim)' : 'var(--steel)' }}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Cremate My Resume →
              </span>
            )}
          </button>
        </motion.div>

        <motion.p
          className="mt-4 text-xs text-[#334155] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Results are private. Nothing is stored.
        </motion.p>
      </motion.section>
    </>
  );
}
