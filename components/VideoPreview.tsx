import React, { useRef, useEffect, useState } from 'react';
import { AppState, Ayah } from '../types';
import { Play, Pause, RotateCcw, Download, Share2, X, Check, Facebook, Twitter, MessageCircle, Copy } from 'lucide-react';

interface VideoPreviewProps {
  state: AppState;
  ayahs: Ayah[];
  isLoadingAyahs: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ state, ayahs, isLoadingAyahs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoBgRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset when content changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentAyahIndex(0);
    setProgress(0);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    // Scroll to top on reset
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [ayahs, state.reciter]);

  useEffect(() => {
    // Handle audio ending to move to next ayah
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setCurrentAyahIndex(0);
      }
    };

    const handleTimeUpdate = () => {
        if(audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    }

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentAyahIndex, ayahs]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
    }
  }, [currentAyahIndex, isPlaying]);
  
  // Sync Video Background with Audio Play/Pause
  useEffect(() => {
      if (state.backgroundType === 'video' && videoBgRef.current) {
          if (isPlaying) {
              videoBgRef.current.play().catch(() => {});
          } else {
              videoBgRef.current.pause();
          }
      }
  }, [isPlaying, state.backgroundType, state.backgroundValue]);

  // Auto-scroll effect
  useEffect(() => {
    if (ayahs.length > 0) {
        const activeEl = document.getElementById(`ayah-${currentAyahIndex}`);
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [currentAyahIndex, ayahs]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleShare = (platform: string) => {
    const text = `شاهد هذا الفيديو القرآني الرائع لسورة ${state.surah?.name || ''}`;
    const url = "https://quran-reels.app/share/demo"; 

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'tiktok':
        alert("تم نسخ رابط الفيديو! يمكنك الآن فتح تطبيق تيك توك ولصق الرابط أو رفع الفيديو المحمل.");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareModal(false);
  };

  const copyLink = () => {
      navigator.clipboard.writeText("https://quran-reels.app/share/demo");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const currentAyah = ayahs[currentAyahIndex];

  // Helper for logo positioning
  const getLogoClass = (pos: string) => {
      switch(pos) {
          case 'top-left': return 'top-6 left-6';
          case 'top-right': return 'top-6 right-6';
          case 'bottom-left': return 'bottom-20 left-6';
          case 'bottom-right': return 'bottom-20 right-6';
          default: return 'top-6 right-6';
      }
  }

  return (
    <div className="flex-1 h-full bg-gray-900 flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
        </div>

        {/* Phone Frame */}
        <div className="relative w-[340px] md:w-[400px] h-[700px] md:h-[800px] bg-black rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden z-10 ring-4 ring-gray-900/50">
            
            {/* Dynamic Content Layer */}
            {isLoadingAyahs ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-emerald-400 font-amiri">جاري تحميل الآيات...</p>
                </div>
            ) : ayahs.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                    <p>قم باختيار سورة وآيات للبدء</p>
                </div>
            ) : (
                <>
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0 bg-gray-900">
                        {state.backgroundType === 'image' && (
                             <img 
                                src={state.backgroundValue} 
                                alt="Background" 
                                className="w-full h-full object-cover transition-transform duration-[20s] ease-linear"
                                style={{ transform: isPlaying ? 'scale(1.1)' : 'scale(1.0)' }}
                            />
                        )}
                        
                        {state.backgroundType === 'video' && (
                             <video 
                                ref={videoBgRef}
                                src={state.backgroundValue} 
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                // Auto-play handled by effect sync
                            />
                        )}

                        {state.backgroundType === 'color' && (
                             <div 
                                className="w-full h-full"
                                style={{ backgroundColor: state.backgroundValue }}
                             ></div>
                        )}

                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                    </div>

                    {/* Channel Logo */}
                    {state.logoUrl && (
                        <img 
                            src={state.logoUrl} 
                            alt="Logo" 
                            className={`absolute w-16 h-16 object-contain z-30 drop-shadow-lg ${getLogoClass(state.logoPosition)}`} 
                        />
                    )}

                    {/* Metadata Overlay (Top Center) */}
                    <div className="absolute top-12 left-0 w-full text-center z-20 px-4 pointer-events-none">
                        <h2 className="text-white/90 text-lg font-bold drop-shadow-md font-amiri bg-black/20 rounded-full px-4 py-1 inline-block backdrop-blur-sm border border-white/10">
                            {state.surah?.name}
                        </h2>
                        <p className="text-emerald-300 text-xs mt-1 drop-shadow font-medium">{state.reciter.name}</p>
                    </div>

                    {/* Main Text Content - Scrollable List */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div 
                            ref={scrollContainerRef}
                            className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth py-[60%] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        >
                            <div className="flex flex-col gap-24 px-8">
                                {ayahs.map((ayah, index) => (
                                    <div 
                                        key={`${ayah.number}-${index}`} 
                                        id={`ayah-${index}`}
                                        className={`transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center text-center ${
                                            index === currentAyahIndex 
                                            ? 'opacity-100 scale-100 blur-none' 
                                            : 'opacity-40 scale-95 blur-[2px]'
                                        }`}
                                    >
                                        <p 
                                            className="quran-text leading-[2.5] drop-shadow-2xl dir-rtl"
                                            style={{ 
                                                fontSize: `${state.fontSize}px`, 
                                                color: state.textColor,
                                                textShadow: '0 4px 12px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {ayah.text}
                                        </p>
                                        {index === currentAyahIndex && (
                                            <p className="text-white/60 text-sm mt-4 font-amiri border border-white/20 rounded-full px-3 py-1 inline-block bg-black/30 backdrop-blur-md">
                                                الآية {ayah.numberInSurah}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Audio Element (Hidden) */}
                    <audio 
                        ref={audioRef}
                        src={currentAyah?.audio}
                        preload="auto"
                    />

                    {/* Progress Bar (TikTok style) */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
                        <div 
                            className="h-full bg-emerald-500 transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </>
            )}

            {/* Overlay Controls (Simulate UI overlay of Reels) */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-30 text-white items-center">
                 <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60 cursor-pointer transition-colors">
                    <span className="text-xl">❤️</span>
                 </div>
                 <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60 cursor-pointer transition-colors">
                    <span className="text-xl">💬</span>
                 </div>
                 <button 
                    onClick={() => setShowShareModal(true)}
                    className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-black/60 cursor-pointer transition-colors"
                 >
                    <Share2 className="w-5 h-5" />
                 </button>
            </div>

        </div>

        {/* External Player Controls */}
        <div className="mt-8 flex items-center gap-6 bg-gray-800/80 p-4 rounded-2xl backdrop-blur-md border border-gray-700 shadow-xl z-20">
            <button 
                onClick={() => {
                    setIsPlaying(false);
                    setCurrentAyahIndex(0);
                    if(audioRef.current) audioRef.current.currentTime = 0;
                    if(scrollContainerRef.current) scrollContainerRef.current.scrollTo({top: 0, behavior: 'smooth'});
                    if(videoBgRef.current) videoBgRef.current.currentTime = 0;
                }}
                className="p-3 rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
                title="إعادة التشغيل"
            >
                <RotateCcw className="w-6 h-6" />
            </button>
            
            <button 
                onClick={togglePlay}
                disabled={ayahs.length === 0}
                className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95 text-white"
            >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            
            <button 
                className="p-3 rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
                title="تصدير"
                onClick={() => alert("سيتم تصدير الفيديو بجودة عالية قريبًا. (هذه نسخة تجريبية للعرض)")}
            >
                <Download className="w-6 h-6" />
            </button>

            <button 
                className="p-3 rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
                title="مشاركة"
                onClick={() => setShowShareModal(true)}
            >
                <Share2 className="w-6 h-6" />
            </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 transform transition-all">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             <Share2 className="w-5 h-5 text-emerald-500" />
                            مشاركة الريلز
                        </h3>
                        <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleShare('facebook')} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-[#1877F2] text-white rounded-xl transition-all hover:scale-105 group">
                            <Facebook className="w-6 h-6 group-hover:fill-current" />
                            <span className="text-sm font-medium">فيسبوك</span>
                        </button>
                         <button onClick={() => handleShare('twitter')} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-[#1DA1F2] text-white rounded-xl transition-all hover:scale-105 group">
                            <Twitter className="w-6 h-6 group-hover:fill-current" />
                             <span className="text-sm font-medium">تويتر</span>
                        </button>
                         <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-[#25D366] text-white rounded-xl transition-all hover:scale-105 group">
                            <MessageCircle className="w-6 h-6 group-hover:fill-current" />
                             <span className="text-sm font-medium">واتساب</span>
                        </button>
                        <button onClick={() => handleShare('tiktok')} className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 hover:bg-black text-white rounded-xl transition-all hover:scale-105 border border-transparent hover:border-gray-600">
                            <span className="text-xl font-bold">TikTok</span>
                             <span className="text-sm font-medium">تيك توك</span>
                        </button>
                    </div>

                    <div className="relative">
                        <label className="text-xs text-gray-400 mb-2 block">رابط المشاركة</label>
                        <div className="flex bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                            <input type="text" readOnly value="https://quran-reels.app/share/demo" className="bg-transparent text-sm text-gray-300 px-3 py-3 flex-1 outline-none font-mono dir-ltr" />
                            <button onClick={copyLink} className="bg-gray-700 hover:bg-gray-600 text-white px-4 flex items-center justify-center transition-colors border-l border-gray-600">
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default VideoPreview;