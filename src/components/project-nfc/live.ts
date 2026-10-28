export function mount(root: HTMLElement) {
	const phone = root.querySelector<SVGGElement>('[data-phone]');
	const readout = root.querySelector<HTMLElement>('[data-readout]');
	if (!phone || !readout) return;
	const x = Number(root.dataset.x);
	const y = Number(root.dataset.y);
	const dx = Number(root.dataset.dx);
	const dy = Number(root.dataset.dy);
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	let visible = false;
	let frame = 0;
	let start = 0;

	function draw(progress: number) {
		const smooth = (value: number) => {
			const t = Math.min(1, Math.max(0, value));
			return t * t * (3 - 2 * t);
		};
		const approach = smooth((progress - 0.08) / 0.28);
		const retreat = smooth((progress - 0.70) / 0.22);
		const ease = approach * (1 - retreat);
		phone!.setAttribute('transform', `translate(${(x + dx * ease).toFixed(2)} ${(y + dy * ease).toFixed(2)})`);
		const registered = progress >= 0.38 && progress < 0.76;
		root.toggleAttribute('data-scanning', progress >= 0.32 && progress < 0.68);
		root.toggleAttribute('data-registered', registered);
		readout!.textContent = registered ? 'Acceso registrado' : 'Acercando gafete';
	}
	function tick(now: number) {
		if (!start) start = now;
		draw(((now - start) % 7000) / 7000);
		frame = requestAnimationFrame(tick);
	}
	function update() {
		cancelAnimationFrame(frame);
		frame = 0;
		start = 0;
		if (reduced.matches) draw(0.5);
		else if (visible) frame = requestAnimationFrame(tick);
	}
	new IntersectionObserver((entries) => {
		visible = entries[entries.length - 1].isIntersecting;
		update();
	}).observe(root);
	reduced.addEventListener('change', update);
}
