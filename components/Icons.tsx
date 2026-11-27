type P = { className?: string };
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IconHome = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M10 19.5v-5h4v5" /></svg>);
export const IconPen = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></svg>);
export const IconBars = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 20h16" /><path d="M7 16V9" /><path d="M12 16V5" /><path d="M17 16v-4" /></svg>);
export const IconLeaf = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19 13 11" /></svg>);
export const IconGear = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></svg>);
export const IconCheck = ({ className = 'h-4 w-4' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.6}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const IconPhone = ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const IconClose = ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconChat = ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>);
export const IconPaw = ({ className = 'h-5 w-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><ellipse cx="12" cy="15.5" rx="4.6" ry="3.8" /><circle cx="6" cy="10.5" r="2" /><circle cx="9.5" cy="6.5" r="2" /><circle cx="14.5" cy="6.5" r="2" /><circle cx="18" cy="10.5" r="2" /></svg>
);
export const IconFlame = ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21c-4 0-6.5-2.6-6.5-6 0-4 3.5-5.5 4-10 3 2 3.5 4 3.5 6 1-1 1.5-2 1.5-3 2 1.5 4 4 4 7 0 3.4-2.5 6-6.5 6Z" /></svg>);
export const IconCamera = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>);
