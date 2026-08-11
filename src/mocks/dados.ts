/**
 * Dados de exemplo, tipados no formato exato do schema.
 *
 * Este arquivo é o ÚNICO ponto que precisa sair quando o Supabase entrar.
 * Cada função aqui vira uma query — a assinatura já é a mesma. É por isso
 * que os mocks usam nomes de coluna do banco e não um formato próprio: se
 * divergissem, todo componente teria que ser reescrito depois.
 *
 * Conteúdo herdado do protótipo aprovado pelo cliente. As questões
 * definitivas vêm do Danilo.
 */

import type {
  Aula,
  Comentario,
  ConclusaoModulo,
  Modulo,
  Profile,
  ProgressoAula,
  ProgressoColaborador,
  Questao,
  Setor,
  Tenant,
  Trilha,
} from '@/types/database'

const TENANT_ID = 'tenant-dgtech'

export const TENANT: Tenant = {
  id: TENANT_ID,
  nome: 'DG Tech Soluções Corporativas',
  slug: 'dgtech',
  logo_url: '/logo-dgtech.png',
  cor_primaria: '#FFDA00',
  criado_em: '2026-07-01T00:00:00Z',
}

export const SETORES: Setor[] = [
  { id: 'setor-campo', tenant_id: TENANT_ID, nome: 'Engenharia de Campo' },
  { id: 'setor-orcamentos', tenant_id: TENANT_ID, nome: 'Orçamentos' },
  { id: 'setor-adm', tenant_id: TENANT_ID, nome: 'Administrativo' },
  { id: 'setor-fornecedores', tenant_id: TENANT_ID, nome: 'Fornecedores' },
]

export const USUARIO_ATUAL: Profile = {
  id: 'user-marcos',
  tenant_id: TENANT_ID,
  nome: 'Marcos Oliveira',
  email: 'marcos@dgtech.com.br',
  cargo: 'Eletricista Jr.',
  setor_id: 'setor-campo',
  foto_url: null,
  papel: 'colaborador',
  nivel_experiencia: null,
  onboarding_concluido_em: null,
  criado_em: '2026-07-10T00:00:00Z',
}

export const TRILHA: Trilha = {
  id: 'trilha-integracao',
  tenant_id: TENANT_ID,
  nome: 'Integração DG Tech',
  descricao: 'A jornada de entrada de todo colaborador da DG.',
  ordem: 0,
  ativa: true,
}

// Trilhas obrigatórias para TODOS (independente do setor)
export const TRILHA_MISSAO_VISAO_VALORES: Trilha = {
  id: 'trilha-missao-visao-valores',
  tenant_id: TENANT_ID,
  nome: 'Missão, Visão e Valores',
  descricao: 'Entenda o propósito e os valores que guiam a DG Tech.',
  ordem: 10,
  ativa: true,
}

export const TRILHA_CODIGOS_CONDUTA: Trilha = {
  id: 'trilha-codigos-conduta',
  tenant_id: TENANT_ID,
  nome: 'Códigos de Conduta',
  descricao: 'Normas e princípios éticos que orientam o comportamento na DG Tech.',
  ordem: 11,
  ativa: true,
}

