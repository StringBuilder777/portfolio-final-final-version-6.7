// Source: /Users/stringbuilder/ascii/src/pieces/snort.ts
// MIT, bas3line. See public/licenses/ascii-rest.txt. Only the type import is adapted.
/*
 * snort: the logo with a glint crossing it every few seconds.
 * Drawn from images-2.png supplied by the user; the pink Snort mascot.
 * Each cell follows the image edge, with 8 for solid ink. Canvas colours
 * are lifted on dark pages; a <pre> uses the page ink. The monochrome
 * drawing keeps the dark outlines so the face and snout remain visible.
 * The logo is a trademark of its owner, shown here for identification.
 */
import type { Frame, Meta } from "ascii.rest";

export interface SnortOptions {
  [key: string]: unknown;
  /** Seconds between glints; 0 keeps the logo still. */
  shine: number;
}

export const meta = {
  name: "snort",
  category: "logos",
  note: "the snort logo, glinting now and then",
  cols: 70,
  rows: 30,
  fps: 30,
  options: { shine: 5 },
  // The logo's 5 colours for a light page, then for a dark one; each as drawn, then twice lighter for the glint.
  palette: [
    "#241f1e", "#f9a9ae", "#f78f96", "#ffd3d4", "#ffffff", "#716d6d",
    "#fbc7ca", "#fab6bb", "#ffe2e3", "#ffffff", "#bdbcbc", "#fde5e7",
    "#fddde0", "#fff2f2", "#ffffff", "#e8ebef", "#f9a9ae", "#f78f96",
    "#ffd3d4", "#ffffff", "#f0f2f5", "#fbc7ca", "#fab6bb", "#ffe2e3",
    "#ffffff", "#f8f9fa", "#fde5e7", "#fddde0", "#fff2f2", "#ffffff",
  ],
} satisfies Meta<SnortOptions>;

// In a <pre>, in the page's own colour.
const MONO = String.raw`

                      _qp
               qppppq0"'8p  ___pqpp__,
               88,'''    "bP""'   ''"8q,    _
               |8(    |P         _pqp '8p_pP8p
                0p   _0         p"  8   |0.  8p
               q00  _0'            p8Y"_ 8O8bo0.
             _P" 800P             'b" |( 8
           _0"                           '"bqq___             __
     __p,_|0                                  '""P80000qq000088880p,
   |0P"   '":                                         __pd""''''"88p
   |0p,                                            _q0"'   _,    |88
     '|0b:                                      _q0P'  __p""     |8"
    _0"                                       _q0"   _q80"   _-: 0P
   |0"                                      _qP"   _088P' _q0P  qP
   q(                                     _q0"   _0880P _q00"  pP
  |0                     |_              |0P   _q888P' q08P' _0"
  |8                      "0p,          q0'   |0880" _080"  |0'
   8p _,P             _p   '00p       _0P   _q880"  q88P' _pP
   _80"                    |0P80,    |0P   |088P' _080"  q0'
  |0P    _p               _08, "0p  |0P   |08P"  |00"  q0"
  88p__o"80p____    ___,dP0pqP  "8p 0P   |0P'   |P" _q0"
   '''      ''""""88PPb,   ''    |8p8    "      ' _p0"
             qP"'__"8q,8          '88,        __q0P'
            '0p,'"80p,"8,          Y00p_____q00P"
              "P8ood08p"0,          '"8888P""
                      8 8"
                     _Pp"
                    )8"

`;

// On a canvas, and the colour of each cell: an index into the logo's colours.
const ART = String.raw`

                      _qp
               qppppq0888p  __pqpppp__
               88888888888p08888888888p_    _
               |888888888888888888888888p_q08p
               '088888888888888888888888888888p
              _q0888888888888888888888888808000(
             q0888888888888888888888888880,
           _08888888888888888888888888888880pp____           ____
    __qpp_q0888888888888888888888888888888888888888800000000888880p,
   |0888888888888888888888888888888888888888888888888888888888888880
   |0888888888888888888888888888888888888888888888888888888888888880
     "8888888888888888888888888888888888888888888888888888888888888P
    |0888888888888888888888888888888888888888888888888888888888888P
   |0888888888888888888888888888888888888888888888888888888888888P
   0888888888888888888888888888888888888888888888888888888888888P
  |888888888888888888888888888888888888888888888888888888888880P
  |88888888888888888888888888888888888888888888888888888888880"
  '088888888888888888888888888888888888888888888888888888880P
   |8888888888888888888888888088888888888888888888888888880"
  |08888888888888888888888880, "0888888888888888888888880"
  088880P808888888888880080880  |8888888888888888888880"
   '"'     ''"""""88888,   "'    88888888888888888880"
            _q0888888880.         '888888888888880P'
            "08888888880,          888888888880P"
              "8800000880,          '"80008P"'
                     '888(
                     |88P
                   _p0"'

`;
const INK = String.raw`

                      000
               00000001100  0000000000
               0011111111100111111111000    0
               0011111122111111111000330000000
               30011110221111113033303331011100
              2000111022211111133330033310000000
             002200002111111111113333333100
           002222222211111111111111111111110000002           2002
    0000000022222222111111111111111111111111111110000000000000000000
   00011111122222222111111111111111111111111111111111111003333333000
   00011111111122222111111111111111111111111111111110033333333333300
     000022221111221111111111111111111111111111110003333003333333000
    002222222211111111111111111111111111111111100333330003333333300
   002222221111111111111111111111111111111111003333300003330003300
   02222211111111111111222111111111111111110033333000003300033300
  00222222211111111111122222211111111111110033330000033000033300
  0022222221111111111111112002221111111100333330000333000333300
  00222221111111111111101112002222212220033330000333000033300
   000111111222211111111112200002222220033330000333000333000
  0001111102222222111112222000 000222033333000333300333000
  0001110000222222222222000000  000200333300333330333000
   000     2000000000000   00    000033333333333333000
            0001111100103         000333333333330000
            0001100001000          00003333300000
              000000001100          0000000000
                     00100
                     0000
                   00000

`;

const START = 0.5; // seconds before the first glint
const PASS = 2; // seconds a glint takes to cross
const HALF = 5; // half its width, in cells
const LEAN = 0.9; // cells it shifts left a row down, so it leans like a slash
const SOLID = "8dbqpPYOo0"; // what the glint turns to slashes; thin edges keep their shape

const lines = (art: string) => art.slice(1, -1).split("\n").map((line) => line.padEnd(meta.cols));

export default function snort({ shine = meta.options.shine }: Partial<SnortOptions> = {}): Frame {
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
