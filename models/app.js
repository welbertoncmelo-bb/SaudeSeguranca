class BaseRecord {
  constructor(id) {
    this.id = id || BaseRecord.generateId();
  }

  static generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}

class Setor extends BaseRecord {
  constructor(nome, descricao, id) {
    super(id);
    this.nome = nome;
    this.descricao = descricao;
  }
}

class Cargo extends BaseRecord {
  constructor(nome, descricao, id) {
    super(id);
    this.nome = nome;
    this.descricao = descricao;
  }
}

class Colaborador extends BaseRecord {
  constructor(nome, email, setorId, cargoId, id) {
    super(id);
    this.nome = nome;
    this.email = email;
    this.setorId = setorId;
    this.cargoId = cargoId;
  }
}

class EPI extends BaseRecord {
  constructor(nome, categoria, quantidade, id) {
    super(id);
    this.nome = nome;
    this.categoria = categoria;
    this.quantidade = quantidade;
  }
}

class EntregaEPI extends BaseRecord {
  constructor(colaboradorId, epiId, dataEntrega, quantidade, status, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.epiId = epiId;
    this.dataEntrega = dataEntrega;
    this.quantidade = quantidade;
    this.status = status;
  }
}

class DevolucaoEPI extends BaseRecord {
  constructor(colaboradorId, epiId, dataDevolucao, quantidade, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.epiId = epiId;
    this.dataDevolucao = dataDevolucao;
    this.quantidade = quantidade;
  }
}

class Acidente extends BaseRecord {
  constructor(colaboradorId, data, descricao, gravidade, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.data = data;
    this.descricao = descricao;
    this.gravidade = gravidade;
  }
}

class ExameMedico extends BaseRecord {
  constructor(colaboradorId, data, tipo, resultado, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.data = data;
    this.tipo = tipo;
    this.resultado = resultado;
  }
}

class Treinamento extends BaseRecord {
  constructor(colaboradorId, curso, data, status, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.curso = curso;
    this.data = data;
    this.status = status;
  }
}

class Inspecao extends BaseRecord {
  constructor(inspetor, local, data, status, notas, id) {
    super(id);
    this.inspetor = inspetor;
    this.local = local;
    this.data = data;
    this.status = status;
    this.notas = notas;
  }
}

class Repository {
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

class AppController {
  constructor(repository) {
    this.repository = repository;
    this.activeFilter = null;
    this.setupPages();
    this.cacheElements();
    this.setupListeners();
    this.repository.load();
    this.initSampleData();
    this.refreshAll();
    this.switchPage('dashboard');
  }

  setupPages() {
    this.pages = [...document.querySelectorAll('.page')];
    this.menuButtons = [...document.querySelectorAll('.menu button')];
  }

  cacheElements() {
    this.summaryCounts = {
      colaboradores: document.getElementById('summary-colaboradores'),
      epis: document.getElementById('summary-epis'),
      exames: document.getElementById('summary-exames'),
      inspecoes: document.getElementById('summary-inspecoes'),
    };

    this.reportFields = {
      colaboradores: document.getElementById('report-colaboradores'),
      epis: document.getElementById('report-epis'),
      acidentes: document.getElementById('report-acidentes'),
      exames: document.getElementById('report-exames'),
      treinamentos: document.getElementById('report-treinamentos'),
      inspecoes: document.getElementById('report-inspecoes'),
      pendentes: document.getElementById('report-pendentes'),
      vencidos: document.getElementById('report-vencidos'),
    };

    this.tables = {
      colaboradores: document.querySelector('#table-colaboradores tbody'),
      setores: document.querySelector('#table-setores tbody'),
      cargos: document.querySelector('#table-cargos tbody'),
      epis: document.querySelector('#table-epis tbody'),
      devolucoes: document.querySelector('#table-devolucoes tbody'),
      acidentes: document.querySelector('#table-acidentes tbody'),
      exames: document.querySelector('#table-exames tbody'),
      treinamentos: document.querySelector('#table-treinamentos tbody'),
      inspecoes: document.querySelector('#table-inspecoes tbody'),
    };

    this.selects = {
      colaboradorSetor: document.getElementById('colaborador-setor'),
      colaboradorCargo: document.getElementById('colaborador-cargo'),
      entregaColaborador: document.getElementById('entrega-colaborador'),
      entregaEpi: document.getElementById('entrega-epi'),
      devolucaoColaborador: document.getElementById('devolucao-colaborador'),
      devolucaoEpi: document.getElementById('devolucao-epi'),
      acidenteColaborador: document.getElementById('acidente-colaborador'),
      exameColaborador: document.getElementById('exame-colaborador'),
      treinamentoColaborador: document.getElementById('treinamento-colaborador'),
    };

    this.forms = {
      colaborador: document.getElementById('form-colaborador'),
      setor: document.getElementById('form-setor'),
      cargo: document.getElementById('form-cargo'),
      epi: document.getElementById('form-epi'),
      entrega: document.getElementById('form-entrega'),
      devolucao: document.getElementById('form-devolucao'),
      acidente: document.getElementById('form-acidente'),
      exame: document.getElementById('form-exame'),
      treinamento: document.getElementById('form-treinamento'),
      inspecao: document.getElementById('form-inspecao'),
    };

    this.graphElements = {
      acidenteChart: document.getElementById('acidente-chart'),
      chartSummary: document.getElementById('chart-summary'),
    };

    this.reportPreview = document.getElementById('report-preview');
    this.reportButtons = {
      generate: document.getElementById('generate-report'),
      print: document.getElementById('print-report'),
    };
  }

