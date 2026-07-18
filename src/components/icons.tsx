import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const HomeIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>
)
export const CompassIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
)
export const ReelsIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M3 8h18M8 3v18M16 3v18" /><path d="m11 11 3 1.5-3 1.5z" fill="currentColor" stroke="none" /></svg>
)
export const MessageIcon = (p: P) => (
  <svg {...base(p)}><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5z" /></svg>
)
export const BellIcon = (p: P) => (
  <svg {...base(p)}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
)
export const UserIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
)
export const SearchIcon = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
)
export const PlusIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
)
export const HeartIcon = (p: P) => (
  <svg {...base(p)}><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5C2 11 3.5 12.7 5 14l7 7z" /></svg>
)
export const HeartFilledIcon = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'currentColor' })}><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5C2 11 3.5 12.7 5 14l7 7z" /></svg>
)
export const CommentIcon = (p: P) => (
  <svg {...base(p)}><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /></svg>
)
export const ShareIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 15V3M8 7l4-4 4 4" /></svg>
)
export const BookmarkIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /></svg>
)
export const MenuIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
)
export const CloseIcon = (p: P) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const ChevronLeftIcon = (p: P) => (
  <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>
)
export const ChevronRightIcon = (p: P) => (
  <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>
)
export const SendIcon = (p: P) => (
  <svg {...base(p)}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></svg>
)
export const SettingsIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.8 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.8H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.8 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></svg>
)
export const LogoutIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
)
export const PlayIcon = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}><path d="M6 4l14 8-14 8z" /></svg>
)
export const PauseIcon = (p: P) => (
  <svg {...base({ ...p, fill: 'currentColor', stroke: 'none' })}><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
)
export const VolumeIcon = (p: P) => (
  <svg {...base(p)}><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M19 5a10 10 0 0 1 0 14M16 8a5 5 0 0 1 0 8" /></svg>
)
export const MuteIcon = (p: P) => (
  <svg {...base(p)}><path d="M11 5 6 9H2v6h4l5 4z" /><path d="m23 9-6 6M17 9l6 6" /></svg>
)
export const GamepadIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" /><rect x="2" y="6" width="20" height="12" rx="4" /></svg>
)
export const TrophyIcon = (p: P) => (
  <svg {...base(p)}><path d="M6 9H4.5A1.5 1.5 0 0 1 3 7.5V5h3M18 9h1.5A1.5 1.5 0 0 0 21 7.5V5h-3M6 5h12v6a6 6 0 0 1-12 0zM9 21h6M12 17v4" /></svg>
)
export const CheckIcon = (p: P) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
)
export const ImageIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
)
export const RefreshIcon = (p: P) => (
  <svg {...base(p)}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>
)
export const SunIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
export const MoonIcon = (p: P) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
)
