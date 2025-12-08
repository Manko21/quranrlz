export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio?: string; // URL for the audio of this specific ayah
  audioSecondary?: string[];
}

export interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface AppState {
  surah: Surah | null;
  startAyah: number;
  endAyah: number;
  reciter: Reciter;
  backgroundType: 'image' | 'video' | 'color';
  backgroundValue: string;
  logoUrl: string | null;
  logoPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  fontSize: number;
  textColor: string;
}