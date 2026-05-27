import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, BookOpen, UploadCloud, Image, Trash2, Link, Camera, Video, AlertCircle, RefreshCw } from 'lucide-react';

interface CreatePostProps {
  onBack: () => void;
  onPublish: (postData: { title: string; content: string; subject: string; chapter: string; image?: string }) => void;
  subjects: { id: string; name: string; chapters: string[] }[];
}

export function CreatePostPage({ onBack, onPublish, subjects }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Default to the first subject and its first chapter
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedChapter, setSelectedChapter] = useState(subjects[0]?.chapters[0] || 'General');

  // Clean-up camera feed on component release
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.error("Video playback error", err));
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access failed", err);
      setCameraError("Camera access denied. Please grant study group frame camera permission.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirrored view check
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const chapters = selectedSubject ? selectedSubject.chapters : ['General'];

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = subjects.find(s => s.id === subjectId);
    if (sub && sub.chapters.length > 0) {
      setSelectedChapter(sub.chapters[0]);
    } else {
      setSelectedChapter('General');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setImage(imageUrl.trim());
      setImageUrl('');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && !image) {
      return;
    }
    
    onPublish({
      title: title.trim(),
      content: content.trim(),
      subject: selectedSubject ? selectedSubject.name : 'General Discussion',
      chapter: selectedChapter,
      image: image || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-zinc-900/90 border border-white/10 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6 relative"
      >
        {/* Background glow effects to match the app theme */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10 z-index">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Compose</h2>
          <button
            onClick={onBack}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePublish} className="space-y-5 relative z-10">
          
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="Add a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all"
            />
          </div>

          {/* Content input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
              Content (optional)
            </label>
            <textarea
              placeholder="Write something thoughtful..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/10 focus:border-white/20 rounded-2xl px-4 py-4 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Photos Area: Divided into File Upload and Take Photo columns */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-zinc-500" /> Image Attachments & Capture Options (optional)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Choose File Upload / Image Link */}
              <div className="space-y-2 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-300">File Upload</span>
                    <button
                      type="button"
                      onClick={() => setIsUrlInput(!isUrlInput)}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-none border-none p-0 cursor-pointer"
                    >
                      {isUrlInput ? "Switch to File" : "Or Paste Link"}
                    </button>
                  </div>

                  {isUrlInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-650 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleUrlSubmit}
                        className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl text-xs font-bold transition-all border border-blue-500/20 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/[0.06] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]'
                      }`}
                      onClick={() => document.getElementById('photo-file-upload')?.click()}
                    >
                      <input
                        id="photo-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <UploadCloud className="w-6 h-6 text-zinc-500 mx-auto mb-1" />
                      <p className="text-[11px] font-bold text-zinc-300">
                        {isDragging ? "Drop here!" : "Drag & drop, or click"}
                      </p>
                      <p className="text-[9px] text-zinc-550">PNG, JPG, WEBP, GIF</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Camera / Take Photo */}
              <div className="space-y-2 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-zinc-400" /> Live Capture
                    </span>
                    {cameraActive && (
                      <span className="text-[9px] font-extrabold text-green-500 animate-pulse tracking-widest flex items-center gap-1">
                        ● STREAMING
                      </span>
                    )}
                  </div>

                  {cameraActive ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      {/* Interactive overlay buttons */}
                      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2 px-2">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-full text-[10px] font-bold shadow-lg transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" /> Capture
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-[10px] font-bold shadow-lg transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 border border-white/[0.05] bg-white/[0.01] rounded-xl h-[82px] text-center">
                      {cameraError ? (
                        <div className="space-y-1">
                          <p className="text-[9px] text-rose-400 font-semibold flex items-center justify-center gap-1 leading-tight">
                            <AlertCircle className="w-2.5 h-2.5 shrink-0" /> Camera access denied.
                          </p>
                          <button
                            type="button"
                            onClick={startCamera}
                            className="text-[9px] text-blue-400 hover:underline font-bold"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" /> Start Camera
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Display single unified image result preview if present */}
            {image && (
              <div className="relative mt-3 rounded-2xl overflow-hidden border border-white/10 max-h-56 group">
                <img
                  src={image}
                  alt="Attachment preview"
                  className="w-full h-full object-cover max-h-56"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <div className="bg-black/80 px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-500" /> Attached Photo Successfully
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="p-2 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full transition-transform active:scale-95"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Subject Category dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-zinc-500" /> Subject Category
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer hover:border-white/20 transition-all"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-zinc-950 text-white font-bold">
                  {sub.name.replace('\n', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Tip message */}
          <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
            Tip: You can post without images. If multiple images are selected, the first one is uploaded now (multi-image posts can be extended later).
          </p>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-white/[0.05]">

            {/* Publish button at bottom right */}
            <button
              type="submit"
              disabled={!content.trim() && !title.trim() && !image}
              className={`px-7 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 ${
                content.trim() || title.trim() || image
                  ? 'bg-white text-zinc-950 hover:bg-zinc-200 cursor-pointer shadow-lg shadow-white/10'
                  : 'bg-white/30 text-zinc-800 cursor-not-allowed border border-white/10'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Publish</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
