export class BaseRecord {
  constructor(id) {
    this.id = id || BaseRecord.generateId();
  }

  static generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}

export class Setor extends BaseRecord {
  constructor(nome, descricao, id) {
    super(id);
    this.nome = nome;
    this.descricao = descricao;
  }
}

export class Cargo extends BaseRecord {
  constructor(nome, descricao, id) {
    super(id);
    this.nome = nome;
    this.descricao = descricao;
  }
}

export class Colaborador extends BaseRecord {
  constructor(nome, email, setorId, cargoId, id) {
    super(id);
    this.nome = nome;
    this.email = email;
    this.setorId = setorId;
    this.cargoId = cargoId;
  }
}

export class EPI extends BaseRecord {
  constructor(nome, categoria, quantidade, id) {
    super(id);
    this.nome = nome;
    this.categoria = categoria;
    this.quantidade = quantidade;
  }
}

export class EntregaEPI extends BaseRecord {
  constructor(colaboradorId, epiId, dataEntrega, quantidade, status, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.epiId = epiId;
    this.dataEntrega = dataEntrega;
    this.quantidade = quantidade;
    this.status = status;
  }
}

export class DevolucaoEPI extends BaseRecord {
  constructor(colaboradorId, epiId, dataDevolucao, quantidade, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.epiId = epiId;
    this.dataDevolucao = dataDevolucao;
    this.quantidade = quantidade;
  }
}

export class Acidente extends BaseRecord {
  constructor(colaboradorId, data, descricao, gravidade, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.data = data;
    this.descricao = descricao;
    this.gravidade = gravidade;
  }
}

export class ExameMedico extends BaseRecord {
  constructor(colaboradorId, data, tipo, resultado, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.data = data;
    this.tipo = tipo;
    this.resultado = resultado;
  }
}

export class Treinamento extends BaseRecord {
  constructor(colaboradorId, curso, data, status, id) {
    super(id);
    this.colaboradorId = colaboradorId;
    this.curso = curso;
    this.data = data;
    this.status = status;
  }
}

export class Inspecao extends BaseRecord {
  constructor(inspetor, local, data, status, notas, id) {
    super(id);
    this.inspetor = inspetor;
    this.local = local;
    this.data = data;
    this.status = status;
    this.notas = notas;
  }
}