export const MODULOS: Modulo[] = [
  // Trilha: Integração DG Tech
  { id: 'mod-1', trilha_id: TRILHA.id, numero: 1, titulo: 'Boas-vindas à DG', descricao: null, capa_url: '/capas/mod-1.jpg', ordem: 0 },
  {
    id: 'mod-regras-casa',
    trilha_id: TRILHA.id,
    numero: 2,
    titulo: 'Regras da Casa',
    descricao: 'Playlist com as regras do dia a dia na DG — assista quando quiser.',
    capa_url: '/capas/mod-regras-1.jpg',
    ordem: 1,
    sempre_disponivel: true,
    destaque: true,
  },
  { id: 'mod-2', trilha_id: TRILHA.id, numero: 3, titulo: 'Cultura, Missão & Valores', descricao: null, capa_url: '/capas/mod-2.jpg', ordem: 2 },
  { id: 'mod-3', trilha_id: TRILHA.id, numero: 4, titulo: 'Código de Conduta', descricao: 'As regras da casa — do jeito DG de ser.', capa_url: '/capas/mod-3.jpg', ordem: 3 },
  { id: 'mod-4', trilha_id: TRILHA.id, numero: 5, titulo: 'Segurança & EPIs', descricao: null, capa_url: '/capas/mod-4.jpg', ordem: 4 },
  { id: 'mod-5', trilha_id: TRILHA.id, numero: 6, titulo: 'Materiais & Ferramentas', descricao: null, capa_url: '/capas/mod-5.jpg', ordem: 5 },
  { id: 'mod-6', trilha_id: TRILHA.id, numero: 7, titulo: 'Certificação DG Tech', descricao: null, capa_url: '/capas/mod-6.jpg', ordem: 6 },

  // Trilha: Missão, Visão e Valores (obrigatória)
  // ordem contínuo a partir da Integração: listarModulos() devolve TODOS os
  // módulos numa lista só (é o que alimenta /mapa e /trilha), então "ordem"
  // precisa ser único no conjunto inteiro — reiniciar em 0 por trilha faz o
  // sort intercalar trilhas por empate (bug real que tirou "Regras da Casa"
  // do lugar 2 antes desse fix).
  { id: 'mod-mvv-1', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 1, titulo: 'Nossa Missão', descricao: 'O propósito que nos move.', capa_url: '/capas/mod-mvv-1.jpg', ordem: 7 },
  { id: 'mod-mvv-2', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 2, titulo: 'Nossa Visão', descricao: 'Onde queremos chegar.', capa_url: '/capas/mod-mvv-2.jpg', ordem: 8 },
  { id: 'mod-mvv-3', trilha_id: TRILHA_MISSAO_VISAO_VALORES.id, numero: 3, titulo: 'Nossos Valores', descricao: 'Os princípios que nos guiam.', capa_url: '/capas/mod-mvv-3.jpg', ordem: 9 },

  // Trilha: Códigos de Conduta (obrigatória)
  { id: 'mod-cond-1', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 1, titulo: 'Ética e Integridade', descricao: 'Princípios éticos na DG Tech.', capa_url: '/capas/mod-cond-1.jpg', ordem: 10 },
  { id: 'mod-cond-2', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 2, titulo: 'Respeito e Diversidade', descricao: 'Um ambiente inclusivo para todos.', capa_url: '/capas/mod-cond-2.jpg', ordem: 11 },
  { id: 'mod-cond-3', trilha_id: TRILHA_CODIGOS_CONDUTA.id, numero: 3, titulo: 'Conflitos de Interesse', descricao: 'Como identificar e lidar.', capa_url: '/capas/mod-cond-3.jpg', ordem: 12 },
]

