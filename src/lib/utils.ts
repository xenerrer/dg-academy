import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Segundos para m:ss */
export function formatarTempo(segundos: number) {
  const s = Math.floor(segundos)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
