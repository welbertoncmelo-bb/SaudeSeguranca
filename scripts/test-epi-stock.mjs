global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

import { Repository } from '../models/repository.js';
import { EPI, EntregaEPI, DevolucaoEPI } from '../models/records.js';

function assert(cond, message) {
  if (!cond) throw new Error(message || 'Assertion failed');
}

(async () => {
  const repo = new Repository();
  // start clean
  global.localStorage.clear();

  // create an EPI with quantidade 10
  const epi = new EPI('Capacete', 'Proteção', 10);
  repo.add(epi, 'epis');
  let stored = repo.findById(epi.id, 'epis');
  assert(stored && stored.quantidade === 10, 'EPI deve iniciar com quantidade 10');

  // create entrega concluida de 2 unidades
  const entrega = new EntregaEPI('col-1', epi.id, '2026-08-12', 2, 'Concluída');
  repo.add(entrega, 'entregas');

  // controller logic: ao salvar entrega com status Concluída, decrementa estoque
  if (entrega.status === 'Concluída') {
    const e = repo.findById(epi.id, 'epis');
    e.quantidade = Math.max(0, e.quantidade - entrega.quantidade);
    repo.update(e, 'epis');
  }

  stored = repo.findById(epi.id, 'epis');
  assert(stored.quantidade === 8, `Após entrega de 2, estoque esperado 8, obtido ${stored.quantidade}`);

  // registrar devolução de 1
  const devol = new DevolucaoEPI('col-1', epi.id, '2026-08-13', 1);
  repo.add(devol, 'devolucoes');
  const eAfterDev = repo.findById(epi.id, 'epis');
  eAfterDev.quantidade += devol.quantidade;
  repo.update(eAfterDev, 'epis');

  stored = repo.findById(epi.id, 'epis');
  assert(stored.quantidade === 9, `Após devolução de 1, estoque esperado 9, obtido ${stored.quantidade}`);

  // editar entrega: simular reversão do efeito anterior e aplicar novo valor (3)
  const previous = repo.findById(entrega.id, 'entregas');
  if (previous && previous.status === 'Concluída') {
    const prevEpi = repo.findById(previous.epiId, 'epis');
    prevEpi.quantidade += Number(previous.quantidade || 0);
    repo.update(prevEpi, 'epis');
  }

  // modificar entrega para quantidade 3
  previous.quantidade = 3;
  repo.update(previous, 'entregas');

  // aplicar novo impacto
  if (previous.status === 'Concluída') {
    const epiNow = repo.findById(epi.id, 'epis');
    epiNow.quantidade = Math.max(0, epiNow.quantidade - previous.quantidade);
    repo.update(epiNow, 'epis');
  }

  stored = repo.findById(epi.id, 'epis');
  // Note: since a devolução foi registrada entre a entrega original e a edição,
  // o estoque é ajustado levando isso em conta. Esperamos 8.
  assert(stored.quantidade === 8, `Após editar entrega para 3, estoque esperado 8, obtido ${stored.quantidade}`);

  console.log('All EPI stock tests passed.');
})();
