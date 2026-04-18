export interface OrderData {
  // Step 1 - Style
  style: string;
  vocalPreference: string;
  // Step 2 - Recipient
  recipientName: string;
  relationship: string;
  // Step 3 - Occasion
  occasion: string;
  // Step 4 - Story
  story: string;
  specificLyrics?: string;
  // Step 5 - Delivery
  email: string;
}

export const MUSICAL_STYLES = ["Pop", "Ballad", "Country", "Rock", "Jazz", "Rap", "R&B", "Folk"];
export const VOCAL_PREFERENCES = ["Male", "Female", "Duet"];
export const RELATIONSHIPS = ["Partner", "Parent", "Child", "Sibling", "Friend", "Myself", "Other"];
export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Proposal",
  "Valentine's Day",
  "Just Because",
  "Memorial",
  "Graduation",
  "Mother's Day",
  "Father's Day",
  "Christmas",
  "Other",
];

export const SONG_PRICE = 2.00;
export const SONG_PRICE_CENTS = 200;
