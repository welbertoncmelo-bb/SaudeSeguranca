export class Repository {
  constructor() {
    this.setores = [];
    this.cargos = [];
    this.colaboradores = [];
    this.epis = [];
    this.entregas = [];
    this.devolucoes = [];
    this.acidentes = [];
    this.exames = [];
    this.treinamentos = [];
    this.inspecoes = [];
  }

  save() {
    localStorage.setItem('sst-data', JSON.stringify(this));
  }

  load() {
    const stored = localStorage.getItem('sst-data');
    if (stored) {
      const data = JSON.parse(stored);
      Object.assign(this, data);
    }
  }

  add(entity, collectionName) {
    this[collectionName].push(entity);
    this.save();
  }

  update(entity, collectionName) {
    const index = this[collectionName].findIndex(item => item.id === entity.id);
    if (index >= 0) {
      this[collectionName][index] = entity;
      this.save();
    }
  }

  remove(id, collectionName) {
    this[collectionName] = this[collectionName].filter(item => item.id !== id);
    this.save();
  }

  findById(id, collectionName) {
    return this[collectionName].find(item => item.id === id);
  }
}
