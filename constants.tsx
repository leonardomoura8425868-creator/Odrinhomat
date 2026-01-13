
import React from 'react';

export const THEMES = {
  cyberpunk: {
    bg: 'bg-black',
    gradient: 'from-fuchsia-600 via-purple-600 to-blue-600',
    text: 'text-fuchsia-500',
    accent: 'bg-fuchsia-500',
    glow: 'shadow-[0_0_50px_rgba(217,70,239,0.5)]',
    font: 'font-mono-clock'
  },
  minimalist: {
    bg: 'bg-zinc-50',
    gradient: 'from-zinc-400 to-zinc-600',
    text: 'text-zinc-900',
    accent: 'bg-zinc-900',
    glow: '',
    font: 'font-sans'
  },
  midnight: {
    bg: 'bg-slate-950',
    gradient: 'from-blue-900 to-slate-900',
    text: 'text-blue-200',
    accent: 'bg-blue-400',
    glow: 'shadow-[0_0_30px_rgba(147,197,253,0.3)]',
    font: 'font-serif-clock'
  },
  forest: {
    bg: 'bg-emerald-950',
    gradient: 'from-emerald-800 to-green-900',
    text: 'text-emerald-300',
    accent: 'bg-emerald-500',
    glow: 'shadow-[0_0_40px_rgba(16,185,129,0.4)]',
    font: 'font-sans'
  },
  aurora: {
    bg: 'bg-slate-900',
    gradient: 'from-teal-400 via-emerald-400 to-indigo-500',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300',
    accent: 'bg-teal-400',
    glow: 'shadow-[0_0_60px_rgba(45,212,191,0.5)]',
    font: 'font-mono-clock'
  }
};
