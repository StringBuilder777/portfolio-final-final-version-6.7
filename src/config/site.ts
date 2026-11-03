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

export type StackId = 'frontend' | 'backend' | 'redes' | 'sistemas' | 'cloud';

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
	name: 'Luis Emilaino Garcia Sifuentes',
	role: 'Desarrollador Full Stock',
	description: 'Portafolio de desarrollo web: proyectos, experiencia y contacto.',
	email: 'hola@example.com',
	lang: 'es',
	links: [
		{ label: 'GitHub', href: 'https://github.com/StringBuilder777' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
	],
	nav: [
		{ label: 'Inicio', href: '/' },
		{ label: 'Stack', href: '/stack/' },
		{ label: 'Proyectos', href: '/proyectos/' },
		{ label: 'Certificaciones', href: '/certificaciones/' },
		{ label: 'Sobre mí', href: '/sobre-mi/' },
		{ label: 'Contacto', href: '/contacto/' },
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
			summary: 'Servicios con Rust, Java/Quarkus y PHP/Laravel; datos con MySQL y PostgreSQL, y autenticación con Supabase.',
			concept: 'Ciclo de una petición: un banco de servidores compactos conectado por pistas a depósitos cilíndricos de discos; una petición simulada recorre los servicios y vuelve tras leer o escribir datos.',
			techs: ['Rust', 'REST', 'Java', 'Quarkus', 'PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'Supabase'],
		},
		{
			id: 'redes',
			title: 'Redes y seguridad',
			summary: 'Conectividad y defensa de la red: Cisco, VLANs, ACL, firewalls Fortinet y Palo Alto, e inspección con Snort.',
			concept:
				'Enrutamiento y seguridad: un rack con equipos Cisco, firewall ACL y un FortiGate adicional. La simulación muestra el filtrado ACL y la selección del siguiente salto por el prefijo más largo.',
			techs: ['Cisco IOS', 'Packet Tracer', 'Fortinet', 'Palo Alto Networks', 'Snort', 'Enrutamiento', 'VLAN / VLSM', 'ACL / NAT', 'SSH', 'TLS', 'IAM', 'OWASP', 'Rust'],
		},
		{
			id: 'sistemas',
			title: 'Sistemas y servidores',
			summary: 'Administración de Linux y servidores: servicios, usuarios, permisos, monitoreo y respaldos.',
			concept: 'Una fábrica isométrica de peluches: entran piezas por arriba, bajan a una cámara con fuego, pasan por una prensa de confección y salen a una cinta como Tux de Linux, macOS y después solo Linux.',
			techs: ['Linux', 'Bash', 'systemd', 'SSH', 'Usuarios y permisos', 'Monitoreo', 'Respaldos'],
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
