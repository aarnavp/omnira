import { mulberry32 } from "@/lib/utils/random";

/**
 * The hero's signature: a field of idle devices, most dim, a handful lit
 * and briefly wired together. It is the mission statement rendered as a
 * picture — idle hardware becoming active infrastructure — instead of
 * restated in a headline. The layout is seeded, not random, so server and
 * client render the same markup.
 */

const COLUMNS = 22;
const ROWS = 10;

interface Node {
  x: number;
  y: number;
  active: boolean;
  delay: number;
}

function buildNodes(): Node[] {
  const rng = mulberry32(20260806);
  const nodes: Node[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      const jitterX = (rng() - 0.5) * 2.2;
      const jitterY = (rng() - 0.5) * 2.2;
      nodes.push({
        x: (col / (COLUMNS - 1)) * 100 + jitterX,
        y: (row / (ROWS - 1)) * 100 + jitterY,
        active: rng() > 0.86,
        delay: rng() * 3.2,
      });
    }
  }
  return nodes;
}

function buildLinks(nodes: Node[]): [Node, Node][] {
  const active = nodes.filter((n) => n.active);
  const rng = mulberry32(77);
  const links: [Node, Node][] = [];
  for (let i = 0; i < active.length; i += 1) {
    if (rng() > 0.55) continue;
    const target = active[(i + 1 + Math.floor(rng() * 3)) % active.length];
    if (target && target !== active[i]) links.push([active[i], target]);
  }
  return links;
}

export function DeviceLattice({ className }: { className?: string }) {
  const nodes = buildNodes();
  const links = buildLinks(nodes);

  return (
    <svg
      viewBox="0 0 100 46"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y * 0.46}
          x2={b.x}
          y2={b.y * 0.46}
          stroke="var(--color-signal-500)"
          strokeWidth="0.08"
          opacity="0.35"
        />
      ))}
      {nodes.map((node, i) => (
        <rect
          key={i}
          x={node.x - 0.35}
          y={node.y * 0.46 - 0.35}
          width="0.7"
          height="0.7"
          rx="0.15"
          fill={node.active ? "var(--color-signal-400)" : "var(--color-canvas-text-muted)"}
          className="animate-[pulse-node_3.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${node.delay}s`, opacity: node.active ? 1 : undefined }}
        />
      ))}
    </svg>
  );
}
