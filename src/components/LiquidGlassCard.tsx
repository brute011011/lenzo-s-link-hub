/* UPDATE the border and shadow in LiquidGlassCard.tsx */
<div className="pointer-events-none absolute inset-0 z-10"
  style={{
    borderRadius: 'inherit',
    /* Ultra-thin 0.5px border for high-end look */
    border: '0.5px solid rgba(0, 0, 0, 0.1)',
    /* THE RIM LIGHT: This is the $1M line at the top */
    borderTop: '2.5px solid rgba(255, 255, 255, 0.95)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: `
      0 30px 60px -12px rgba(0, 0, 0, 0.15),
      inset 0 1px 2px rgba(255, 255, 255, 0.5)
    `,
  }}
/>
