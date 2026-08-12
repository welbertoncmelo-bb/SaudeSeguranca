import { Repository } from './repository.js';
import { AppController } from './controller.js';

const repository = new Repository();
const app = new AppController(repository);
window.app = app;
