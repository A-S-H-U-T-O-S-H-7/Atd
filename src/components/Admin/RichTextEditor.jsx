"use client";
import { useThemeStore } from "@/lib/store/useThemeStore";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false
});

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Write your content here...",
  minHeight = "250px",
  showLabel = true,
  error = null,
  required = false
}) {
  const { theme } = useThemeStore();

  return (
    <div>
      {showLabel &&
        <label
          className={`block text-sm font-medium mb-2 ${theme=== "dark"
            ? "text-gray-300"
            : "text-gray-700"}`}
        >
          {label} {required && "*"}
        </label>}
      <div
        className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${theme=== "dark"
          ? "border-emerald-600/50 hover:border-emerald-500"
          : "border-emerald-300 hover:border-emerald-400"} ${error
            ? "border-red-500"
            : ""}`}
      >
        <SunEditor
          onChange={onChange}
          setContents={value}
          defaultValue={value || ""}
          setOptions={{
            iframe: false,
            fullScreen: false,
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              ["fontSize", "list", "align"],
              ["link", "image", "video"],
              ["removeFormat"]
            ],
            minHeight: minHeight,
            height: "auto",
            placeholder: placeholder,
            width: "100%",
            buttonStyle: "soft",
            toolbarStickyTop: 0,
            attributesWhitelist: { all: "style" },
            fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 36],
            colorList: [
              theme=== "dark" ? "#10b981" : "#059669",
              theme=== "dark" ? "#14b8a6" : "#0d9488",
              "#000000",
              "#666666",
              "#888ea8",
              "#ffffff"
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
            katex: false
          }}
          setDefaultStyle={`
            background-color: ${theme=== "dark" ? "#1f2937" : "#ffffff"};
            border-radius: 0.75rem;
            min-height: ${minHeight};
            padding: 1rem;
            color: ${theme=== "dark" ? "#f3f4f6" : "#111827"};
            border: none;
          `}
        />
      </div>
      {error &&
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>}
    </div>
  );
}
