import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, BookOpen, UploadCloud, Image, Trash2, Camera, 
  AlertCircle, Layers, FileText
} from 'lucide-react';

interface CreatePostProps {
  key?: string;
  onBack: () => void;
  onPublish: (postData: { title: string; content: string; subject: string; chapter: string; image?: string; pdf?: { name: string; size: string; dataUrl: string } | null }) => void;
  subjects: { id: string; name: string; chapters: string[] }[];
}

export function CreatePostPage({ onBack, onPublish, subjects }: CreatePostProps) {
  // Compose modal states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  // Dropdown menus
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);

  // Camera settings
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Default selections - set empty so user has to click "Select Subject" (select) instead of defaulting to "critical"
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  // Synchronize chapter options automatically when subject changes
  useEffect(() => {
    if (!selectedSubjectId) {
      setSelectedChapter('');
      return;
    }
    const sub = subjects.find(s => s.id === selectedSubjectId);
    if (sub && sub.chapters && sub.chapters.length > 0) {
      setSelectedChapter(sub.chapters[0]);
    } else {
      setSelectedChapter('General');
    }
  }, [selectedSubjectId, subjects]);

  // Clean raw tap sound effect
  const playCustomTap = (freq = 600, duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const selectedSubject = selectedSubjectId ? subjects.find(s => s.id === selectedSubjectId) : null;
  const chapters = selectedSubject ? selectedSubject.chapters : [];

  const startCamera = () => {
    setCameraError(null);
    playCustomTap(520, 0.1);
    setCameraActive(true);
  };

  const stopCamera = () => {
    playCustomTap(450, 0.08);
    setCameraActive(false);
  };

  // Camera stream lifecycle synchronizer
  useEffect(() => {
    if (!cameraActive) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      return;
    }

    let active = true;
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Use standard play
          videoRef.current.play().catch(err => console.error("Video play err", err));
        }
      } catch (err: any) {
        console.error("Camera error", err);
        setCameraActive(false);
        setCameraError("Camera permission denied or not available.");
      }
    };

    initCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const capturePhoto = () => {
    playCustomTap(750, 0.12);
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // mirror
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleSubjectSelect = (subId: string) => {
    playCustomTap(580, 0.07);
    setSelectedSubjectId(subId);
    setShowSubjectDropdown(false);
  };

  const handleChapterSelect = (ch: string) => {
    playCustomTap(590, 0.07);
    setSelectedChapter(ch);
    setShowChapterDropdown(false);
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
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const sizeInKB = (file.size / 1024).toFixed(1);
            const sizeStr = parseFloat(sizeInKB) > 1024 
              ? `${(parseFloat(sizeInKB) / 1024).toFixed(1)} MB` 
              : `${sizeInKB} KB`;

            setPdfFile({
              name: file.name,
              size: sizeStr,
              dataUrl: event.target.result as string,
            });
            playCustomTap(700, 0.1);
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

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const sizeInKB = (file.size / 1024).toFixed(1);
            const sizeStr = parseFloat(sizeInKB) > 1024 
              ? `${(parseFloat(sizeInKB) / 1024).toFixed(1)} MB` 
              : `${sizeInKB} KB`;

            setPdfFile({
              name: file.name,
              size: sizeStr,
              dataUrl: event.target.result as string,
            });
            playCustomTap(700, 0.1);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a PDF document file (.pdf)");
      }
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && !image && !pdfFile) return;

    playCustomTap(850, 0.15);

    // Call upstream publisher function
    onPublish({
      title: title.trim(),
      content: content.trim(),
      subject: selectedSubject ? `${selectedSubject.id} - ${selectedSubject.name}` : 'General Syllabus',
      chapter: selectedChapter,
      image: image || undefined,
      pdf: pdfFile || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
      
      {/* Click overlay backplate to close modal */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={() => {
          playCustomTap(400, 0.08);
          onBack();
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-neutral-900 border max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden relative z-[110] transition-all duration-200 ${
          isDragging ? 'border-blue-500 scale-[1.01] shadow-blue-500/20' : 'border-zinc-800/95'
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-neutral-950/90 z-50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 pointer-events-none border-2 border-dashed border-blue-500 rounded-2xl m-2 animate-pulse">
            <UploadCloud className="w-12 h-12 text-blue-400" />
            <div className="text-base font-bold text-white">Drop Files Here</div>
            <div className="text-xs text-zinc-400">Supporting images and PDF documents</div>
          </div>
        )}

        {/* Overlay header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-apple-blue shrink-0 animate-pulse" />
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest font-mono">Create Student Post</span>
          </div>
          
          <button
            type="button"
            onClick={() => {
              playCustomTap(400, 0.08);
              onBack();
            }}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handlePublish} className="p-6 space-y-5">
          
          {/* Classification Selectors (Subject + Chapter) */}
          <div className="flex flex-wrap gap-3">
            
            {/* Subject dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playCustomTap(500, 0.05);
                  setShowSubjectDropdown(!showSubjectDropdown);
                  setShowChapterDropdown(false);
                }}
                className="h-8 px-3.5 bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-650 rounded-full text-[11px] font-black text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                <span>Subject: {selectedSubject ? `${selectedSubject.id} - ${selectedSubject.name}` : 'Select Subject'}</span>
                <span className="text-zinc-500 text-[8px]">▼</span>
              </button>

              <AnimatePresence>
                {showSubjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-zinc-950 border border-zinc-800 rounded-xl py-1 shadow-2xl z-50 max-h-52 overflow-y-auto no-scrollbar"
                  >
                    {subjects.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSubjectSelect(s.id)}
                        className="w-full text-left px-4 py-2.5 text-[11.5px] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-bold block truncate cursor-pointer"
                      >
                        {s.id} - {s.name.replace('\n', ' ')}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chapter dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playCustomTap(510, 0.05);
                  setShowChapterDropdown(!showChapterDropdown);
                  setShowSubjectDropdown(false);
                }}
                className="h-8 px-3.5 bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-650 rounded-full text-[11px] font-black text-purple-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span className="max-w-[140px] truncate">{selectedChapter || 'Select Chapter'}</span>
                <span className="text-zinc-500 text-[8px]">▼</span>
              </button>

              <AnimatePresence>
                {showChapterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-zinc-950 border border-zinc-800 rounded-xl py-1 shadow-2xl z-50 max-h-52 overflow-y-auto no-scrollbar"
                  >
                    {chapters.map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleChapterSelect(ch)}
                        className="w-full text-left px-4 py-2.5 text-[11.5px] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors font-bold block truncate cursor-pointer"
                      >
                        {ch}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Title Area */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/40">
            <input
              type="text"
              placeholder="Topic or question title... (e.g. Help with Question 3b)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none"
            />
          </div>

          {/* Content TextArea */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/40">
            <textarea
              placeholder="Type your academic question, discussion detail, or notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Camera stream view */}
          <AnimatePresence>
            {cameraActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video flex flex-col justify-end"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
                
                <div className="relative z-10 p-3 bg-gradient-to-t from-black/85 to-transparent flex items-center justify-between gap-3">
                  <span className="text-[10px] text-emerald-400 font-black tracking-widest animate-pulse flex items-center gap-1">
                    ● CAMERA STREAM ACTIVE
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10.5px] rounded-full active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Capture Snap
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 font-extrabold text-[10.5px] rounded-full cursor-pointer"
                    >
                      Stop Feed
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera Permissions Failure Box */}
          {cameraError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

                  {/* Uploaded PDF preview */}
          {pdfFile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-300 truncate max-w-[240px] md:max-w-[320px]">{pdfFile.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{pdfFile.size} • PDF Document</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="p-1.5 bg-black/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-red-400 rounded-full transition-colors cursor-pointer"
                title="Remove PDF"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Uploaded / Selected image preview */}
          {image && (
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 max-h-48 group">
              <img 
                src={image} 
                alt="Uploaded snapshot" 
                className="w-full h-full object-cover max-h-48"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5">
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="p-1.5 bg-black/80 hover:bg-neutral-800 text-red-400 rounded-full transition-transform active:scale-95 border border-zinc-800 cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions panel */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
            <div className="flex items-center gap-2">
              {/* Media Button: Select File */}
              <label 
                className="p-2.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors block relative"
                title="Upload Image"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <Image className="w-4.5 h-4.5" />
              </label>

              {/* Media Button: Camera */}
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className={`p-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer ${cameraActive ? 'text-green-400 bg-green-500/10' : 'text-zinc-400 hover:text-white'}`}
                title="Take Snap"
              >
                <Camera className="w-4.5 h-4.5" />
              </button>

              {/* Media Button: PDF Uploader */}
              <button
                type="button"
                onClick={() => {
                  playCustomTap(480, 0.05);
                  pdfInputRef.current?.click();
                }}
                className={`p-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer ${pdfFile ? 'text-red-400 bg-red-500/10' : 'text-zinc-400 hover:text-white'}`}
                title="Upload PDF File"
              >
                <FileText className="w-4.5 h-4.5" />
              </button>
              <input 
                type="file" 
                ref={pdfInputRef} 
                accept="application/pdf" 
                onChange={handlePdfChange} 
                className="hidden" 
              />
            </div>

            <button
              type="submit"
              disabled={!content.trim() && !title.trim() && !image && !pdfFile}
              className="h-10 px-5 bg-blue-500 hover:bg-blue-400 disabled:bg-zinc-800 text-white disabled:text-zinc-600 rounded-full text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Publish Question
            </button>
          </div>

        </form>

      </motion.div>
    </div>
  );
}
