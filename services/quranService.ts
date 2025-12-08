import { API_BASE_URL } from '../constants';
import { Surah, Ayah } from '../types';

export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch surahs', error);
    return [];
  }
};

export const fetchAyahsWithAudio = async (
  surahNumber: number,
  start: number,
  end: number,
  reciterIdentifier: string
): Promise<Ayah[]> => {
  try {
    // We need to fetch text and audio. 
    // Option 1: Fetch full surah for text, full surah for audio, then slice.
    // Efficient for range: Fetch by Ayah reference is possible but limiting.
    // Let's fetch the specific range directly if possible, or calculate offsets.
    // The API supports offset/limit.
    
    // Calculate limit
    const limit = end - start + 1;
    const offset = start - 1; // API uses 0-based offset? No, API uses offset from start of Quran.
    // Actually, easier endpoint: /surah/{surahId}/{edition}?offset={offset}&limit={limit}
    // But offset is global (ayah index in whole quran) or local?
    // Let's use the simple: /surah/{number}/{edition} and filter client side for simplicity in this demo,
    // OR simply construct URLs if we know the structure.
    
    // Better approach for stability: Get verses for the Surah, then slice.
    const textResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/quran-uthmani`);
    const textData = await textResponse.json();
    
    const audioResponse = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${reciterIdentifier}`);
    const audioData = await audioResponse.json();

    if (!textData.data || !audioData.data) return [];

    const textAyahs: Ayah[] = textData.data.ayahs;
    const audioAyahs: Ayah[] = audioData.data.ayahs;

    // Merge audio into text objects
    const merged = textAyahs.map((ayah, index) => ({
      ...ayah,
      audio: audioAyahs[index]?.audio || '',
    }));

    // Filter by range
    return merged.filter(a => a.numberInSurah >= start && a.numberInSurah <= end);

  } catch (error) {
    console.error('Failed to fetch ayahs', error);
    return [];
  }
};