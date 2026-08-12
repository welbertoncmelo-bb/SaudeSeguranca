import { Repository } from './repository.js';
import { AppController } from './controller.js';

const repository = new Repository();
const app = new AppController(repository);
window.app = app;

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
	menuToggle.addEventListener('click', () => {
		const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!expanded));
		document.body.classList.toggle('menu-open');
	});
}
