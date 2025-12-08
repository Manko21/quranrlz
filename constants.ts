import { Reciter } from './types';

export const API_BASE_URL = 'https://api.alquran.cloud/v1';

export const POPULAR_RECITERS: Reciter[] = [
  { identifier: 'ar.alafasy', name: 'مشاري العفاسي', englishName: 'Mishary Rashid Alafasy', format: 'audio', type: 'versebyverse' },
  { identifier: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد (مرتل)', englishName: 'Abdul Basit (Murattal)', format: 'audio', type: 'versebyverse' },
  { identifier: 'ar.sudais', name: 'عبد الرحمن السديس', englishName: 'Abdurrahmaan As-Sudais', format: 'audio', type: 'versebyverse' },
  { identifier: 'ar.hudhaify', name: 'علي الحذيفي', englishName: 'Ali Al-Hudhaify', format: 'audio', type: 'versebyverse' },
  { identifier: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', englishName: 'Maher Al Muaiqly', format: 'audio', type: 'versebyverse' },
  { identifier: 'ar.minshawi', name: 'محمد صديق المنشاوي', englishName: 'Mohamed Siddiq Al-Minshawi', format: 'audio', type: 'versebyverse' },
];

export const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537420327992-d6e192287183?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542259681-d4cd4a317730?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1000&auto=format&fit=crop',
];

export const BACKGROUND_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
];

export const BACKGROUND_COLORS = [
  '#111827', // Gray 900
  '#064e3b', // Emerald 900
  '#1e3a8a', // Blue 900
  '#312e81', // Indigo 900
  '#4c1d95', // Violet 900
  '#831843', // Pink 900
  '#000000', // Black
];
