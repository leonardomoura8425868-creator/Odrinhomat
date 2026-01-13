
export type Theme = 'cyberpunk' | 'minimalist' | 'midnight' | 'forest' | 'aurora';

export interface ClockSettings {
  theme: Theme;
  showSeconds: boolean;
  is24Hour: boolean;
  showDate: boolean;
  transitiveMode: boolean; // Makes the clock move slowly around the screen
}

export interface TimeState {
  hours: string;
  minutes: string;
  seconds: string;
  date: string;
  dayOfWeek: string;
}
