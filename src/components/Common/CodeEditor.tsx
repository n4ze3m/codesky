import React, { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { vim } from "@replit/codemirror-vim";
import { FileImage, FileVideo, Terminal, X, Upload } from "lucide-react";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { Record } from "@atproto/api/src/client/types/app/bsky/feed/post";
import { lineNumbers } from "@codemirror/view";
import { CodePost } from "./CodePost";

interface CodeEditorProps {
  cid?: string | null;
  post?: Record | null;
  quotePost?: Record | null;
  embed?: any;
}

export function CodeEditor({ quotePost, post }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      EditorView.lineWrapping,
      oneDark,
      keymap.of(defaultKeymap),
      lineNumbers(),
      vim({
        status: true,
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const count = update.state.doc.length;
          setCharCount(count);
          if (count > 300) {
            const transaction = update.state.update({
              changes: {
                from: 300,
                to: count,
                insert: "",
              },
            });
            update.view.dispatch(transaction);
          }
        }
      }),
      EditorView.theme({
        "&": { height: "200px" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": { fontFamily: "Fira Code, monospace" },
        ".cm-line": { padding: "0 8px" },
        ".cm-cursor": { borderLeftWidth: "2px" },
        ".cm-focused": { outline: "none" },
      }),
    ];

    const state = EditorState.create({
      doc: "",
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    setEditorView(view);

    return () => view.destroy();
  }, []);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, e.target?.result as string]);
        setVideo(undefined);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideo(e.target?.result as string);
        setImages([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(undefined);
  };

  const handleSubmit = () => {
    if (!editorView) return;
    const content = editorView.state.doc.toString();
    console.log(content);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-[#2d2d2d] overflow-hidden">
      {/* Editor Header */}
      {quotePost && (
        <CodePost
          post={{
            post: quotePost as any,
          }}
          isCompose
        />
      )}
      {
        post && (
          <CodePost
            post={{
              post: post as any,
            }}
            isCompose
          />
        )
      }
      <div className="flex items-center justify-between bg-[#252526] px-4 py-2 border-b border-[#2d2d2d]">
        <div className="flex items-center space-x-4">
          <Terminal className="w-5 h-5 text-[#569cd6]" />
          <span className="text-[#d4d4d4]">
            {quotePost
              ? "quote.txt"
              : post
                ? "add_comment.txt"
                : "new_post.txt"}
          </span>
        </div>
        <span
          className={`text-sm ${charCount >= 300 ? "text-red-400" : "text-[#d4d4d4]"}`}
        >
          {charCount}/300
        </span>
      </div>

      <div ref={editorRef} className="border-b border-[#2d2d2d]" />

      <div className="p-4 border-b border-[#2d2d2d]">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#d4d4d4] text-sm">
                Images ({images.length}/4)
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 4 || !!video}
                className="flex items-center space-x-2 px-3 py-1 rounded text-sm bg-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d] disabled:opacity-50"
              >
                <FileImage className="w-4 h-4" />
                <span>Add Images</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-[#2d2d2d]"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-[#1e1e1e] text-[#d4d4d4] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#d4d4d4] text-sm">Video</span>
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={!!video || images.length > 0}
                className="flex items-center space-x-2 px-3 py-1 rounded text-sm bg-[#2d2d2d] text-[#d4d4d4] hover:bg-[#3d3d3d] disabled:opacity-50"
              >
                <FileVideo className="w-4 h-4" />
                <span>Add Video</span>
              </button>
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            {video && (
              <div className="relative group">
                <video
                  src={video}
                  controls
                  className="w-full h-24 object-cover rounded border border-[#2d2d2d]"
                />
                <button
                  onClick={removeVideo}
                  className="absolute top-1 right-1 p-1 rounded-full bg-[#1e1e1e] text-[#d4d4d4] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-[#569cd6] text-white rounded px-4 py-2 flex items-center justify-center space-x-2 hover:bg-[#4e8cc2]"
        >
          <Upload className="w-4 h-4" />
          <span>git.push(origin, main)</span>
        </button>
      </div>
    </div>
  );
}
