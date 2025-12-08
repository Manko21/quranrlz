import React from 'react';
import { AppState, Surah, Reciter } from '../types';
import { POPULAR_RECITERS, BACKGROUND_IMAGES, BACKGROUND_VIDEOS, BACKGROUND_COLORS } from '../constants';
import { Settings, Upload, Music, Image as ImageIcon, Type, Layout, Video, Palette } from 'lucide-react';

interface ConfigSidebarProps {
  surahs: Surah[];
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  isGenerating: boolean;
  onGenerate: () => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({
  surahs,
  state,
  setState,
  isGenerating,
  onGenerate,
}) => {
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setState(prev => ({ ...prev, logoUrl: url }));
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        // Determine type based on file type
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setState(prev => ({ ...prev, backgroundType: type, backgroundValue: url }));
      }
  };

  return (
    <div className="w-full md:w-96 bg-gray-800 h-full overflow-y-auto border-l border-gray-700 flex flex-col shadow-2xl z-10">
      <div className="p-6 border-b border-gray-700 bg-gray-800 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <span>إعدادات الريلز</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">قم بتخصيص الفيديو الخاص بك</p>
      </div>

      <div className="p-6 space-y-8 flex-1">
        
        {/* Quran Selection */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
            القرآن الكريم
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">السورة</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={state.surah?.number || ''}
                onChange={(e) => {
                  const s = surahs.find(s => s.number === parseInt(e.target.value));
                  if (s) setState(prev => ({ ...prev, surah: s, startAyah: 1, endAyah: Math.min(5, s.numberOfAyahs) }));
                }}
              >
                <option value="">اختر السورة...</option>
                {surahs.map(s => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.englishName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">من آية</label>
                <input
                  type="number"
                  min={1}
                  max={state.surah?.numberOfAyahs || 1}
                  value={state.startAyah}
                  onChange={(e) => setState(prev => ({ ...prev, startAyah: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-sm text-white focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">إلى آية</label>
                <input
                  type="number"
                  min={state.startAyah}
                  max={state.surah?.numberOfAyahs || 1}
                  value={state.endAyah}
                  onChange={(e) => setState(prev => ({ ...prev, endAyah: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-sm text-white focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reciter Selection */}
        <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-emerald-500" />
            القارئ
          </h3>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            value={state.reciter.identifier}
            onChange={(e) => {
              const r = POPULAR_RECITERS.find(r => r.identifier === e.target.value);
              if (r) setState(prev => ({ ...prev, reciter: r }));
            }}
          >
            {POPULAR_RECITERS.map(r => (
              <option key={r.identifier} value={r.identifier}>{r.name}</option>
            ))}
          </select>
        </section>

        {/* Visuals */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            الخلفية والمظهر
          </h3>
          
          {/* Background Type Toggles */}
          <div className="flex bg-gray-700 p-1 rounded-lg mb-4">
            <button
                onClick={() => setState(prev => ({...prev, backgroundType: 'image', backgroundValue: BACKGROUND_IMAGES[0]}))}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-all ${state.backgroundType === 'image' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                <ImageIcon className="w-3 h-3" /> صورة
            </button>
            <button
                onClick={() => setState(prev => ({...prev, backgroundType: 'video', backgroundValue: BACKGROUND_VIDEOS[0]}))}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-all ${state.backgroundType === 'video' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                <Video className="w-3 h-3" /> فيديو
            </button>
            <button
                onClick={() => setState(prev => ({...prev, backgroundType: 'color', backgroundValue: BACKGROUND_COLORS[0]}))}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-all ${state.backgroundType === 'color' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
                <Palette className="w-3 h-3" /> لون
            </button>
          </div>
          
          {/* Controls based on Type */}
          {state.backgroundType === 'image' && (
            <div className="grid grid-cols-5 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                {BACKGROUND_IMAGES.map((url, idx) => (
                <button
                    key={idx}
                    onClick={() => setState(prev => ({ ...prev, backgroundValue: url }))}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${state.backgroundValue === url ? 'border-emerald-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
                >
                    <img src={url} alt="bg" className="w-full h-full object-cover" />
                </button>
                ))}
            </div>
          )}

          {state.backgroundType === 'video' && (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                {BACKGROUND_VIDEOS.map((url, idx) => (
                <button
                    key={idx}
                    onClick={() => setState(prev => ({ ...prev, backgroundValue: url }))}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all relative ${state.backgroundValue === url ? 'border-emerald-500 scale-105' : 'border-transparent hover:border-gray-500'}`}
                >
                    <video src={url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Video className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                </button>
                ))}
            </div>
          )}

          {state.backgroundType === 'color' && (
            <div className="grid grid-cols-7 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                {BACKGROUND_COLORS.map((color) => (
                <button
                    key={color}
                    onClick={() => setState(prev => ({ ...prev, backgroundValue: color }))}
                    className={`aspect-square rounded-full border-2 transition-all ${state.backgroundValue === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                />
                ))}
                <label className="aspect-square rounded-full border-2 border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-700">
                    <input 
                        type="color" 
                        className="opacity-0 w-full h-full absolute cursor-pointer" 
                        onChange={(e) => setState(prev => ({ ...prev, backgroundValue: e.target.value }))}
                    />
                    <Palette className="w-3 h-3 text-gray-300" />
                </label>
            </div>
          )}
          
          {(state.backgroundType === 'image' || state.backgroundType === 'video') && (
            <div className="relative group mt-2">
                <input 
                    type="file" 
                    accept={state.backgroundType === 'image' ? "image/*" : "video/*"} 
                    onChange={handleBgUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="w-full bg-gray-700 hover:bg-gray-600 border border-dashed border-gray-500 text-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                        {state.backgroundType === 'image' ? 'رفع صورة خاصة' : 'رفع فيديو خاص'}
                    </span>
                </div>
            </div>
          )}

          <div className="pt-2">
             <label className="block text-xs text-gray-400 mb-1">شعار القناة (Logo)</label>
             <div className="relative group">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors">
                    {state.logoUrl ? <span className="text-emerald-400 text-sm">تم رفع الشعار</span> : <span className="text-sm flex items-center gap-2"><Upload className="w-3 h-3" /> رفع شعار</span>}
                </div>
             </div>
             {state.logoUrl && (
               <div className="flex gap-2 mt-2 justify-center">
                 {['top-right', 'top-left', 'bottom-right', 'bottom-left'].map((pos) => (
                   <button 
                    key={pos}
                    onClick={() => setState(prev => ({...prev, logoPosition: pos as any}))}
                    className={`w-6 h-6 rounded bg-gray-700 border ${state.logoPosition === pos ? 'border-emerald-500 bg-emerald-900' : 'border-gray-600'}`}
                    title={pos}
                   />
                 ))}
               </div>
             )}
          </div>
        </section>

        {/* Text Settings */}
        <section className="space-y-4">
             <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-500" />
                النص
            </h3>
            <div>
                <label className="block text-xs text-gray-400 mb-1">حجم الخط</label>
                <input 
                    type="range" 
                    min="16" 
                    max="48" 
                    value={state.fontSize} 
                    onChange={(e) => setState(prev => ({...prev, fontSize: parseInt(e.target.value)}))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
            </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">لون النص</label>
                <div className="flex gap-2">
                    {['#ffffff', '#fcd34d', '#34d399', '#000000'].map(c => (
                        <button
                            key={c}
                            onClick={() => setState(prev => ({...prev, textColor: c}))}
                            className={`w-6 h-6 rounded-full border-2 ${state.textColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{backgroundColor: c}}
                        />
                    ))}
                </div>
            </div>
        </section>

      </div>

      <div className="p-6 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-20">
        <button
          onClick={onGenerate}
          disabled={!state.surah || isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 ${
            !state.surah 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
          }`}
        >
            {isGenerating ? (
                <>
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                 جاري المعالجة...
                </>
            ) : (
                <>
                <Layout className="w-5 h-5" />
                 توليد الفيديو
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default ConfigSidebar;