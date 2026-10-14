// Fuente única de los datos del portafolio. Edita aquí el contenido.

export interface Link {
	label: string;
	href: string;
}

export interface Project {
	title: string;
	description: string;
	tags: string[];
	url?: string;
	repo?: string;
}

export interface Site {
	name: string;
	role: string;
	description: string;
	email: string;
	lang: string;
	links: Link[];
	nav: Link[];
	projects: Project[];
	skills: string[];
}

export const site: Site = {
	name: 'Tu Nombre',
	role: 'Desarrollador Full Stack',
	description: 'Portafolio de desarrollo web: proyectos, experiencia y contacto.',
	email: 'hola@example.com',
	lang: 'es',
	links: [
		{ label: 'GitHub', href: 'https://github.com/StringBuilder777' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
	],
	nav: [
		{ label: 'Proyectos', href: '#proyectos' },
		{ label: 'Sobre mí', href: '#sobre-mi' },
		{ label: 'Contacto', href: '#contacto' },
	],
	projects: [
		{
			title: 'Proyecto uno',
			description: 'Descripción breve del problema que resuelve y tu papel en él.',
			tags: ['Astro', 'TypeScript'],
			repo: 'https://github.com/StringBuilder777',
		},
		{
			title: 'Proyecto dos',
			description: 'Descripción breve del problema que resuelve y tu papel en él.',
			tags: ['React', 'Node.js'],
		},
	],
	skills: ['TypeScript', 'React', 'Astro', 'Node.js', 'SQL', 'Git'],
};
