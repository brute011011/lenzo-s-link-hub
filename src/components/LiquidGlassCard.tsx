/* UPDATE the border and shadow in LiquidGlassCard.tsx */
<div className="pointer-events-none absolute inset-0 z-10"
  style={{
    borderRadius: 'inherit',
    /* 0.5px is thinner and sharper for the Apple look */
    border: '0.5px solid rgba(0, 0, 0, 0.08)',
    /* THE RIM LIGHT: This is the bright line at the top */
    borderTop: '2.5px solid rgba(255, 255, 255, 0.95)',
    borderLeft: '1.2px solid rgba(255, 255, 255, 0.4)',
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.6)
    `,
  }}
/>
