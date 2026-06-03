import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, BookOpen, UploadCloud, Image, Trash2, Link, Camera, 
  AlertCircle, RefreshCw, Layers, Globe
} from 'lucide-react';
=======
import { motion } from 'motion/react';
import { X, Check, BookOpen, UploadCloud, Image, Trash2, Link, Camera, Video, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6

interface CreatePostProps {
  key?: string;
  onBack: () => void;
  onPublish: (postData: { title: string; content: string; subject: string; chapter: string; image?: string }) => void;
  subjects: { id: string; name: string; chapters: string[] }[];
}

export function CreatePostPage({ onBack, onPublish, subjects }: CreatePostProps) {
  // Compose modal states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Dropdown menus
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);

  // Camera settings
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Default selections
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedChapter, setSelectedChapter] = useState('');

  // Synchronize chapter options automatically when subject changes
  useEffect(() => {
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

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0] || { id: '', name: 'General', chapters: ['General'] };
  const chapters = selectedSubject ? selectedSubject.chapters : ['General'];

  const startCamera = async () => {
    setCameraError(null);
    playCustomTap(520, 0.1);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.error("Video play err", err));
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera error", err);
      setCameraError("Camera permission denied or not available.");
    }
  };

  const stopCamera = () => {
    playCustomTap(450, 0.08);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

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

  const handleUrlApply = () => {
    if (imageUrl.trim()) {
      setImage(imageUrl.trim());
      setImageUrl('');
      setIsUrlInput(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && !image) return;

    playCustomTap(850, 0.15);

    // Call upstream publisher function
    onPublish({
      title: title.trim(),
      content: content.trim(),
      subject: selectedSubject ? selectedSubject.name : 'General Syllabus',
      chapter: selectedChapter,
      image: image || undefined,
    });
  };

  return (
<<<<<<< HEAD
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
        className="bg-neutral-900 border border-zinc-800/95 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden relative z-[110]"
      >
        {/* Overlay header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/40">
          <div className="flex items-center gap-2">
            
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
=======
    <div className="min-h-screen text-zinc-100 font-sans pb-32 pt-28 px-4 md:px-0 max-w-2xl mx-auto relative z-10 w-full">
      {/* Back button and title */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-full transition-colors hover:bg-white/5 border border-white/5 bg-zinc-900/50 cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 font-mono">
          New Discussion
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl space-y-6 relative animate-fade-in"
      >
        {/* Background glow effects to match the app theme */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <h2 className="text-2xl font-black text-white tracking-tight font-apple">Compose Post</h2>
>>>>>>> 331adfb541e95bad51a4d491b94bba295b70eae6
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
                <span>Subject: {selectedSubjectId || 'Select Subject'}</span>
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
                className="h-8 px-3.5 bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-650 rounded-full text-[11px] font-black text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
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

          {/* Image URL text entry bar */}
          <AnimatePresence>
            {isUrlInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl space-y-2.5 overflow-hidden flex flex-col"
              >
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider font-mono">Image Link URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/your-image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUrlApply}
                    className="px-3.5 h-8 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-[11px] rounded-lg cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

              {/* Media Button: URL input */}
              <button
                type="button"
                onClick={() => {
                  playCustomTap(480, 0.05);
                  setIsUrlInput(!isUrlInput);
                }}
                className={`p-2.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer ${isUrlInput ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-400 hover:text-white'}`}
                title="Paste Image Link"
              >
                <Link className="w-4.5 h-4.5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() && !title.trim() && !image}
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
