// Source: /Users/stringbuilder/ascii/src/pieces/fortinet.ts
// MIT, bas3line. See public/licenses/ascii-rest.txt. Only the type import is adapted.
/*
 * fortinet: the logo with a glint crossing it every few seconds.
 * Drawn from the Fortinet wordmark PNG supplied by the user, with its checkerboard removed.
 * Each cell follows the image edge, with 8 for solid ink. Canvas colours
 * are lifted on dark pages; a <pre> uses the page ink.
 * The logo is a trademark of its owner, shown here for identification.
 */
import type { Frame, Meta } from "ascii.rest";

export interface FortinetOptions {
  [key: string]: unknown;
  /** Seconds between glints; 0 keeps the logo still. */
  shine: number;
}

export const meta = {
  name: "fortinet",
  category: "companies",
  note: "the fortinet logo, glinting now and then",
  cols: 80,
  rows: 7,
  fps: 30,
  options: { shine: 5 },
  // The logo's 2 colours for a light page, then for a dark one; each as drawn, then twice lighter for the glint.
  palette: [
    "#000000", "#d33626", "#595959", "#e27c72", "#b3b3b3", "#f2c3be",
    "#e8ebef", "#d33626", "#f0f2f5", "#e27c72", "#f8f9fa", "#f2c3be",
  ],
} satisfies Meta<FortinetOptions>;

// In a <pre>, in the page's own colour.
const MONO = String.raw`

  pppppppppp qp0pq00p|00p, qpppppppp, qppppppp:qpp qpppppppp, qpppppppp:qppppp
  88P"""""""'""""""""'"""" 88P""""|80 ""08P""" 88P 88P""""|80 q8P"""""" ""88P"
  888888880 |888P    |888P 888888888P   08(    88P 88(    |88 q888888:    88P
  88(       |ppp,|pp,|ppp, 88(    |80   08(    88P 88(    |88 q8p______,  88P
  88(        800(8008|00P' 88(    |88   88(    88P 88(    |88 d88888888(  88P

`;

// On a canvas, and the colour of each cell: an index into the logo's colours.
const ART = String.raw`

  pppppppppp qp0pq00p|00p, qpppppppp, qppppppp:qpp qpppppppp, qpppppppp:qppppp
  88P"""""""'""""""""'"""" 88P""""|80 ""08P""" 88P 88P""""|80 q8P"""""" ""88P"
  888888880 |888P    |888P 888888888P   08(    88P 88(    |88 q888888:    88P
  88(       |ppp,|pp,|ppp, 88(    |80   08(    88P 88(    |88 q8p______,  88P
  88(        800(8008|00P' 88(    |88   88(    88P 88(    |88 d88888888(  88P

`;
const INK = String.raw`

  0000000000 1111111111111 0000000000 000000000000 0000000000 0000000000000000
  000000000011111111111111 0000000000 00000000 000 0000000000 000000000 000000
  000000000 11111    11111 0000000000   000    000 000    000 00000000    000
  000       11111111111111 000    000   000    000 000    000 0000000000  000
  000        1111111111111 000    000   000    000 000    000 0000000000  000

`;

const START = 0.5; // seconds before the first glint
const PASS = 2; // seconds a glint takes to cross
const HALF = 5; // half its width, in cells
const LEAN = 0.9; // cells it shifts left a row down, so it leans like a slash
const SOLID = "8dbqpPYOo0"; // what the glint turns to slashes; thin edges keep their shape

const lines = (art: string) => art.slice(1, -1).split("\n").map((line) => line.padEnd(meta.cols));

export default function fortinet({ shine = meta.options.shine }: Partial<FortinetOptions> = {}): Frame {
  const { cols, rows } = meta;
  const mono = lines(MONO), art = lines(ART), ink = lines(INK);
  const n = meta.palette.length / 6;
  const every = shine > 0 ? Math.max(shine, PASS + 0.5) : 0;
  // The glint crosses the logo's ink, edge to edge, rather than the whole frame.
  let lo = Infinity, hi = -Infinity;
  for (const pic of [mono, art])
    pic.forEach((line, y) => {
      for (let x = 0; x < cols; x++) if (line[x] !== " ") (lo = Math.min(lo, x + LEAN * y)), (hi = Math.max(hi, x + LEAN * y));
    });
  const span = hi - lo + 2 * HALF;

  return (t, { paper = false, color } = {}) => {
    const pic = color ? art : mono;
    const since = t - START;
    const at = every && since >= 0 ? lo - HALF + (span * (since % every)) / PASS : -Infinity;
    const out: string[] = [];
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        let ch = pic[y][x];
        if (ch !== " ") {
          const d = Math.abs(x + LEAN * y - at);
          let k = d < HALF ? 1 - d / HALF : 0;
          k = k * k * (3 - 2 * k);
          if (k > 0.55 && SOLID.includes(ch)) ch = "/";
          if (color) color[y * cols + x] = (paper ? 0 : 3 * n) + (k > 0.6 ? 2 : k > 0.25 ? 1 : 0) * n + parseInt(ink[y][x], 36);
        }
        line += ch;
      }
      out.push(line);
    }
    return out.join("\n");
  };
}
