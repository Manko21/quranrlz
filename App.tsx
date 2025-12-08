import React, { useState, useEffect } from 'react';
import { AppState, Surah, Ayah } from './types';
import { POPULAR_RECITERS, BACKGROUND_IMAGES } from './constants';
import { fetchSurahs, fetchAyahsWithAudio } from './services/quranService';
import ConfigSidebar from './components/ConfigSidebar';
import VideoPreview from './components/VideoPreview';

const App: React.FC = () => {
  // --- State ---
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [appState, setAppState] = useState<AppState>({
    surah: null,
    startAyah: 1,
    endAyah: 1,
    reciter: POPULAR_RECITERS[0],
    backgroundType: 'image',
    backgroundValue: BACKGROUND_IMAGES[0],
    logoUrl: null,
    logoPosition: 'top-right',
    fontSize: 24,
    textColor: '#ffffff'
  });

  // --- Effects ---
  
  // 1. Fetch Surah List on Mount
  useEffect(() => {
    fetchSurahs().then(data => setSurahs(data));
  }, []);

  // 2. Fetch Ayahs when selection changes (with debounce/delay or explicit button)
  // To avoid spamming API, we will fetch when the user clicks "Generate" or when selections stabilize.
  // For better UX in this specific app flow, let's fetch automatically but with a flag.
  
  const handleGeneratePreview = async () => {
    if (!appState.surah) return;
    
    setIsGenerating(true);
    setIsLoadingAyahs(true);
    
    // Simulate processing time for "Generation" feel
    // In a real app, this might just be fetching.
    const fetchedAyahs = await fetchAyahsWithAudio(
        appState.surah.number,
        appState.startAyah,
        appState.endAyah,
        appState.reciter.identifier
    );
    
    setAyahs(fetchedAyahs);
    setIsLoadingAyahs(false);
    setIsGenerating(false);
  };

  // Auto-fetch if Reciter changes while ayahs are already loaded, so we get the new audio
  useEffect(() => {
      if (ayahs.length > 0 && appState.surah) {
          // Silent update for audio
          handleGeneratePreview();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.reciter]);


  return (
    <div className="flex h-screen w-full bg-gray-900 overflow-hidden flex-col md:flex-row font-sans">
      
      {/* Right Sidebar (Controls) - RTL layout means it appears on Right */}
      <ConfigSidebar 
        surahs={surahs}
        state={appState}
        setState={setAppState}
        isGenerating={isGenerating}
        onGenerate={handleGeneratePreview}
      />

      {/* Main Preview Area */}
      <main className="flex-1 relative h-full">
         <VideoPreview 
            state={appState}
            ayahs={ayahs}
            isLoadingAyahs={isLoadingAyahs}
         />
      </main>

    </div>
  );
};

export default App;