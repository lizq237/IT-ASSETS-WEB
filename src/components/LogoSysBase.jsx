export default function LogoSysBase({ width = 320 }) {
  const s = 78;
  const cx = 148;
  const cy = 200;
  const h = (s * Math.sqrt(3)) / 2;

  const top = { x: cx, y: cy - s };
  const tr = { x: cx + h, y: cy - s / 2 };
  const br = { x: cx + h, y: cy + s / 2 };
  const bot = { x: cx, y: cy + s };
  const bl = { x: cx - h, y: cy + s / 2 };
  const tl = { x: cx - h, y: cy - s / 2 };
  const mid = { x: cx, y: cy };

  const pts = (coords) => coords.map((c) => `${c.x},${c.y}`).join(' ');

  const nodeA = { x: cx - h * 0.38, y: cy - s * 0.6 };
  const nodeB = { x: cx + h * 0.38, y: cy - s * 0.6 };
  const nodeC = { x: cx, y: cy - s * 0.08 };

  const height = (width * 400) / 480;

  return (
    <svg
      viewBox="0 0 480 400"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SysBase"
    >
      <polygon points={pts([top, tr, mid, tl])} fill="#FE7F2D" />
      <polygon points={pts([tl, mid, bot, bl])} fill="#233D4D" />
      <polygon points={pts([tr, br, bot, mid])} fill="#000000" />

      <line
        x1={nodeA.x} y1={nodeA.y}
        x2={nodeB.x} y2={nodeB.y}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
      />
      <line
        x1={nodeA.x} y1={nodeA.y}
        x2={nodeC.x} y2={nodeC.y}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
      />
      <line
        x1={nodeB.x} y1={nodeB.y}
        x2={nodeC.x} y2={nodeC.y}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
      />

      <circle cx={nodeA.x} cy={nodeA.y} r={5} fill="white" />
      <circle cx={nodeB.x} cy={nodeB.y} r={5} fill="white" />
      <circle cx={nodeC.x} cy={nodeC.y} r={5} fill="white" />

      <text
        x="268"
        y="212"
        fontFamily="'Inter', 'DM Sans', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="600"
        fontSize="52"
        letterSpacing="-1.5"
        fill="#233D4D"
      >
        SysBase
      </text>
    </svg>
  );
}