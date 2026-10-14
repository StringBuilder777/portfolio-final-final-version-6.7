// Tipos de gl.mjs (copia literal del kit Anatomy, que no trae declaraciones).
export interface GlCamera {
	origin: [number, number];
	k: number;
	cam: [number, number, number, number];
}
export type UniformValue = number | number[] | Float32Array;
export interface GlLayer {
	gl: WebGLRenderingContext;
	extensions: string[];
	set(values: Record<string, UniformValue>): void;
	draw(values: Record<string, UniformValue>, time: number): void;
	clear(): void;
}
export const GLSL_ISO: string;
export function glCamera(projection: { origin: [number, number]; scale: number; azimuth?: number; elevation?: number }): GlCamera;
export function glLayer(options: {
	canvas: HTMLCanvasElement;
	fragment: string;
	view: [number, number];
	camera: GlCamera;
	uniforms?: string[];
	fixed?: Record<string, UniformValue>;
	extensions?: string[];
	maxRatio?: number;
	onError?: (message: string) => void;
}): GlLayer | null;
export function smooth(a: number, b: number, x: number): number;
export function burst(age: number, rise: number, fall: number): number;
export function settle(state: { x: number; v: number }, target: number, dt: number, seconds: number, calm?: boolean): boolean;
