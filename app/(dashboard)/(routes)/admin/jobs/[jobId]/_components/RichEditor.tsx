'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';

interface RichEditorProps {
    onChange: (value: string) => void;

  value: string;
}

export const RichEditor = ({  onChange ,value }: RichEditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <div className="bg-white">
      <ReactQuill value={value} onChange={onChange}  theme="snow" />
    </div>
  );
};