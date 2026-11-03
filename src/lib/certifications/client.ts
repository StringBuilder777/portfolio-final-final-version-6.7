import { createClient } from '@supabase/supabase-js';

export type Certification = {
 id: string;
 title: string;
 issuer: string;
 issued_on: string | null;
 verification_url: string | null;
 document_path: string | null;
 published: boolean;
 created_at: string;
}
export type CertificationInput = Omit<Certification, 'id' | 'created_at'>;
type Database = { public: { Tables: {
 certifications: { Row: Certification; Insert: CertificationInput; Update: Partial<CertificationInput>; Relationships: [] };
 portfolio_admins: { Row: { user_id: string }; Insert: { user_id: string }; Update: { user_id?: string }; Relationships: [] };
}; Views: Record<never, never>; Functions: Record<never, never> } };
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key && !url.includes('your-project') && !key.includes('your-publishable'));
export function getClient(admin = false) {
 if (!configured) throw new Error('El servicio de certificaciones todavía no está configurado.');
 return createClient<Database>(url, key, { auth: {
  persistSession: admin, autoRefreshToken: admin, detectSessionInUrl: false,
 } });
}
export const bucket = 'certifications';
export function safeUrl(value: string | null): string | null {
 if (!value) return null;
 try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validateFile(file: File): string {
 const extensions: Record<string, string> = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
 const extension = extensions[file.type];
 if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error('Usa PDF, JPG, PNG o WebP de hasta 5 MB, sin archivos vacíos.');
 return extension;
}
export function textElement<K extends keyof HTMLElementTagNameMap>(tag: K, text: string): HTMLElementTagNameMap[K] {
 const element = document.createElement(tag); element.textContent = text; return element;
}
