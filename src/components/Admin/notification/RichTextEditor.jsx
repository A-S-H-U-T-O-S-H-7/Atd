'use client';
import { useAdminAuth } from "@/lib/AdminAuthContext";
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export default function RichTextEditor({ value, onChange }) {
  const { isDark } = useAdminAuth();

  return (
    <div>
      <label 
        className={`block text-sm font-bold mb-3 ${
          isDark ? "text-gray-100" : "text-gray-700"
        }`}
      >
        Message Content
      </label>
      <div 
        className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
          isDark
            ? "border-emerald-600/50 hover:border-emerald-500"
            : "border-emerald-300 hover:border-emerald-400"
        }`}
      >
        <SunEditor
          onChange={onChange}
          setContents={value || ''}
          setOptions={{
            buttonList: [
              ['undo', 'redo'],
              ['bold', 'italic', 'underline', 'strike'],
              ['fontSize', 'list', 'align'],
              ['link', 'image', 'video'],
              ['removeFormat'],
            ],
            minHeight: '300px',
            height: 'auto',
            placeholder: 'Write your notification message...',
            width: '100%',
            buttonStyle: 'soft',
            toolbarStickyTop: 0,
            attributesWhitelist: {
              all: 'style',
            },
            fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 36],
            colorList: [
              isDark ? '#10b981' : '#059669',
              isDark ? '#14b8a6' : '#0d9488',
              '#000000',
              '#666666',
              '#888ea8',
              '#ffffff',
            ],
            linkTargetNewWindow: true,
            showPathLabel: false,
            resizingBar: false,
            defaultStyle: `
              font-family: inherit;
              font-size: 14px;
              background-color: transparent;
              color: inherit;
            `,
            katex: false,
          }}
          setDefaultStyle={`
            background-color: ${isDark ? '#1f2937' : '#ffffff'};
            border-radius: 0.75rem;
            min-height: 300px;
            padding: 1.5rem;
            color: ${isDark ? '#f3f4f6' : '#111827'};
            border: none;
          `}
        />
      </div>
    </div>
  );
}