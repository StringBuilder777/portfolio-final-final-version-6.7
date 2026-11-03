// Source: /Users/stringbuilder/ascii/src/pieces/cisco.ts
// MIT, bas3line. See public/licenses/ascii-rest.txt. Only the type import is adapted.
/*
 * cisco: the logo with a glint crossing it every few seconds.
 * Drawn from images-3.png supplied by the user; the blue bridge and red wordmark.
 * Each cell follows the image edge, with 8 for solid ink. Canvas colours
 * are lifted on dark pages; a <pre> uses the page ink.
 * The logo is a trademark of its owner, shown here for identification.
 */
import type { Frame, Meta } from "ascii.rest";

export interface CiscoOptions {
  [key: string]: unknown;
  /** Seconds between glints; 0 keeps the logo still. */
  shine: number;
}

export const meta = {
  name: "cisco",
  category: "companies",
  note: "the cisco logo, glinting now and then",
  cols: 62,
  rows: 19,
  fps: 30,
  options: { shine: 5 },
  // The logo's 2 colours for a light page, then for a dark one; each as drawn, then twice lighter for the glint.
  palette: [
    "#114d61", "#cc002a", "#648b98", "#de5975", "#b8cad0", "#f0b3bf",
    "#176984", "#cc002a", "#689eaf", "#de5975", "#b9d2da", "#f0b3bf",
  ],
} satisfies Meta<CiscoOptions>;

// In a <pre>, in the page's own colour.
const MONO = String.raw`

                 q0p                           |00,
                 888                           |88P
          __     888     __             __,    |88P     __
         |88p    888    |88p            080    |88P    q88
  __,    |88P    888    |888     __     888    |88P    q88
  080    |88P    888    |888    |88(    888    |88P    q88
  880    |88P    888    |888    |88(    088    |88P    q88
  """     ""     888     ""'    '""     """    |88P    '""
                 Y0P                           '80"


         _qq000p,   qpp    _q000pp    __q000p(    _qq00pp_
        |8880P88(   880   |880""""   |0880P88(  _0880880880,
       |880"        880   |080pp_,   088"       q88P    |880
       |880,        880     "P8880, '888,       888p    |880
        O880pppq(   880   |p__q088'  "088pppq(  '888ppqq880"
         'Y80000(   008   |00000P"    '"80000(    "800008"

`;

// On a canvas, and the colour of each cell: an index into the logo's colours.
const ART = String.raw`

                 q0p                           |00,
                 888                           |88P
          __     888     __             __,    |88P     __
         |88p    888    |88p            080    |88P    q88
  __,    |88P    888    |888     __     888    |88P    q88
  080    |88P    888    |888    |88(    888    |88P    q88
  880    |88P    888    |888    |88(    088    |88P    q88
  """     ""     888     ""'    '""     """    |88P    '""
                 Y0P                           '80"


         _qq000p,   qpp    _q000pp    __q000p(    _qq00pp_
        |8880P88(   880   |880""""   |0880P88(  _0880880880,
       |880"        880   |080pp_,   088"       q88P    |880
       |880,        880     "P8880, '888,       888p    |880
        O880pppq(   880   |p__q088'  "088pppq(  '888ppqq880"
         'Y80000(   008   |00000P"    '"80000(    "800008"

`;
const INK = String.raw`

                 000                           0000
                 000                           0000
          00     000     00             000    0000     00
         0000    000    0000            000    0000    000
  000    0000    000    0000     00     000    0000    000
  000    0000    000    0000    0000    000    0000    000
  000    0000    000    0000    0000    000    0000    000
  000     00     000     000    000     000    0000    000
                 000                           0000


         11111111   111    1111111    11111111    11111111
        111111111   111   11111111   111111111  111111111111
       11111        111   11111111   1111       1111    1111
       11111        111     1111111 11111       1111    1111
        111111111   111   111111111  111111111  111111111111
         11111111   111   11111111    11111111    11111111

`;

const START = 0.5; // seconds before the first glint
const PASS = 2; // seconds a glint takes to cross
const HALF = 5; // half its width, in cells
const LEAN = 0.9; // cells it shifts left a row down, so it leans like a slash
const SOLID = "8dbqpPYOo0"; // what the glint turns to slashes; thin edges keep their shape

const lines = (art: string) => art.slice(1, -1).split("\n").map((line) => line.padEnd(meta.cols));

export default function cisco({ shine = meta.options.shine }: Partial<CiscoOptions> = {}): Frame {
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