export const AULAS: Aula[] = [
  // Trilha: Integração DG Tech
  { id: 'aula-1', modulo_id: 'mod-1', titulo: 'Boas-vindas à DG', descricao: null, panda_video_id: null, duracao_seg: 180, ordem: 0 },
  { id: 'aula-2', modulo_id: 'mod-2', titulo: 'Cultura, Missão & Valores', descricao: null, panda_video_id: null, duracao_seg: 240, ordem: 0 },
  {
    id: 'aula-3',
    modulo_id: 'mod-3',
    titulo: 'Código de Conduta',
    descricao:
      'O que é conduta? Conduta não é um manual na gaveta. Não é uma lista de proibições. Conduta é a soma de todas as escolhas que fazemos quando ninguém está olhando — e é exatamente isso que constrói a reputação da DG Tech em cada obra, em cada cliente, em cada aperto de mão.',
    panda_video_id: null,
    duracao_seg: 204,
    ordem: 0,
  },
  { id: 'aula-4', modulo_id: 'mod-4', titulo: 'Segurança & EPIs', descricao: null, panda_video_id: null, duracao_seg: 300, ordem: 0 },
  { id: 'aula-5', modulo_id: 'mod-5', titulo: 'Materiais & Ferramentas', descricao: null, panda_video_id: null, duracao_seg: 260, ordem: 0 },
  { id: 'aula-6', modulo_id: 'mod-6', titulo: 'Certificação DG Tech', descricao: null, panda_video_id: null, duracao_seg: 320, ordem: 0 },

  // Trilha: Missão, Visão e Valores (obrigatória)
  { id: 'aula-mvv-1', modulo_id: 'mod-mvv-1', titulo: 'Nossa Missão', descricao: 'Conheça o propósito que move a DG Tech.', panda_video_id: null, duracao_seg: 240, ordem: 0 },
  { id: 'aula-mvv-2', modulo_id: 'mod-mvv-2', titulo: 'Nossa Visão', descricao: 'Veja onde queremos chegar como empresa.', panda_video_id: null, duracao_seg: 220, ordem: 0 },
  { id: 'aula-mvv-3', modulo_id: 'mod-mvv-3', titulo: 'Nossos Valores', descricao: 'Os princípios que guiam todas as nossas decisões.', panda_video_id: null, duracao_seg: 260, ordem: 0 },

  // Trilha: Códigos de Conduta (obrigatória)
  { id: 'aula-cond-1', modulo_id: 'mod-cond-1', titulo: 'Ética e Integridade', descricao: 'Princípios éticos que devemos manter.', panda_video_id: null, duracao_seg: 280, ordem: 0 },
  { id: 'aula-cond-2', modulo_id: 'mod-cond-2', titulo: 'Respeito e Diversidade', descricao: 'Construindo um ambiente inclusivo.', panda_video_id: null, duracao_seg: 250, ordem: 0 },
  { id: 'aula-cond-3', modulo_id: 'mod-cond-3', titulo: 'Conflitos de Interesse', descricao: 'Como identificar e reportar conflitos.', panda_video_id: null, duracao_seg: 200, ordem: 0 },

  // Trilha: Integração DG Tech — playlist do módulo "Regras da Casa" (sempre_disponivel)
  { id: 'aula-regras-casa-01', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 01', descricao: null, panda_video_id: '05f5df67-bdfc-4315-a222-c9fbc218c5db', duracao_seg: 180, ordem: 0 },
  { id: 'aula-regras-casa-02', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 02', descricao: null, panda_video_id: 'd9c93fbc-e7fc-4bad-b3b1-38dc33bb8413', duracao_seg: 180, ordem: 1 },
  { id: 'aula-regras-casa-03', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 03', descricao: null, panda_video_id: 'e58237d8-e5f8-4c32-8f88-758357344203', duracao_seg: 180, ordem: 2 },
  { id: 'aula-regras-casa-05', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 05', descricao: null, panda_video_id: '62cad896-ca1b-4d39-9be7-fc8ebe9067d5', duracao_seg: 180, ordem: 3 },
  { id: 'aula-regras-casa-06', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 06', descricao: null, panda_video_id: '9babc5b1-a244-4726-88e5-bd6350d17c75', duracao_seg: 180, ordem: 4 },
  { id: 'aula-regras-casa-07', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 07', descricao: null, panda_video_id: 'a7adf4ee-f190-452e-bf4e-475914bc5e28', duracao_seg: 180, ordem: 5 },
  { id: 'aula-regras-casa-08', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 08', descricao: null, panda_video_id: '226431db-c081-4a76-80a1-488039dcca8a', duracao_seg: 180, ordem: 6 },
  { id: 'aula-regras-casa-09', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa 09', descricao: null, panda_video_id: '06998c7a-955c-4b63-83dd-d5ef085e920f', duracao_seg: 180, ordem: 7 },
  { id: 'aula-regras-casa-estacionamento', modulo_id: 'mod-regras-casa', titulo: 'Regras da Casa — Estacionamento', descricao: null, panda_video_id: 'cf807870-c28c-408d-80d8-b792ccde0db6', duracao_seg: 180, ordem: 8 },
]

/** Questões do protótipo. As definitivas vêm do Danilo (prometidas seg/ter). */
export const QUESTOES: Questao[] = [
  {
    id: 'q-1',
    modulo_id: 'mod-3',
    enunciado:
      'Um colega pede pra "agilizar" pulando o checklist de segurança em uma instalação simples. Qual é a conduta DG?',
    alternativas: [
      'Aceitar, já que a instalação é simples',
      'Seguir o checklist completo — segurança não se negocia',
      'Fazer só os itens principais',
      'Perguntar ao cliente se pode pular',
    ],
    indice_correto: 1,
    feedback: 'Na DG, procedimento de segurança é inegociável — não existe "só dessa vez".',
    pontos: 30,
    ordem: 0,
  },
  {
    id: 'q-2',
    modulo_id: 'mod-3',
    enunciado: 'Como a DG Tech define o tom do ambiente de trabalho?',
    alternativas: [
      'Formalidade total, sem descontração',
      'Cada um age como preferir',
      'Sério no compromisso, leve no convívio',
      'Descontração acima da entrega',
    ],
    indice_correto: 2,
    feedback: 'Somos extremamente sérios na entrega — e mantemos um ambiente leve e humano.',
    pontos: 30,
    ordem: 1,
  },
  {
    id: 'q-3',
    modulo_id: 'mod-3',
    enunciado: 'Você percebe um desvio de conduta de um colega com um cliente. O que fazer?',
    alternativas: [
      'Comentar com outros colegas',
      'Ignorar, não é problema seu',
      'Expor nas redes internas',
      'Reportar ao gestor ou canal de conduta, com discrição',
    ],
    indice_correto: 3,
    feedback: 'Conduta se corrige pelos canais certos, com respeito e discrição.',
    pontos: 30,
    ordem: 2,
  },

  // Módulo 1 — Boas-vindas à DG
  {
    id: 'q-mod1-1', modulo_id: 'mod-1', ordem: 0, pontos: 30,
    enunciado: 'O que a DG Academy espera do colaborador na fase de integração?',
    alternativas: ['Decorar o organograma completo', 'Assistir aos módulos e entender a cultura da empresa', 'Preencher formulários de RH apenas', 'Nada, é só uma formalidade'],
    indice_correto: 1,
    feedback: 'A integração existe pra você chegar alinhado com a cultura DG antes de ir pro dia a dia.',
  },
  {
    id: 'q-mod1-2', modulo_id: 'mod-1', ordem: 1, pontos: 30,
    enunciado: 'Por que a DG Tech tem uma trilha de integração antes do colaborador começar a trabalhar?',
    alternativas: ['Para atrasar o início das atividades', 'Para garantir que todos comecem com a mesma base de cultura e segurança', 'Porque é exigência legal', 'Não há motivo específico'],
    indice_correto: 1,
    feedback: 'Todo mundo começa alinhado — cultura, segurança e conduta, do mesmo jeito.',
  },
  {
    id: 'q-mod1-3', modulo_id: 'mod-1', ordem: 2, pontos: 30,
    enunciado: 'Quem acompanha o seu progresso na trilha de integração?',
    alternativas: ['Ninguém, é só pra você', 'A gestão, em tempo real, pelo painel', 'Só o Panda Video', 'Um professor externo'],
    indice_correto: 1,
    feedback: 'O gestor vê seu progresso real assim que você avança — é assim que a DG acompanha quem está estudando de verdade.',
  },

  // Módulo 2 — Cultura, Missão & Valores
  {
    id: 'q-mod2-1', modulo_id: 'mod-2', ordem: 0, pontos: 30,
    enunciado: '"Cultura, Missão & Valores" nesta trilha existe para quê?',
    alternativas: ['Para decorar frases de efeito', 'Para você entender como a DG pensa e decide no dia a dia', 'Para preencher tempo do onboarding', 'Não tem função prática'],
    indice_correto: 1,
    feedback: 'Cultura não é discurso — é o que orienta decisão quando não tem manual pra situação.',
  },
  {
    id: 'q-mod2-2', modulo_id: 'mod-2', ordem: 1, pontos: 30,
    enunciado: 'Como a cultura DG se manifesta na prática?',
    alternativas: ['Só em cartazes na parede', 'Nas escolhas do dia a dia, mesmo sem ninguém observando', 'Só em reuniões formais', 'Não se aplica ao trabalho de campo'],
    indice_correto: 1,
    feedback: 'Cultura é o que a pessoa faz quando ninguém está olhando — não o que ela diz que faz.',
  },
  {
    id: 'q-mod2-3', modulo_id: 'mod-2', ordem: 2, pontos: 30,
    enunciado: 'O que conecta a cultura da DG ao trabalho de cada colaborador?',
    alternativas: ['Nada, são coisas separadas', 'As decisões técnicas seguem os mesmos valores da empresa', 'Só a diretoria segue a cultura', 'A cultura só vale para o escritório'],
    indice_correto: 1,
    feedback: 'Do canteiro de obra ao escritório, a mesma cultura orienta a decisão.',
  },

  // Módulo 4 — Segurança & EPIs
  {
    id: 'q-mod4-1', modulo_id: 'mod-4', ordem: 0, pontos: 30,
    enunciado: 'Antes de iniciar qualquer atividade em campo, o que é obrigatório?',
    alternativas: ['Usar os EPIs adequados à atividade', 'Avaliar se realmente precisa', 'Perguntar ao cliente se é necessário', 'Usar só se o supervisor estiver por perto'],
    indice_correto: 0,
    feedback: 'EPI não é opcional e não depende de quem está olhando.',
  },
  {
    id: 'q-mod4-2', modulo_id: 'mod-4', ordem: 1, pontos: 30,
    enunciado: 'Um colega esquece o EPI numa atividade rápida. Qual a conduta correta?',
    alternativas: ['Deixar passar, é rápido mesmo', 'Impedir o início da atividade até o EPI estar correto', 'Avisar só se acontecer de novo', 'Não é problema seu'],
    indice_correto: 1,
    feedback: 'Segurança não se negocia por "vai ser rápido" — não inicia sem o EPI certo.',
  },
  {
    id: 'q-mod4-3', modulo_id: 'mod-4', ordem: 2, pontos: 30,
    enunciado: 'Por que a DG trata segurança como inegociável?',
    alternativas: ['Por exigência apenas de auditoria', 'Porque vidas e integridade física estão em jogo em cada obra', 'Porque encarece o seguro', 'Não é tão crítico assim'],
    indice_correto: 1,
    feedback: 'Procedimento de segurança existe porque a consequência de ignorá-lo é irreversível.',
  },

  // Módulo 5 — Materiais & Ferramentas
  {
    id: 'q-mod5-1', modulo_id: 'mod-5', ordem: 0, pontos: 30,
    enunciado: 'Antes de usar uma ferramenta elétrica em campo, o que se deve verificar?',
    alternativas: ['Só se ela liga', 'Estado de conservação, isolamento e adequação à tarefa', 'Se está com a cor da empresa', 'Nada, ferramenta é ferramenta'],
    indice_correto: 1,
    feedback: 'Ferramenta com isolamento comprometido vira risco, não solução.',
  },
  {
    id: 'q-mod5-2', modulo_id: 'mod-5', ordem: 1, pontos: 30,
    enunciado: 'O que fazer ao identificar uma ferramenta ou material danificado?',
    alternativas: ['Usar mesmo assim se não tiver outra', 'Reportar e retirar de uso até a substituição', 'Emprestar pra outra equipe', 'Guardar sem avisar ninguém'],
    indice_correto: 1,
    feedback: 'Material danificado sai de circulação — reportar é parte do procedimento, não exceção.',
  },
  {
    id: 'q-mod5-3', modulo_id: 'mod-5', ordem: 2, pontos: 30,
    enunciado: 'Como a DG trata o controle de materiais e ferramentas nas obras?',
    alternativas: ['Sem controle, cada um se vira', 'Com padrão de conferência e registro por instalação', 'Só o almoxarifado se importa com isso', 'É responsabilidade só do cliente'],
    indice_correto: 1,
    feedback: 'Padrão de conferência existe pra garantir qualidade e segurança em toda instalação.',
  },

  // Módulo 6 — Certificação DG Tech
  {
    id: 'q-mod6-1', modulo_id: 'mod-6', ordem: 0, pontos: 30,
    enunciado: 'O que representa a certificação ao final da trilha de integração?',
    alternativas: ['Um diploma decorativo', 'A confirmação de que você concluiu e entendeu o conteúdo essencial da DG', 'Só um requisito de RH', 'Nada muda com ela'],
    indice_correto: 1,
    feedback: 'A certificação é o marco de que a base está formada — segurança, conduta e cultura.',
  },
  {
    id: 'q-mod6-2', modulo_id: 'mod-6', ordem: 1, pontos: 30,
    enunciado: 'Depois de certificado, o que muda na sua jornada na DG Academy?',
    alternativas: ['Nada, o conteúdo acaba ali', 'Novas trilhas por setor e treinamentos seguem liberados', 'Você perde acesso à plataforma', 'A certificação expira em 1 dia'],
    indice_correto: 1,
    feedback: 'A integração é a base — o setor te leva pras trilhas específicas da sua função.',
  },
  {
    id: 'q-mod6-3', modulo_id: 'mod-6', ordem: 2, pontos: 30,
    enunciado: 'Quem tem acesso ao seu resultado de certificação?',
    alternativas: ['Só você', 'Você e a gestão, pelo painel de acompanhamento', 'Ninguém, fica só no seu dispositivo', 'Só o admin do sistema'],
    indice_correto: 1,
    feedback: 'É exatamente esse dado que o gestor usa pra saber quem concluiu de verdade.',
  },

  // Trilha Missão, Visão e Valores
  {
    id: 'q-mvv1-1', modulo_id: 'mod-mvv-1', ordem: 0, pontos: 30,
    enunciado: 'Uma missão de empresa serve principalmente para quê?',
    alternativas: ['Decorar o site institucional', 'Explicar o propósito que orienta as decisões da empresa', 'Substituir metas comerciais', 'Não tem uso prático'],
    indice_correto: 1,
    feedback: 'A missão é o porquê por trás de cada decisão — não um slogan.',
  },
  {
    id: 'q-mvv1-2', modulo_id: 'mod-mvv-1', ordem: 1, pontos: 30,
    enunciado: 'Como a missão da DG Tech se conecta ao trabalho do dia a dia?',
    alternativas: ['Não se conecta, é só institucional', 'Orienta prioridades e decisões técnicas em cada projeto', 'Só vale pra diretoria', 'É revisada a cada trimestre sem impacto prático'],
    indice_correto: 1,
    feedback: 'O propósito da empresa aparece nas escolhas técnicas de cada obra, não só no discurso.',
  },
  {
    id: 'q-mvv1-3', modulo_id: 'mod-mvv-1', ordem: 2, pontos: 30,
    enunciado: 'Por que é importante conhecer a missão da empresa que você atende?',
    alternativas: ['Não é importante', 'Ajuda a entender o porquê das prioridades e decisões', 'É só currículo', 'Serve só pra entrevista de emprego'],
    indice_correto: 1,
    feedback: 'Entender o propósito ajuda a tomar decisão certa quando a regra não cobre a situação.',
  },
  {
    id: 'q-mvv2-1', modulo_id: 'mod-mvv-2', ordem: 0, pontos: 30,
    enunciado: 'O que é a "visão" de uma empresa?',
    alternativas: ['A opinião pessoal do fundador', 'Onde a empresa quer chegar no futuro', 'O balanço financeiro anual', 'Um departamento específico'],
    indice_correto: 1,
    feedback: 'Visão é a direção de longo prazo — pra onde a empresa está caminhando.',
  },
  {
    id: 'q-mvv2-2', modulo_id: 'mod-mvv-2', ordem: 1, pontos: 30,
    enunciado: 'Qual o papel do colaborador na visão de futuro da empresa?',
    alternativas: ['Nenhum, isso é só da diretoria', 'Contribuir com seu trabalho diário para essa direção', 'Só concordar em reunião', 'Repetir a visão de cor'],
    indice_correto: 1,
    feedback: 'Cada entrega bem feita empurra a empresa na direção que ela definiu pra si.',
  },
  {
    id: 'q-mvv2-3', modulo_id: 'mod-mvv-2', ordem: 2, pontos: 30,
    enunciado: 'Por que a visão da empresa é revisitada com os colaboradores?',
    alternativas: ['Só por formalidade', 'Para manter todos alinhados com a direção de longo prazo', 'Porque muda toda semana', 'Não é revisitada'],
    indice_correto: 1,
    feedback: 'Alinhamento de visão evita que cada área puxe pra um lado diferente.',
  },
  {
    id: 'q-mvv3-1', modulo_id: 'mod-mvv-3', ordem: 0, pontos: 30,
    enunciado: 'Valores de uma empresa funcionam como quê?',
    alternativas: ['Regras que só valem em crise', 'Princípios que orientam decisão em qualquer situação', 'Um documento arquivado no RH', 'Frases motivacionais sem aplicação prática'],
    indice_correto: 1,
    feedback: 'Valor de verdade é o que decide quando ninguém está checando.',
  },
  {
    id: 'q-mvv3-2', modulo_id: 'mod-mvv-3', ordem: 1, pontos: 30,
    enunciado: 'Um valor da empresa entra em conflito com uma meta de prazo. O que prevalece?',
    alternativas: ['O prazo, sempre', 'O valor — meta não justifica romper princípio', 'Depende de quem está cobrando', 'Nenhum dos dois importa'],
    indice_correto: 1,
    feedback: 'Valor que só vale quando é conveniente não é valor — é discurso.',
  },
  {
    id: 'q-mvv3-3', modulo_id: 'mod-mvv-3', ordem: 2, pontos: 30,
    enunciado: 'Como os valores da DG aparecem no relacionamento com o cliente?',
    alternativas: ['Não aparecem, é só interno', 'Na transparência e compromisso em cada entrega', 'Só em contrato assinado', 'Só quando o cliente reclama'],
    indice_correto: 1,
    feedback: 'O valor se prova na entrega e na relação, não só no papel.',
  },

  // Trilha Códigos de Conduta
  {
    id: 'q-cond1-1', modulo_id: 'mod-cond-1', ordem: 0, pontos: 30,
    enunciado: 'O que significa agir com integridade no trabalho?',
    alternativas: ['Fazer o que for mais rápido', 'Manter a mesma conduta estando alguém observando ou não', 'Seguir a regra só quando é fiscalizado', 'Só ser honesto com o chefe'],
    indice_correto: 1,
    feedback: 'Integridade é consistência — a mesma conduta com ou sem plateia.',
  },
  {
    id: 'q-cond1-2', modulo_id: 'mod-cond-1', ordem: 1, pontos: 30,
    enunciado: 'Um colega sugere burlar uma regra "só dessa vez". Qual a atitude ética?',
    alternativas: ['Aceitar, se ninguém for saber', 'Recusar e seguir o procedimento correto', 'Fazer só se o colega insistir', 'Avisar depois, se der problema'],
    indice_correto: 1,
    feedback: '"Só dessa vez" é como toda quebra de conduta começa — a resposta certa é recusar.',
  },
  {
    id: 'q-cond1-3', modulo_id: 'mod-cond-1', ordem: 2, pontos: 30,
    enunciado: 'Por que ética e integridade importam tanto quanto entrega técnica?',
    alternativas: ['Não importam, só a entrega conta', 'Porque sustentam a confiança que permite o negócio existir', 'É só discurso corporativo', 'Só importa pra quem trabalha com cliente direto'],
    indice_correto: 1,
    feedback: 'Sem confiança não tem contrato, não tem obra, não tem empresa — integridade sustenta tudo isso.',
  },
  {
    id: 'q-cond2-1', modulo_id: 'mod-cond-2', ordem: 0, pontos: 30,
    enunciado: 'Qual conduta reflete respeito no ambiente de trabalho DG?',
    alternativas: ['Tratar diferente conforme o cargo da pessoa', 'Tratar todos com cordialidade e profissionalismo, sem exceção', 'Ser educado só com quem manda', 'Respeito é opcional em campo'],
    indice_correto: 1,
    feedback: 'Respeito não muda conforme hierarquia ou situação — é constante.',
  },
  {
    id: 'q-cond2-2', modulo_id: 'mod-cond-2', ordem: 1, pontos: 30,
    enunciado: 'Você presencia um comentário discriminatório entre colegas. O que fazer?',
    alternativas: ['Ignorar, não é da sua conta', 'Não compactuar e reportar pelos canais adequados', 'Rir também, pra não criar clima ruim', 'Só comentar depois com outros colegas'],
    indice_correto: 1,
    feedback: 'Silêncio compactua. Reportar pelos canais certos é a conduta esperada.',
  },
  {
    id: 'q-cond2-3', modulo_id: 'mod-cond-2', ordem: 2, pontos: 30,
    enunciado: 'Por que um ambiente diverso e respeitoso importa para a DG?',
    alternativas: ['Só por exigência legal', 'Porque times diversos e respeitados entregam melhor e retêm talento', 'Não faz diferença no resultado', 'É só uma tendência passageira'],
    indice_correto: 1,
    feedback: 'Respeito e diversidade não são só valor — são vantagem real de time.',
  },
  {
    id: 'q-cond3-1', modulo_id: 'mod-cond-3', ordem: 0, pontos: 30,
    enunciado: 'O que caracteriza um conflito de interesse?',
    alternativas: ['Discordar de uma decisão do gestor', 'Uma situação em que interesse pessoal pode influenciar decisão profissional', 'Ter uma opinião forte sobre um projeto', 'Qualquer desentendimento entre colegas'],
    indice_correto: 1,
    feedback: 'Conflito de interesse é quando o pessoal pode torcer o profissional — daí a necessidade de declarar.',
  },
  {
    id: 'q-cond3-2', modulo_id: 'mod-cond-3', ordem: 1, pontos: 30,
    enunciado: 'Você percebe que pode se beneficiar pessoalmente de uma decisão que precisa tomar no trabalho. O que fazer?',
    alternativas: ['Decidir e não comentar com ninguém', 'Declarar a situação e afastar-se da decisão', 'Decidir a seu favor, discretamente', 'Pedir a um amigo pra decidir por você informalmente'],
    indice_correto: 1,
    feedback: 'Transparência primeiro: declarar o conflito protege você e a empresa.',
  },
  {
    id: 'q-cond3-3', modulo_id: 'mod-cond-3', ordem: 2, pontos: 30,
    enunciado: 'Por que a DG trata conflito de interesse como tema formal de conduta?',
    alternativas: ['Para burocratizar decisões simples', 'Porque decisões enviesadas corroem a confiança e a qualidade da entrega', 'Não é um tema relevante no dia a dia', 'Só se aplica a cargos de diretoria'],
    indice_correto: 1,
    feedback: 'Decisão enviesada por interesse pessoal é o tipo de risco que corrói a confiança de dentro pra fora.',
  },

  // Trilha: Integração DG Tech — quiz único do módulo "Regras da Casa" (questões
  // provisórias, aguardando roteiro definitivo do cliente)
  {
    id: 'q-regras-casa-1', modulo_id: 'mod-regras-casa', ordem: 0, pontos: 30,
    enunciado: 'Qual é o objetivo das "Regras da Casa" da DG Tech?',
    alternativas: ['Burocratizar o trabalho sem necessidade', 'Estabelecer um padrão claro de convivência e organização para todos', 'Substituir o bom senso completamente', 'Só existem no papel, sem uso prático'],
    indice_correto: 1,
    feedback: 'A regra existe pra todo mundo saber o que esperar do outro, sem depender de interpretação individual.',
  },
  {
    id: 'q-regras-casa-2', modulo_id: 'mod-regras-casa', ordem: 1, pontos: 30,
    enunciado: 'Ao ver uma regra da casa sendo descumprida, qual a atitude esperada?',
    alternativas: ['Ignorar, não é problema seu', 'Comunicar de forma respeitosa e, se necessário, reportar ao gestor', 'Repreender publicamente o colega', 'Copiar o comportamento já que ninguém cobra'],
    indice_correto: 1,
    feedback: 'Regra descumprida se resolve com comunicação direta e respeitosa — não com silêncio nem com confronto público.',
  },
  {
    id: 'q-regras-casa-3', modulo_id: 'mod-regras-casa', ordem: 2, pontos: 30,
    enunciado: 'Por que cumprir horários é importante na DG Tech?',
    alternativas: ['Porque é só uma formalidade', 'Porque impacta diretamente a equipe e o cronograma do trabalho', 'Só importa em datas de auditoria', 'Não tem relação com o resultado do time'],
    indice_correto: 1,
    feedback: 'Atraso de um afeta o cronograma de todos — pontualidade é trabalho em equipe.',
  },
  {
    id: 'q-regras-casa-4', modulo_id: 'mod-regras-casa', ordem: 3, pontos: 30,
    enunciado: 'Equipamentos e áreas comuns são de uso compartilhado. O que isso pede de cada um?',
    alternativas: ['Nada — quem limpa é outra equipe', 'Zelo: devolver e deixar organizado para o próximo colaborador usar', 'Uso livre, sem necessidade de cuidado extra', 'Só importa se o gestor estiver por perto'],
    indice_correto: 1,
    feedback: 'Espaço e equipamento de todos só funcionam bem se cada um cuidar como se fosse seu.',
  },
  {
    id: 'q-regras-casa-5', modulo_id: 'mod-regras-casa', ordem: 4, pontos: 30,
    enunciado: 'No estacionamento, o que deve ser evitado?',
    alternativas: ['Estacionar de ré', 'Bloquear a saída de outros veículos ou ocupar vaga reservada sem autorização', 'Usar vaga próxima à entrada', 'Estacionar antes das 8h'],
    indice_correto: 1,
    feedback: 'Bloquear saída ou ocupar vaga reservada transforma um problema seu no problema de todo mundo.',
  },
]

export const CONCLUSOES: ConclusaoModulo[] = [
  { id: 'c-1', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, modulo_id: 'mod-1', acertos: 3, total: 3, pontos_ganhos: 90, concluido_em: '2026-07-18T14:00:00Z' },
  { id: 'c-2', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, modulo_id: 'mod-2', acertos: 2, total: 3, pontos_ganhos: 60, concluido_em: '2026-07-19T10:30:00Z' },
]

export const PROGRESSO: ProgressoAula[] = [
  { id: 'p-1', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, aula_id: 'aula-1', segmentos: [[0, 180]], segundos_assistidos: 180, seek_liberado: true, concluida_em: '2026-07-18T14:00:00Z', atualizado_em: '2026-07-18T14:00:00Z' },
  { id: 'p-2', tenant_id: TENANT_ID, user_id: USUARIO_ATUAL.id, aula_id: 'aula-2', segmentos: [[0, 240]], segundos_assistidos: 240, seek_liberado: true, concluida_em: '2026-07-19T10:30:00Z', atualizado_em: '2026-07-19T10:30:00Z' },
]

/**
 * Comentários — V1.1, mas a tela já nasce aqui (tabela também, ver
 * supabase/migrations/0001_schema.sql). Seed só na aula do Código de Conduta,
 * pra tela não nascer vazia; as demais começam sem comentário nenhum.
 */
export const COMENTARIOS: Comentario[] = [
  {
    id: 'com-1',
    tenant_id: TENANT_ID,
    aula_id: 'aula-3',
    user_id: 'user-juliana',
    parent_id: null,
    texto: 'Bem direto ao ponto. Ajuda bastante ter exemplo prático de cliente, não só a regra seca.',
    criado_em: '2026-07-19T11:20:00Z',
  },
  {
    id: 'com-2',
    tenant_id: TENANT_ID,
    aula_id: 'aula-3',
    user_id: 'user-rafael',
    parent_id: null,
    texto: 'Essa parte do canal de conduta com discrição eu não conhecia. Bom saber que existe.',
    criado_em: '2026-07-19T15:45:00Z',
  },
]

export const COLABORADORES: ProgressoColaborador[] = [
  { user_id: 'user-marcos', tenant_id: TENANT_ID, nome: 'Marcos Oliveira', cargo: 'Eletricista Jr.', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 2, aulas_totais: 6, pontos_total: 150, ultima_atividade: '2026-07-20T09:00:00Z' },
  { user_id: 'user-juliana', tenant_id: TENANT_ID, nome: 'Juliana Prado', cargo: 'Téc. Segurança', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 6, aulas_totais: 6, pontos_total: 420, ultima_atividade: '2026-07-19T16:40:00Z' },
  { user_id: 'user-rafael', tenant_id: TENANT_ID, nome: 'Rafael Nunes', cargo: 'Eletricista Pleno', setor_id: 'setor-campo', foto_url: null, aulas_concluidas: 4, aulas_totais: 6, pontos_total: 300, ultima_atividade: '2026-07-20T09:12:00Z' },
  { user_id: 'user-camila', tenant_id: TENANT_ID, nome: 'Camila Souza', cargo: 'Aux. Administrativo', setor_id: 'setor-adm', foto_url: null, aulas_concluidas: 1, aulas_totais: 6, pontos_total: 60, ultima_atividade: '2026-07-20T11:35:00Z' },
]
