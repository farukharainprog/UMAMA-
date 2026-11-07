export type Scene = 
  | 'welcome' 
  | 'card' 
  | 'wishes' 
  | 'memories' 
  | 'cake' 
  | 'finale';

export interface Wish {
  id: number;
  text: string;
  category: string;
  arabicPhrase?: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  isCustom?: boolean;
}

export const BIRTHDAY_GIRL = "UMAMA";
export const CREATOR_NAME = "MALAIKA MUNEER";
export const BIRTHDAY_DATE = "8 November";

export const FIFTEEN_WISHES: Wish[] = [
  { id: 1, text: "May Allah bless you with endless happiness.", category: "Joy & Happiness" },
  { id: 2, text: "May Allah always keep your smile shining.", category: "Smiles & Radiance" },
  { id: 3, text: "May Allah grant you a long and healthy life.", category: "Health & Longevity" },
  { id: 4, text: "May Allah protect you from every difficulty.", category: "Divine Protection" },
  { id: 5, text: "May all your beautiful dreams come true.", category: "Aspirations & Dreams" },
  { id: 6, text: "May your life always be filled with love.", category: "Love & Warmth" },
  { id: 7, text: "May Allah bless your married life.", category: "Marital Blessings" },
  { id: 8, text: "May your marriage always remain full of happiness, love and understanding.", category: "Enduring Harmony" },
  { id: 9, text: "May Allah bless your home with peace and prosperity.", category: "Home & Prosperity" },
  { id: 10, text: "May you always stay healthy and successful.", category: "Success & Vitality" },
  { id: 11, text: "May every new day bring something beautiful into your life.", category: "New Beginnings" },
  { id: 12, text: "May Allah accept all your prayers.", category: "Answered Prayers" },
  { id: 13, text: "May you always be surrounded by people who genuinely care about you.", category: "Cherished Company" },
  { id: 14, text: "May your future be brighter and more beautiful.", category: "Golden Future" },
  { id: 15, text: "May Allah grant you everything that is best for you.", category: "Ultimate Good" },
];
