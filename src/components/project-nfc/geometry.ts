import * as k from '@/lib/iso/iso-kit';

// El teléfono flota frente al gafete y desciende hacia él para leerlo.
const W = 480;
const H = 560;
const bounds = { x: 0, y: -125, w: 140, d: 195, r: 0 };
const P = k.fitProjection(k.boxCorners(bounds, 0, 165), W, H, { pad: 34, azimuth: 75, elevation: 65 });
const solid = (plan: k.Plan, z: number, h: number, tone: k.Tone = 'mid') =>
	k.solidSvg(k.slabOf(plan, z, h, P, 6, Math.min(h / 3, 1)), { tone });
const rect = (x: number, y: number, w: number, d: number, r = 1): k.Plan => ({ x, y, w, d, r });
const top = (plan: k.Plan, z: number, cls: string) => `<path class="${cls}" d="${k.planOutline(plan, z, P, 6)}"/>`;
const print = (x: number, y: number, z: number, text: string, size = 5) =>
	k.faceTextSvg(k.topMatrix([x, y], z, P), text, { size, tone: 'hi' });

export function build() {
	const out: string[] = [];
	// Cinta continua por detrás del gafete, con costura y broche en la ranura.
	const at = (point: k.Point3) => k.iso(point, P).map((v) => v.toFixed(1)).join(' ');
	const ribbon = `M${at([62, -54, 5])} C${at([35, -78, 24])} ${at([3, -112, 43])} ${at([32, -115, 52])} C${at([58, -125, 59])} ${at([104, -112, 51])} ${at([100, -91, 31])} C${at([96, -75, 20])} ${at([82, -63, 11])} ${at([74, -54, 5])}`;
	out.push(`<path class="nfc-ribbon-edge" d="${ribbon}"/><path class="nfc-ribbon" d="${ribbon}"/><path class="nfc-ribbon-stitch" d="${ribbon}"/>`);
	// Gafete con elementos impresos en su superficie.
	out.push(solid(rect(14, -63, 108, 126, 5), 0, 3, 'lo'));
	out.push(solid(rect(20, -57, 96, 114, 4), 3, 2, 'hi'));
	out.push(top(rect(24, -53, 88, 106, 3), 5.1, 'iso-line'));
	out.push(solid(rect(57, -55, 22, 4, 2), 5, 1, 'lo'));
	out.push(solid(rect(63, -59, 10, 9, 2), 6, 1.5, 'mid'));
	out.push(top(rect(65, -57, 6, 5, 1), 7.6, 'iso-line'));
	out.push(solid(rect(28, -40, 30, 34, 3), 5, 0.7, 'lo'));
	out.push(top(rect(33, -34, 20, 20, 10), 5.8, 'iso-line'));
	out.push(print(28, 49, 5.8, 'HACK', 6.5));
	for (let i = 0; i < 3; i++) out.push(solid(rect(67, -14 + i * 6, 31 - i * 5, 1.2, 0.5), 5, 0.5, 'lo'));
	out.push(solid(rect(28, 9, 64, 2, 0.5), 5, 0.5, 'lo'));
	out.push(solid(rect(28, 17, 50, 2, 0.5), 5, 0.5, 'lo'));
	out.push(solid(rect(88, 25, 17, 17, 2), 5, 0.6, 'mid'));
	for (let i = 0; i < 3; i++) out.push(top(rect(90 + i * 2, 27 + i * 2, 13 - i * 4, 13 - i * 4, 1), 5.7, 'iso-line'));
	// Ondas del lector: permanecen ocultas hasta el momento de la lectura.
	out.push(`<g class="nfc-signal" aria-hidden="true">${[12, 18, 24].map((radius, i) => `<path class="nfc-wave nfc-wave-${i}" d="${k.ring(96, 33, radius, 6.2, P, 48)}"/>`).join('')}</g>`);
	// El conjunto se traslada entero: pantalla, botones y cámara siguen al teléfono.
	const phone: string[] = [];
	phone.push(solid(rect(-119, -51, 78, 104, 8), 8, 7, 'hi'));
	phone.push(solid(rect(-115, -47, 70, 96, 6), 15, 1.2, 'lo'));
	phone.push(solid(rect(-111, -41, 62, 82, 4), 16.2, 0.5, 'hi'));
	phone.push(solid(rect(-91, -44, 22, 2.5, 1), 16.8, 0.4, 'lo'));
	phone.push(solid(rect(-104, -43, 4, 4, 2), 16.8, 0.4, 'lo'));
	phone.push(solid(rect(-93, 44, 18, 2, 1), 16.8, 0.4, 'lo'));
	for (const y of [-25, -13, 6]) phone.push(solid(rect(-121, y, 2, 8, 0.7), 10, 3, 'mid'));
	phone.push(print(-104, -25, 17, 'STAFF APP', 5));
	phone.push(solid(rect(-103, -18, 46, 1.2, 0.4), 17, 0.3, 'lo'));
	phone.push(`<g class="nfc-wait">${print(-103, -4, 17, 'ACERCAR', 5)}${print(-103, 5, 17, 'GAFETE NFC', 5)}</g>`);
	phone.push(`<g class="nfc-success">${print(-104, -2, 17, 'REGISTRADO', 5)}${print(-104, 8, 17, 'ACCESO', 4)}</g>`);
	phone.push(solid(rect(-104, 24, 47, 7, 3), 17, 0.4, 'lo'));
	const [x0, y0] = k.iso([0, 0, 0], P);
	const [startX, startY] = k.iso([140, 0, 145], P);
	const [endX, endY] = k.iso([140, 0, 34], P);
	const x = startX - x0;
	const y = startY - y0;
	out.push(`<g data-phone transform="translate(${x} ${y})">${phone.join('')}</g>`);
	return { svg: k.figureSvg({ width: W, height: H, label: 'Un teléfono se acerca al frente de un gafete NFC y confirma el registro de acceso.', body: out }), x, y, dx: endX - startX, dy: endY - startY };
}