  setupListeners() {
    this.menuButtons.forEach(button => {
      button.addEventListener('click', () => this.switchPage(button.dataset.target));
    });

    this.forms.colaborador.addEventListener('submit', e => this.saveColaborador(e));
    document.getElementById('colaborador-limpar').addEventListener('click', () => this.clearForm('colaborador'));

    this.forms.setor.addEventListener('submit', e => this.saveSetor(e));
    document.getElementById('setor-limpar').addEventListener('click', () => this.clearForm('setor'));

    this.forms.cargo.addEventListener('submit', e => this.saveCargo(e));
    document.getElementById('cargo-limpar').addEventListener('click', () => this.clearForm('cargo'));

    this.forms.epi.addEventListener('submit', e => this.saveEPI(e));
    document.getElementById('epi-limpar').addEventListener('click', () => this.clearForm('epi'));

    this.forms.entrega.addEventListener('submit', e => this.saveEntrega(e));
    document.getElementById('entrega-limpar').addEventListener('click', () => this.clearForm('entrega'));
    document.getElementById('open-entrega-form').addEventListener('click', () => this.toggleActionForm('entrega', true));
    document.getElementById('close-entrega-form').addEventListener('click', () => this.toggleActionForm('entrega', false));

    this.forms.devolucao.addEventListener('submit', e => this.saveDevolucao(e));
    document.getElementById('devolucao-limpar').addEventListener('click', () => this.clearForm('devolucao'));
    document.getElementById('open-devolucao-form').addEventListener('click', () => this.toggleActionForm('devolucao', true));
    document.getElementById('close-devolucao-form').addEventListener('click', () => this.toggleActionForm('devolucao', false));

    this.forms.acidente.addEventListener('submit', e => this.saveAcidente(e));
    document.getElementById('acidente-limpar').addEventListener('click', () => this.clearForm('acidente'));

    this.forms.exame.addEventListener('submit', e => this.saveExame(e));
    document.getElementById('exame-limpar').addEventListener('click', () => this.clearForm('exame'));

    this.forms.treinamento.addEventListener('submit', e => this.saveTreinamento(e));
    document.getElementById('treinamento-limpar').addEventListener('click', () => this.clearForm('treinamento'));

    this.forms.inspecao.addEventListener('submit', e => this.saveInspecao(e));
    document.getElementById('inspecao-limpar').addEventListener('click', () => this.clearForm('inspecao'));

    this.reportButtons.generate.addEventListener('click', () => this.generateReportPreview());
    this.reportButtons.print.addEventListener('click', () => this.printReport());
    // Consulta (busca) elements
    this.search = {
      query: document.getElementById('consulta-query'),
      tipo: document.getElementById('consulta-tipo'),
      btn: document.getElementById('consulta-buscar'),
      resultTable: document.querySelector('#consulta-result .results-table tbody')
    };

    if (this.search.btn) {
      this.search.btn.addEventListener('click', () => this.performSearch());
      this.search.query.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.performSearch(); });
    }
  }

  switchPage(pageId) {
    this.pages.forEach(page => page.classList.toggle('active', page.id === pageId));
    this.menuButtons.forEach(button => button.classList.toggle('active', button.dataset.target === pageId));
  }

  clearForm(formName) {
    const form = this.forms[formName];
    form.reset();
    const hidden = form.querySelector('input[type="hidden"]');
    if (hidden) hidden.value = '';
    this.clearFilter();
  }

  initSampleData() {
    if (this.repository.setores.length === 0) {
      const setor1 = new Setor('Produção', 'Linha de montagem');
      const setor2 = new Setor('Qualidade', 'Controle de qualidade');
      const cargo1 = new Cargo('Operador', 'Atende máquinas');
      const cargo2 = new Cargo('Supervisor', 'Supervisiona equipe');
      this.repository.add(setor1, 'setores');
      this.repository.add(setor2, 'setores');
      this.repository.add(cargo1, 'cargos');
      this.repository.add(cargo2, 'cargos');
      const col1 = new Colaborador('Ana Silva', 'ana.silva@empresa.com', setor1.id, cargo1.id);
      const col2 = new Colaborador('Bruno Souza', 'bruno.souza@empresa.com', setor2.id, cargo2.id);
      this.repository.add(col1, 'colaboradores');
      this.repository.add(col2, 'colaboradores');
      const epi1 = new EPI('Capacete', 'Proteção de cabeça', 25);
      const epi2 = new EPI('Óculos de proteção', 'Proteção ocular', 40);
      this.repository.add(epi1, 'epis');
      this.repository.add(epi2, 'epis');
      const entrega1 = new EntregaEPI(col1.id, epi1.id, '2026-06-10', 1, 'Concluída');
      const acidente1 = new Acidente(col2.id, '2026-05-22', 'Escorregou no piso úmido', 'Leve');
      const exame1 = new ExameMedico(col1.id, '2026-05-05', 'Audiometria', 'Aprovado');
      const treinamento1 = new Treinamento(col2.id, 'Treinamento de Brigada', '2026-06-05', 'Concluído');
      const insp1 = new Inspecao('Carlos Alves', 'Armazém', '2026-06-12', 'Aprovado', 'Sem irregularidades');
      this.repository.add(entrega1, 'entregas');
      this.repository.add(acidente1, 'acidentes');
      this.repository.add(exame1, 'exames');
      this.repository.add(treinamento1, 'treinamentos');
      this.repository.add(insp1, 'inspecoes');
    }
  }

  refreshAll() {
    this.renderSelects();
    this.renderTables();
    this.renderSummary();
    this.renderReports();
  }

  renderSelects() {
    const options = list => list.map(item => `<option value="${item.id}">${item.nome || item.curso || item.local || item.email}</option>`).join('');

    this.selects.colaboradorSetor.innerHTML = `<option value="">Selecione</option>${options(this.repository.setores)}`;
    this.selects.colaboradorCargo.innerHTML = `<option value="">Selecione</option>${options(this.repository.cargos)}`;
    this.selects.entregaColaborador.innerHTML = `<option value="">Selecione</option>${options(this.repository.colaboradores.map(c => ({ id: c.id, nome: c.nome })))}
`;
    this.selects.entregaEpi.innerHTML = `<option value="">Selecione</option>${options(this.repository.epis)}`;
    this.selects.acidenteColaborador.innerHTML = `<option value="">Selecione</option>${options(this.repository.colaboradores.map(c => ({ id: c.id, nome: c.nome })))}
`;
    this.selects.exameColaborador.innerHTML = `<option value="">Selecione</option>${options(this.repository.colaboradores.map(c => ({ id: c.id, nome: c.nome })))}
`;
    this.selects.treinamentoColaborador.innerHTML = `<option value="">Selecione</option>${options(this.repository.colaboradores.map(c => ({ id: c.id, nome: c.nome })))}
`;
  }

  renderTables() {
    const filterData = (collection) => {
      if (!this.activeFilter) return collection;
      return collection.filter(item => item.id === this.activeFilter.id);
    };

    this.tables.setores.innerHTML = filterData(this.repository.setores).map(setor => `
      <tr>
        <td>${setor.nome}</td>
        <td>${setor.descricao}</td>
        <td><button onclick="app.editSetor('${setor.id}')">Editar</button> <button onclick="app.deleteSetor('${setor.id}')">Excluir</button></td>
      </tr>
    `).join('');

    this.tables.cargos.innerHTML = filterData(this.repository.cargos).map(cargo => `
      <tr>
        <td>${cargo.nome}</td>
        <td>${cargo.descricao}</td>
        <td><button onclick="app.editCargo('${cargo.id}')">Editar</button> <button onclick="app.deleteCargo('${cargo.id}')">Excluir</button></td>
      </tr>
    `).join('');

    this.tables.colaboradores.innerHTML = filterData(this.repository.colaboradores).map(colaborador => {
      const setor = this.repository.findById(colaborador.setorId, 'setores');
      const cargo = this.repository.findById(colaborador.cargoId, 'cargos');
      return `
      <tr>
        <td>${colaborador.nome}</td>
        <td>${colaborador.email}</td>
        <td>${setor ? setor.nome : 'Não informado'}</td>
        <td>${cargo ? cargo.nome : 'Não informado'}</td>
        <td><button onclick="app.editColaborador('${colaborador.id}')">Editar</button> <button onclick="app.deleteColaborador('${colaborador.id}')">Excluir</button></td>
      </tr>
    `;
    }).join('');

    this.tables.epis.innerHTML = filterData(this.repository.epis).map(epi => `
      <tr>
        <td>${epi.nome}</td>
        <td>${epi.categoria}</td>
        <td>${epi.quantidade}</td>
        <td><button onclick="app.editEPI('${epi.id}')">Editar</button> <button onclick="app.deleteEPI('${epi.id}')">Excluir</button></td>
      </tr>
    `).join('');

    this.tables.devolucoes.innerHTML = filterData(this.repository.devolucoes).map(devolucao => {
      const colaborador = this.repository.findById(devolucao.colaboradorId, 'colaboradores');
      const epi = this.repository.findById(devolucao.epiId, 'epis');
      return `
      <tr>
        <td>${colaborador ? colaborador.nome : 'Não informado'}</td>
        <td>${epi ? epi.nome : 'Não informado'}</td>
        <td>${devolucao.quantidade}</td>
        <td>${devolucao.dataDevolucao}</td>
        <td><button onclick="app.editDevolucao('${devolucao.id}')">Editar</button> <button onclick="app.deleteDevolucao('${devolucao.id}')">Excluir</button></td>
      </tr>
    `;
    }).join('');

    this.tables.acidentes.innerHTML = filterData(this.repository.acidentes).map(acidente => {
      const colaborador = this.repository.findById(acidente.colaboradorId, 'colaboradores');
      return `
      <tr>
        <td>${colaborador ? colaborador.nome : 'Não informado'}</td>
        <td>${acidente.data}</td>
        <td>${acidente.gravidade}</td>
        <td>${acidente.descricao}</td>
        <td><button onclick="app.editAcidente('${acidente.id}')">Editar</button> <button onclick="app.deleteAcidente('${acidente.id}')">Excluir</button></td>
      </tr>
    `;
    }).join('');

    this.tables.exames.innerHTML = filterData(this.repository.exames).map(exame => {
      const colaborador = this.repository.findById(exame.colaboradorId, 'colaboradores');
      return `
      <tr>
        <td>${colaborador ? colaborador.nome : 'Não informado'}</td>
        <td>${exame.data}</td>
        <td>${exame.tipo}</td>
        <td>${exame.resultado}</td>
        <td><button onclick="app.editExame('${exame.id}')">Editar</button> <button onclick="app.deleteExame('${exame.id}')">Excluir</button></td>
      </tr>
    `;
    }).join('');

    this.tables.treinamentos.innerHTML = filterData(this.repository.treinamentos).map(treinamento => {
      const colaborador = this.repository.findById(treinamento.colaboradorId, 'colaboradores');
      return `
      <tr>
        <td>${colaborador ? colaborador.nome : 'Não informado'}</td>
        <td>${treinamento.curso}</td>
        <td>${treinamento.data}</td>
        <td>${treinamento.status}</td>
        <td><button onclick="app.editTreinamento('${treinamento.id}')">Editar</button> <button onclick="app.deleteTreinamento('${treinamento.id}')">Excluir</button></td>
      </tr>
    `;
    }).join('');

    this.tables.inspecoes.innerHTML = filterData(this.repository.inspecoes).map(inspecao => `
      <tr>
        <td>${inspecao.data}</td>
        <td>${inspecao.local}</td>
        <td>${inspecao.inspetor}</td>
        <td>${inspecao.status}</td>
        <td><button onclick="app.editInspecao('${inspecao.id}')">Editar</button> <button onclick="app.deleteInspecao('${inspecao.id}')">Excluir</button></td>
      </tr>
    `).join('');
  }

  renderSummary() {
    this.summaryCounts.colaboradores.textContent = this.repository.colaboradores.length;
    this.summaryCounts.epis.textContent = this.repository.epis.length;
    this.summaryCounts.exames.textContent = this.repository.exames.filter(exame => new Date(exame.data) < new Date()).length;
    this.summaryCounts.inspecoes.textContent = this.repository.inspecoes.length;
  }

  renderReports() {
    this.reportFields.colaboradores.textContent = this.repository.colaboradores.length;
    this.reportFields.epis.textContent = this.repository.epis.length;
    this.reportFields.acidentes.textContent = this.repository.acidentes.length;
    this.reportFields.exames.textContent = this.repository.exames.length;
    this.reportFields.treinamentos.textContent = this.repository.treinamentos.length;
    this.reportFields.inspecoes.textContent = this.repository.inspecoes.length;

    const pendentes = this.repository.entregas.filter(entrega => entrega.status === 'Pendente');
    this.reportFields.pendentes.textContent = pendentes.length > 0 ? `${pendentes.length} entregas pendentes` : 'Nenhum registro pendente.';

    const hoje = new Date();
    const examesVencidos = this.repository.exames.filter(exame => new Date(exame.data) < hoje);
    this.reportFields.vencidos.textContent = examesVencidos.length > 0 ? `${examesVencidos.length} exame(s) vencido(s)` : 'Nenhum exame vencido.';

    this.renderAcidenteChart();
  }

  renderAcidenteChart() {
    const gravidades = {
      Leve: 0,
      Moderada: 0,
      Grave: 0,
    };

    this.repository.acidentes.forEach(acidente => {
      if (gravidades[acidente.gravidade] !== undefined) {
        gravidades[acidente.gravidade] += 1;
      }
    });

    const total = Object.values(gravidades).reduce((sum, value) => sum + value, 0);
    const summaryText = total > 0 ? `${total} acidente(s) registrados` : 'Nenhum acidente registrado ainda';
    this.graphElements.chartSummary.textContent = summaryText;

    const maxValue = Math.max(...Object.values(gravidades), 1);
    const containerHeight = 320;

    const chartMarkup = `
      <div class="chart-bar-grid">
        ${Object.entries(gravidades).map(([label, value]) => {
          const height = Math.max(24, (value / maxValue) * containerHeight);
          return `
            <div class="chart-bar">
              <div style="height: ${height}px"></div>
              <span>${value}</span>
              <div class="chart-label">${label}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.graphElements.acidenteChart.innerHTML = chartMarkup;
  }

  performSearch() {
    const q = (this.search.query.value || '').trim().toLowerCase();
    const tipo = this.search.tipo.value || 'all';
    const results = [];

    const push = (type, id, title, details, date) => results.push({ type, id, title, details, date });

    const match = (text) => !q || (text || '').toString().toLowerCase().includes(q);

    if (tipo === 'all' || tipo === 'colaboradores') {
      this.repository.colaboradores.forEach(c => {
        if (match(c.nome) || match(c.email)) push('Colaborador', c.id, c.nome, c.email, '');
      });
    }

    if (tipo === 'all' || tipo === 'epis') {
      this.repository.epis.forEach(e => { if (match(e.nome) || match(e.categoria)) push('EPI', e.id, e.nome, e.categoria, ''); });
    }

    if (tipo === 'all' || tipo === 'acidentes') {
      this.repository.acidentes.forEach(a => { if (match(a.descricao) || match(a.gravidade)) {
        const col = this.repository.findById(a.colaboradorId, 'colaboradores');
        push('Acidente', a.id, col ? col.nome : '---', `${a.descricao} (${a.gravidade})`, a.data);
      }});
    }

    if (tipo === 'all' || tipo === 'exames') {
      this.repository.exames.forEach(x => { if (match(x.tipo) || match(x.resultado)) {
        const col = this.repository.findById(x.colaboradorId, 'colaboradores');
        push('Exame', x.id, x.tipo, `${col ? col.nome : '---'} - ${x.resultado}`, x.data);
      }});
    }

    if (tipo === 'all' || tipo === 'treinamentos') {
      this.repository.treinamentos.forEach(t => { if (match(t.curso) || match(t.status)) {
        const col = this.repository.findById(t.colaboradorId, 'colaboradores');
        push('Treinamento', t.id, t.curso, `${col ? col.nome : '---'} - ${t.status}`, t.data);
      }});
    }

    if (tipo === 'all' || tipo === 'inspecoes') {
      this.repository.inspecoes.forEach(i => { if (match(i.local) || match(i.inspetor) || match(i.notas)) push('Inspeção', i.id, i.local, `${i.inspetor} - ${i.status}`, i.data); });
    }

    if (tipo === 'all' || tipo === 'setores') {
      this.repository.setores.forEach(s => { if (match(s.nome) || match(s.descricao)) push('Setor', s.id, s.nome, s.descricao, ''); });
    }

    if (tipo === 'all' || tipo === 'cargos') {
      this.repository.cargos.forEach(cg => { if (match(cg.nome) || match(cg.descricao)) push('Cargo', cg.id, cg.nome, cg.descricao, ''); });
    }

    this.renderSearchResults(results);
  }

  renderSearchResults(results) {
    const tbody = this.search.resultTable;
    tbody.innerHTML = results.map(r => `
      <tr>
        <td>${r.type}</td>
        <td>${r.title}</td>
        <td>${r.details}</td>
        <td>${r.date || ''}</td>
        <td class="results-actions"><button onclick="app.openFromSearch('${r.type}','${r.id}')">Abrir</button></td>
      </tr>
    `).join('');
  }

  openFromSearch(type, id) {
    // map types to edit functions and pages
    const map = {
      'Colaborador': ['colaboradores','editColaborador'],
      'EPI': ['epis','editEPI'],
      'Acidente': ['acidentes','editAcidente'],
      'Exame': ['exames','editExame'],
      'Treinamento': ['treinamentos','editTreinamento'],
      'Inspeção': ['inspecoes','editInspecao'],
      'Setor': ['setores','editSetor'],
      'Cargo': ['cargos','editCargo'],
    };
    const entry = map[type];
    if (entry) {
      const [page, fn] = entry;
      this.activeFilter = { tableName: page, id };
      if (typeof this[fn] === 'function') this[fn](id);
      this.switchPage(page);
      this.renderTables();
    }
  }

  clearFilter() {
    this.activeFilter = null;
    this.renderTables();
  }

  generateReportPreview() {
    const setores = this.repository.setores.length;
    const cargos = this.repository.cargos.length;
    const colaboradores = this.repository.colaboradores.length;
    const epis = this.repository.epis.length;
    const acidentes = this.repository.acidentes.length;
    const exames = this.repository.exames.length;
    const treinamentos = this.repository.treinamentos.length;
    const inspecoes = this.repository.inspecoes.length;

    const entregasPendentes = this.repository.entregas.filter(entrega => entrega.status === 'Pendente').length;
    const examesVencidos = this.repository.exames.filter(exame => new Date(exame.data) < new Date()).length;

    const accidentsTable = this.repository.acidentes.map(acidente => {
      const colaborador = this.repository.findById(acidente.colaboradorId, 'colaboradores');
      return `
        <tr>
          <td>${colaborador ? colaborador.nome : '---'}</td>
          <td>${acidente.data}</td>
          <td>${acidente.gravidade}</td>
          <td>${acidente.descricao}</td>
        </tr>
      `;
    }).join('');

    this.reportPreview.innerHTML = `
      <div class="report-preview-title">
        <h3>Relatório de Saúde e Segurança</h3>
        <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      <div class="report-summary-grid">
        <div><strong>${setores}</strong><span>Setores</span></div>
        <div><strong>${cargos}</strong><span>Cargos</span></div>
        <div><strong>${colaboradores}</strong><span>Colaboradores</span></div>
        <div><strong>${epis}</strong><span>EPIs</span></div>
        <div><strong>${acidentes}</strong><span>Acidentes</span></div>
        <div><strong>${exames}</strong><span>Exames</span></div>
        <div><strong>${treinamentos}</strong><span>Treinamentos</span></div>
        <div><strong>${inspecoes}</strong><span>Inspeções</span></div>
      </div>
      <div class="report-notes">
        <p><strong>Entregas pendentes:</strong> ${entregasPendentes}</p>
        <p><strong>Exames vencidos:</strong> ${examesVencidos}</p>
      </div>
      <div class="report-table-card">
        <h4>Detalhes de acidentes</h4>
        <table>
          <thead><tr><th>Colaborador</th><th>Data</th><th>Gravidade</th><th>Descrição</th></tr></thead>
          <tbody>${accidentsTable}</tbody>
        </table>
      </div>
    `;

    this.reportPreview.classList.remove('hidden');
  }

  printReport() {
    if (this.reportPreview.classList.contains('hidden')) {
      this.generateReportPreview();
    }
    window.print();
  }

  saveSetor(event) {
    event.preventDefault();
    const id = document.getElementById('setor-id').value;
    const nome = document.getElementById('setor-nome').value.trim();
    const descricao = document.getElementById('setor-descricao').value.trim();
    const setor = new Setor(nome, descricao, id || undefined);
    if (id) {
      this.repository.update(setor, 'setores');
    } else {
      this.repository.add(setor, 'setores');
    }
    this.clearForm('setor');
    this.refreshAll();
  }

  saveCargo(event) {
    event.preventDefault();
    const id = document.getElementById('cargo-id').value;
    const nome = document.getElementById('cargo-nome').value.trim();
    const descricao = document.getElementById('cargo-descricao').value.trim();
    const cargo = new Cargo(nome, descricao, id || undefined);
    if (id) {
      this.repository.update(cargo, 'cargos');
    } else {
      this.repository.add(cargo, 'cargos');
    }
    this.clearForm('cargo');
    this.refreshAll();
  }

  saveColaborador(event) {
    event.preventDefault();
    const id = document.getElementById('colaborador-id').value;
    const nome = document.getElementById('colaborador-nome').value.trim();
    const email = document.getElementById('colaborador-email').value.trim();
    const setorId = this.selects.colaboradorSetor.value;
    const cargoId = this.selects.colaboradorCargo.value;
    const colaborador = new Colaborador(nome, email, setorId, cargoId, id || undefined);
    if (id) {
      this.repository.update(colaborador, 'colaboradores');
    } else {
      this.repository.add(colaborador, 'colaboradores');
    }
    this.clearForm('colaborador');
    this.refreshAll();
  }

  saveEPI(event) {
    event.preventDefault();
    const id = document.getElementById('epi-id').value;
    const nome = document.getElementById('epi-nome').value.trim();
    const categoria = document.getElementById('epi-categoria').value.trim();
    const quantidade = Number(document.getElementById('epi-quantidade').value);
    const epi = new EPI(nome, categoria, quantidade, id || undefined);
    if (id) {
      this.repository.update(epi, 'epis');
    } else {
      this.repository.add(epi, 'epis');
    }
    this.clearForm('epi');
    this.refreshAll();
  }

  saveEntrega(event) {
    event.preventDefault();
    const id = document.getElementById('entrega-id').value;
    const colaboradorId = this.selects.entregaColaborador.value;
    const epiId = this.selects.entregaEpi.value;
    const quantidade = Number(document.getElementById('entrega-quantidade').value);
    const dataEntrega = document.getElementById('entrega-data').value;
    const status = document.getElementById('entrega-status').value;
    const previous = id ? this.repository.findById(id, 'entregas') : null;

    if (previous && previous.status === 'Concluída') {
      const previousEpi = this.repository.findById(previous.epiId, 'epis');
      if (previousEpi) {
        previousEpi.quantidade += Number(previous.quantidade || 0);
        this.repository.update(previousEpi, 'epis');
      }
    }

    const entrega = new EntregaEPI(colaboradorId, epiId, dataEntrega, quantidade, status, id || undefined);
    if (id) {
      this.repository.update(entrega, 'entregas');
    } else {
      this.repository.add(entrega, 'entregas');
    }

    if (status === 'Concluída') {
      const epi = this.repository.findById(epiId, 'epis');
      if (epi) {
        epi.quantidade = Math.max(0, epi.quantidade - quantidade);
        this.repository.update(epi, 'epis');
      }
    }

    this.clearForm('entrega');
    this.refreshAll();
  }

  saveDevolucao(event) {
    event.preventDefault();
    const id = document.getElementById('devolucao-id').value;
    const colaboradorId = this.selects.devolucaoColaborador.value;
    const epiId = this.selects.devolucaoEpi.value;
    const dataDevolucao = document.getElementById('devolucao-data').value;
    const quantidade = Number(document.getElementById('devolucao-quantidade').value);
    const previous = id ? this.repository.findById(id, 'devolucoes') : null;
    const epi = this.repository.findById(epiId, 'epis');

    if (previous && epi) {
      epi.quantidade = Math.max(0, epi.quantidade - Number(previous.quantidade || 0));
      this.repository.update(epi, 'epis');
    }

    const devolucao = new DevolucaoEPI(colaboradorId, epiId, dataDevolucao, quantidade, id || undefined);
    if (id) {
      this.repository.update(devolucao, 'devolucoes');
    } else {
      this.repository.add(devolucao, 'devolucoes');
    }

    if (epi) {
      epi.quantidade += quantidade;
      this.repository.update(epi, 'epis');
    }

    this.clearForm('devolucao');
    this.refreshAll();
  }

  saveAcidente(event) {
    event.preventDefault();
    const id = document.getElementById('acidente-id').value;
    const colaboradorId = this.selects.acidenteColaborador.value;
    const data = document.getElementById('acidente-data').value;
    const descricao = document.getElementById('acidente-descricao').value.trim();
    const gravidade = document.getElementById('acidente-gravidade').value;
    const acidente = new Acidente(colaboradorId, data, descricao, gravidade, id || undefined);
    if (id) {
      this.repository.update(acidente, 'acidentes');
    } else {
      this.repository.add(acidente, 'acidentes');
    }
    this.clearForm('acidente');
    this.refreshAll();
  }

  saveExame(event) {
    event.preventDefault();
    const id = document.getElementById('exame-id').value;
    const colaboradorId = this.selects.exameColaborador.value;
    const data = document.getElementById('exame-data').value;
    const tipo = document.getElementById('exame-tipo').value.trim();
    const resultado = document.getElementById('exame-resultado').value;
    const exame = new ExameMedico(colaboradorId, data, tipo, resultado, id || undefined);
    if (id) {
      this.repository.update(exame, 'exames');
    } else {
      this.repository.add(exame, 'exames');
    }
    this.clearForm('exame');
    this.refreshAll();
  }

  saveTreinamento(event) {
    event.preventDefault();
    const id = document.getElementById('treinamento-id').value;
    const colaboradorId = this.selects.treinamentoColaborador.value;
    const curso = document.getElementById('treinamento-curso').value.trim();
    const data = document.getElementById('treinamento-data').value;
    const status = document.getElementById('treinamento-status').value;
    const treinamento = new Treinamento(colaboradorId, curso, data, status, id || undefined);
    if (id) {
      this.repository.update(treinamento, 'treinamentos');
    } else {
      this.repository.add(treinamento, 'treinamentos');
    }
    this.clearForm('treinamento');
    this.refreshAll();
  }

  saveInspecao(event) {
    event.preventDefault();
    const id = document.getElementById('inspecao-id').value;
    const inspetor = document.getElementById('inspecao-inspetor').value.trim();
    const local = document.getElementById('inspecao-local').value.trim();
    const data = document.getElementById('inspecao-data').value;
    const status = document.getElementById('inspecao-status').value;
    const notas = document.getElementById('inspecao-notas').value.trim();
    const inspecao = new Inspecao(inspetor, local, data, status, notas, id || undefined);
    if (id) {
      this.repository.update(inspecao, 'inspecoes');
    } else {
      this.repository.add(inspecao, 'inspecoes');
    }
    this.clearForm('inspecao');
    this.refreshAll();
  }

  editSetor(id) {
    const setor = this.repository.findById(id, 'setores');
    if (!setor) return;
    document.getElementById('setor-id').value = setor.id;
    document.getElementById('setor-nome').value = setor.nome;
    document.getElementById('setor-descricao').value = setor.descricao;
    this.switchPage('setores');
  }

  editCargo(id) {
    const cargo = this.repository.findById(id, 'cargos');
    if (!cargo) return;
    document.getElementById('cargo-id').value = cargo.id;
    document.getElementById('cargo-nome').value = cargo.nome;
    document.getElementById('cargo-descricao').value = cargo.descricao;
    this.switchPage('cargos');
  }

  editColaborador(id) {
    const colaborador = this.repository.findById(id, 'colaboradores');
    if (!colaborador) return;
    document.getElementById('colaborador-id').value = colaborador.id;
    document.getElementById('colaborador-nome').value = colaborador.nome;
    document.getElementById('colaborador-email').value = colaborador.email;
    this.selects.colaboradorSetor.value = colaborador.setorId;
    this.selects.colaboradorCargo.value = colaborador.cargoId;
    this.switchPage('colaboradores');
  }

  editEPI(id) {
    const epi = this.repository.findById(id, 'epis');
    if (!epi) return;
    document.getElementById('epi-id').value = epi.id;
    document.getElementById('epi-nome').value = epi.nome;
    document.getElementById('epi-categoria').value = epi.categoria;
    document.getElementById('epi-quantidade').value = epi.quantidade;
    this.switchPage('epis');
  }

  editEntrega(id) {
    const entrega = this.repository.findById(id, 'entregas');
    if (!entrega) return;
    document.getElementById('entrega-id').value = entrega.id;
    this.selects.entregaColaborador.value = entrega.colaboradorId;
    this.selects.entregaEpi.value = entrega.epiId;
    document.getElementById('entrega-quantidade').value = entrega.quantidade;
    document.getElementById('entrega-data').value = entrega.dataEntrega;
    document.getElementById('entrega-status').value = entrega.status;
    this.switchPage('epis');
    this.toggleActionForm('entrega', true);
  }

  editDevolucao(id) {
    const devolucao = this.repository.findById(id, 'devolucoes');
    if (!devolucao) return;
    document.getElementById('devolucao-id').value = devolucao.id;
    this.selects.devolucaoColaborador.value = devolucao.colaboradorId;
    this.selects.devolucaoEpi.value = devolucao.epiId;
    document.getElementById('devolucao-data').value = devolucao.dataDevolucao;
    document.getElementById('devolucao-quantidade').value = devolucao.quantidade;
    this.switchPage('epis');
    this.toggleActionForm('devolucao', true);
  }

  editAcidente(id) {
    const acidente = this.repository.findById(id, 'acidentes');
    if (!acidente) return;
    document.getElementById('acidente-id').value = acidente.id;
    this.selects.acidenteColaborador.value = acidente.colaboradorId;
    document.getElementById('acidente-data').value = acidente.data;
    document.getElementById('acidente-descricao').value = acidente.descricao;
    document.getElementById('acidente-gravidade').value = acidente.gravidade;
    this.switchPage('acidentes');
  }

  editExame(id) {
    const exame = this.repository.findById(id, 'exames');
    if (!exame) return;
    document.getElementById('exame-id').value = exame.id;
    this.selects.exameColaborador.value = exame.colaboradorId;
    document.getElementById('exame-data').value = exame.data;
    document.getElementById('exame-tipo').value = exame.tipo;
    document.getElementById('exame-resultado').value = exame.resultado;
    this.switchPage('exames');
  }

  editTreinamento(id) {
    const treinamento = this.repository.findById(id, 'treinamentos');
    if (!treinamento) return;
    document.getElementById('treinamento-id').value = treinamento.id;
    this.selects.treinamentoColaborador.value = treinamento.colaboradorId;
    document.getElementById('treinamento-curso').value = treinamento.curso;
    document.getElementById('treinamento-data').value = treinamento.data;
    document.getElementById('treinamento-status').value = treinamento.status;
    this.switchPage('treinamentos');
  }

  editInspecao(id) {
    const inspecao = this.repository.findById(id, 'inspecoes');
    if (!inspecao) return;
    document.getElementById('inspecao-id').value = inspecao.id;
    document.getElementById('inspecao-inspetor').value = inspecao.inspetor;
    document.getElementById('inspecao-local').value = inspecao.local;
    document.getElementById('inspecao-data').value = inspecao.data;
    document.getElementById('inspecao-status').value = inspecao.status;
    document.getElementById('inspecao-notas').value = inspecao.notas;
    this.switchPage('inspecoes');
  }

  deleteSetor(id) {
    this.repository.remove(id, 'setores');
    this.repository.colaboradores = this.repository.colaboradores.filter(col => col.setorId !== id);
    this.repository.save();
    this.refreshAll();
  }

  deleteCargo(id) {
    this.repository.remove(id, 'cargos');
    this.repository.colaboradores = this.repository.colaboradores.filter(col => col.cargoId !== id);
    this.repository.save();
    this.refreshAll();
  }

  deleteColaborador(id) {
    this.repository.remove(id, 'colaboradores');
    this.repository.entregas = this.repository.entregas.filter(entrega => entrega.colaboradorId !== id);
    this.repository.devolucoes = this.repository.devolucoes.filter(devolucao => devolucao.colaboradorId !== id);
    this.repository.acidentes = this.repository.acidentes.filter(acc => acc.colaboradorId !== id);
    this.repository.exames = this.repository.exames.filter(exame => exame.colaboradorId !== id);
    this.repository.treinamentos = this.repository.treinamentos.filter(tr => tr.colaboradorId !== id);
    this.repository.save();
    this.refreshAll();
  }

  deleteEPI(id) {
    this.repository.remove(id, 'epis');
    this.repository.entregas = this.repository.entregas.filter(entrega => entrega.epiId !== id);
    this.repository.devolucoes = this.repository.devolucoes.filter(devolucao => devolucao.epiId !== id);
    this.repository.save();
    this.refreshAll();
  }

  deleteEntrega(id) {
    const entrega = this.repository.findById(id, 'entregas');
    if (entrega && entrega.status === 'Concluída') {
      const epi = this.repository.findById(entrega.epiId, 'epis');
      if (epi) {
        epi.quantidade += Number(entrega.quantidade || 1);
        this.repository.update(epi, 'epis');
      }
    }
    this.repository.remove(id, 'entregas');
    this.refreshAll();
  }

  deleteDevolucao(id) {
    const devolucao = this.repository.findById(id, 'devolucoes');
    if (devolucao) {
      const epi = this.repository.findById(devolucao.epiId, 'epis');
      if (epi) {
        epi.quantidade = Math.max(0, epi.quantidade - Number(devolucao.quantidade || 0));
        this.repository.update(epi, 'epis');
      }
    }
    this.repository.remove(id, 'devolucoes');
    this.refreshAll();
  }

  toggleActionForm(formName, show) {
    const form = this.forms[formName];
    if (!form) return;
    if (show) {
      form.classList.remove('hidden');
    } else {
      form.classList.add('hidden');
      this.clearForm(formName);
    }
  }

  deleteAcidente(id) {
    this.repository.remove(id, 'acidentes');
    this.refreshAll();
  }

  deleteExame(id) {
    this.repository.remove(id, 'exames');
    this.refreshAll();
  }

  deleteTreinamento(id) {
    this.repository.remove(id, 'treinamentos');
    this.refreshAll();
  }

  deleteInspecao(id) {
    this.repository.remove(id, 'inspecoes');
    this.refreshAll();
  }
}

const repository = new Repository();
const app = new AppController(repository);
window.app = app;
