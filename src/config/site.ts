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

export type StackId = 'frontend' | 'backend' | 'redes' | 'ciberseguridad' | 'cloud';

export interface StackArea {
	id: StackId;
	title: string;
	summary: string;
	/** Idea que la figura isométrica explica como objeto físico (guía para la skill Anatomy) */
	concept: string;
	techs: string[];
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
	stack: StackArea[];
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
		{ label: 'Stack', href: '#stack' },
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
	stack: [
		{
			id: 'frontend',
			title: 'Frontend',
			summary: 'Interfaces rápidas y accesibles que envían el mínimo JavaScript necesario.',
			concept: 'Arquitectura de islas: una imprenta que estampa HTML estático y solo enciende las piezas interactivas.',
			techs: ['TypeScript', 'JavaScript', 'React', 'Astro', 'CSS'],
		},
		{
			id: 'backend',
			title: 'Backend',
			summary: 'APIs y servicios fiables, con colas y datos bien modelados.',
			concept: 'Ciclo de una petición: una clasificadora de correo que recibe, enruta, procesa en cola y despacha respuestas.',
			techs: ['Node.js', 'SQL', 'REST'],
		},
		{
			id: 'redes',
			title: 'Redes',
			summary: 'Cómo viajan los datos: enrutamiento, VLANs, filtrado y la configuración de equipos Cisco.',
			concept:
				'Enrutamiento y filtrado: un rack de 19" donde los paquetes entran por el patch panel, el firewall los inspecciona con su ACL y el router Cisco elige el siguiente salto por el prefijo más largo.',
			techs: ['Cisco IOS', 'Packet Tracer', 'Enrutamiento', 'VLAN / VLSM', 'ACL / NAT', 'SSH', 'Rust'],
		},
		{
			id: 'ciberseguridad',
			title: 'Ciberseguridad',
			summary: 'Seguridad por capas desde el diseño, no como parche final.',
			concept: 'Defensa en profundidad: una bóveda con compuertas (firewall, autenticación, cifrado) que cada petición debe superar.',
			techs: ['OWASP', 'TLS', 'IAM'],
		},
		{
			id: 'cloud',
			title: 'Cloud',
			summary: 'Infraestructura que escala sola y se despliega de forma reproducible.',
			concept: 'Autoescalado: un rack que enciende módulos de servidor cuando sube la carga y los apaga cuando baja.',
			techs: ['Docker', 'CI/CD', 'AWS'],
		},
	],
	skills: ['TypeScript', 'React', 'Astro', 'Node.js', 'SQL', 'Git'],
};
