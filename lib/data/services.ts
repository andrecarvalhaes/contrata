import { LucideIcon } from 'lucide-react'

export interface Service {
  categoria: string
  servico: string
  descricao_curta: string
}

export interface Category {
  id: string
  name: string
  iconName: string
  count: number
}

export const categories: Category[] = [
  { id: 'all', name: 'Todas as categorias', iconName: 'Search', count: 247 },
  { id: 'inspecoes-tecnicas', name: 'Inspeções Técnicas', iconName: 'ClipboardCheck', count: 48 },
  { id: 'tanques-armazenamento', name: 'Tanques e Armazenamento', iconName: 'Container', count: 42 },
  { id: 'bombas-dispensers', name: 'Bombas e Dispensers', iconName: 'Fuel', count: 38 },
  { id: 'eletrica-automacao', name: 'Elétrica e Automação', iconName: 'Zap', count: 35 },
  { id: 'controle-qualidade', name: 'Controle de Qualidade', iconName: 'FlaskConical', count: 28 },
  { id: 'construcao-civil', name: 'Construção Civil', iconName: 'HardHat', count: 56 },
  { id: 'saude-seguranca', name: 'Saúde e Segurança', iconName: 'ShieldCheck', count: 45 },
  { id: 'meio-ambiente', name: 'Meio Ambiente', iconName: 'Leaf', count: 32 },
  { id: 'metrologia', name: 'Metrologia', iconName: 'Ruler', count: 15 },
  { id: 'lavagem-veiculos', name: 'Lavagem de Veículos', iconName: 'Droplets', count: 12 },
  { id: 'servicos-automotivos', name: 'Serviços Automotivos', iconName: 'Wrench', count: 24 },
  { id: 'gestao-frotas', name: 'Gestão de Frotas', iconName: 'Truck', count: 18 },
  { id: 'energia-sustentavel', name: 'Energia Sustentável', iconName: 'Sun', count: 9 },
  { id: 'digital-tecnologia', name: 'Digital e Tecnologia', iconName: 'Laptop', count: 16 },
  { id: 'treinamentos', name: 'Treinamentos', iconName: 'GraduationCap', count: 22 },
]

export const services: Service[] = [
  // Inspeções Técnicas
  { categoria: 'Inspeções Técnicas', servico: 'Arqueação de Tanques', descricao_curta: 'Medição volumétrica precisa dos tanques — gera tabelas de referência para controle de estoque' },
  { categoria: 'Inspeções Técnicas', servico: 'Teste de Estanqueidade em SASC', descricao_curta: 'Verificação de integridade do sistema de armazenamento subterrâneo — detecção de vazamentos' },
  { categoria: 'Inspeções Técnicas', servico: 'Teste de Estanqueidade em SAAC', descricao_curta: 'Verificação de integridade do sistema de armazenamento aéreo de combustíveis' },
  { categoria: 'Inspeções Técnicas', servico: 'Teste Hidrostático de Caixas de Contenção', descricao_curta: 'Ensaio de pressão com água para verificar integridade das caixas de contenção (sumps)' },
  { categoria: 'Inspeções Técnicas', servico: 'Teste de Interstício', descricao_curta: 'Verificação do espaço intersticial em tanques de parede dupla' },
  { categoria: 'Inspeções Técnicas', servico: 'Teste de Estanqueidade em Rede de Gás GLP', descricao_curta: 'Ensaio de estanqueidade em redes de distribuição de gás liquefeito de petróleo' },
  { categoria: 'Inspeções Técnicas', servico: 'Relatório Técnico de Conformidade em SASC e SAAC', descricao_curta: 'Documento técnico que atesta conformidade dos sistemas de armazenamento com normas NBR' },
  { categoria: 'Inspeções Técnicas', servico: 'Inspeção em Vasos de Pressão conforme NR-13', descricao_curta: 'Inspeção técnica em vasos de pressão com emissão de laudos conforme NR-13' },
  { categoria: 'Inspeções Técnicas', servico: 'Plano de Manutenção Preventiva e Corretiva', descricao_curta: 'Elaboração de cronograma estruturado de manutenções periódicas e ações corretivas' },
  { categoria: 'Inspeções Técnicas', servico: 'Laudo de Inspeção conforme NR-12', descricao_curta: 'Avaliação de máquinas e equipamentos às exigências de segurança da NR-12' },

  // Tanques e Armazenamento
  { categoria: 'Tanques e Armazenamento', servico: 'Projeto e Instalação de SASC', descricao_curta: 'Projeto e execução de sistemas de armazenamento subterrâneo de combustíveis conforme NBR' },
  { categoria: 'Tanques e Armazenamento', servico: 'Projeto e Instalação de SAAC', descricao_curta: 'Projeto e execução de sistemas de armazenamento aéreo de combustíveis conforme NBR' },
  { categoria: 'Tanques e Armazenamento', servico: 'Revestimento Interno de Tanques — Simples', descricao_curta: 'Revestimento interno protetor de tanques — aplicação rápida que elimina a necessidade de remoção' },
  { categoria: 'Tanques e Armazenamento', servico: 'Revestimento Interno de Tanques — Dupla Parede', descricao_curta: 'Revestimento com criação de interstício — proteção secundária contra vazamentos' },
  { categoria: 'Tanques e Armazenamento', servico: 'Requalificação de Tanques Aéreos', descricao_curta: 'Recuperação e recertificação de tanques aéreos conforme procedimentos CETESB' },
  { categoria: 'Tanques e Armazenamento', servico: 'Higienização Interna de Tanques', descricao_curta: 'Limpeza profunda e descontaminação interna com descarte ambientalmente correto' },
  { categoria: 'Tanques e Armazenamento', servico: 'Reparo Mecânico em Tanques Aéreos', descricao_curta: 'Reparo estrutural em tanques aéreos — solda e substituição de componentes' },
  { categoria: 'Tanques e Armazenamento', servico: 'Limpeza de Sumps', descricao_curta: 'Limpeza especializada das caixas de contenção — remoção de resíduos acumulados' },
  { categoria: 'Tanques e Armazenamento', servico: 'Instalação de Sensor de Nível em Tanques', descricao_curta: 'Instalação de sistemas de monitoramento eletrônico de nível de combustível nos tanques' },

  // Bombas e Dispensers
  { categoria: 'Bombas e Dispensers', servico: 'Manutenção Preventiva de Dispensers', descricao_curta: 'Revisão periódica de bombas de abastecimento — calibração + troca de peças de desgaste' },
  { categoria: 'Bombas e Dispensers', servico: 'Manutenção Corretiva de Dispensers', descricao_curta: 'Reparo de bombas de abastecimento com diagnóstico e substituição de componentes defeituosos' },
  { categoria: 'Bombas e Dispensers', servico: 'Calibração de Dispensers', descricao_curta: 'Verificação e ajuste metrológico das bombas para garantir precisão na medição do combustível dispensado' },
  { categoria: 'Bombas e Dispensers', servico: 'Substituição de Mangueiras e Bicos', descricao_curta: 'Troca de mangueiras e bicos de abastecimento conforme desgaste ou exigência normativa' },
  { categoria: 'Bombas e Dispensers', servico: 'Manutenção de Sistema de Recuperação de Vapor', descricao_curta: 'Revisão e reparo do sistema de recuperação de vapores de combustível (fase I e fase II)' },
  { categoria: 'Bombas e Dispensers', servico: 'Instalação de Automação de Pista', descricao_curta: 'Integração de dispensers com sistema de automação comercial do posto' },

  // Elétrica e Automação
  { categoria: 'Elétrica e Automação', servico: 'Instalação e Manutenção de Sistema Elétrico', descricao_curta: 'Instalação e manutenção de quadros elétricos e fiação da infraestrutura do posto' },
  { categoria: 'Elétrica e Automação', servico: 'Instalação de Iluminação de Pista', descricao_curta: 'Instalação e manutenção de iluminação em postes e marquise da pista de abastecimento' },
  { categoria: 'Elétrica e Automação', servico: 'Instalação de SPDA (Para-raios)', descricao_curta: 'Projeto e instalação de sistema de proteção contra descargas atmosféricas conforme ABNT' },
  { categoria: 'Elétrica e Automação', servico: 'Manutenção de SPDA', descricao_curta: 'Inspeção e manutenção periódica do sistema de para-raios' },
  { categoria: 'Elétrica e Automação', servico: 'Instalação de Aterramento Elétrico', descricao_curta: 'Execução de sistema de aterramento elétrico para segurança das instalações' },
  { categoria: 'Elétrica e Automação', servico: 'Instalação de CFTV', descricao_curta: 'Instalação de câmeras de segurança e sistema de monitoramento por vídeo' },
  { categoria: 'Elétrica e Automação', servico: 'Instalação e Manutenção de Ar-condicionado', descricao_curta: 'Instalação e manutenção de equipamentos de climatização em loja e escritório' },

  // Controle de Qualidade de Combustível
  { categoria: 'Controle de Qualidade de Combustível', servico: 'Análise Laboratorial de Combustível', descricao_curta: 'Coleta de amostras e análise laboratorial para verificar conformidade do combustível com especificações ANP' },
  { categoria: 'Controle de Qualidade de Combustível', servico: 'Teste Rápido de Adulteração de Combustível', descricao_curta: 'Verificação in loco da qualidade do combustível — detecção de adulteração por métodos rápidos' },

  // Construção Civil
  { categoria: 'Construção Civil', servico: 'Construção de Pista de Abastecimento', descricao_curta: 'Execução de pista com infraestrutura completa — concreto + drenagem + contenção' },
  { categoria: 'Construção Civil', servico: 'Reforma e Manutenção de Loja de Conveniência', descricao_curta: 'Obras de reforma e manutenção da área de loja e atendimento ao cliente' },
  { categoria: 'Construção Civil', servico: 'Construção e Reforma de Cobertura (Marquise)', descricao_curta: 'Execução ou reforma da estrutura de cobertura da pista de abastecimento' },
  { categoria: 'Construção Civil', servico: 'Impermeabilização de Laje e Cobertura', descricao_curta: 'Aplicação de impermeabilizante em lajes e coberturas para evitar infiltrações' },
  { categoria: 'Construção Civil', servico: 'Pavimentação e Recuperação de Piso', descricao_curta: 'Recuperação e reparo de piso de concreto ou asfalto na pista e pátio' },
  { categoria: 'Construção Civil', servico: 'Implantação de Sistema de Drenagem', descricao_curta: 'Execução de canaletas e sistema de drenagem pluvial e oleosa' },
  { categoria: 'Construção Civil', servico: 'Construção de Posto do Zero à Chave', descricao_curta: 'Execução completa do posto de combustível — projeto até entrega operacional' },
  { categoria: 'Construção Civil', servico: 'Construção e Reforma de Banheiros', descricao_curta: 'Obras de construção e reforma de sanitários para colaboradores e clientes' },
  { categoria: 'Construção Civil', servico: 'Impermeabilização de Bacias de Contenção', descricao_curta: 'Proteção de bacias de contenção contra infiltrações e contaminação ambiental' },
  { categoria: 'Construção Civil', servico: 'Projeto Blindagem Completa da Pista', descricao_curta: 'Solução integrada de impermeabilização + canaletas + bacias para a área de abastecimento' },
  { categoria: 'Construção Civil', servico: 'Pinturas Preventivas e Corretivas', descricao_curta: 'Revestimentos e pinturas em estruturas metálicas e paredes — proteção contra corrosão' },

  // Saúde e Segurança do Trabalho
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Exames Ocupacionais', descricao_curta: 'Exames admissionais, periódicos e demissionais conforme legislação trabalhista' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Laudos Técnicos de Insalubridade e Periculosidade (NR-15 / NR-16)', descricao_curta: 'Elaboração de laudos técnicos para cumprimento de obrigações legais e previdenciárias' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'PCMSO — Programa de Controle Médico de Saúde Ocupacional', descricao_curta: 'Programa de saúde ocupacional obrigatório por lei' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'PGR — Programa de Gerenciamento de Riscos', descricao_curta: 'Documento obrigatório de identificação e gestão de riscos ocupacionais' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'LTCAT — Laudo Técnico de Condições Ambientais', descricao_curta: 'Laudo técnico para aposentadoria especial e benefícios previdenciários' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'AET — Análise Ergonômica do Trabalho', descricao_curta: 'Análise das condições ergonômicas dos postos de trabalho' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Laudo SPDA', descricao_curta: 'Inspeção e emissão de laudo técnico do sistema de para-raios conforme ABNT' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Projeto e Instalação de Sistema de Combate a Incêndios', descricao_curta: 'Projeto + instalação + manutenção de sistemas de proteção contra incêndio' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Manutenção de Extintores', descricao_curta: 'Recarga e manutenção periódica de extintores conforme exigência legal' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Bombeiro Civil', descricao_curta: 'Disponibilização de profissional bombeiro civil para prevenção e atendimento a emergências' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Treinamentos NRs (NR-5 / NR-10 / NR-20 / NR-33 / NR-35)', descricao_curta: 'Cursos de capacitação com certificação nas principais normas regulamentadoras' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Treinamento de Brigada de Incêndio', descricao_curta: 'Formação e treinamento de brigada de emergência no posto' },
  { categoria: 'Saúde e Segurança do Trabalho', servico: 'Sinalização de Segurança', descricao_curta: 'Fornecimento e instalação de placas e sinalizações conforme normas de segurança' },

  // Meio Ambiente
  { categoria: 'Meio Ambiente', servico: 'Licenciamento Ambiental Completo', descricao_curta: 'Condução do processo de licenciamento (LP → LO) junto aos órgãos ambientais competentes' },
  { categoria: 'Meio Ambiente', servico: 'Gestão de Conformidade Regulatória Ambiental', descricao_curta: 'Monitoramento contínuo e gestão das obrigações ambientais do empreendimento' },
  { categoria: 'Meio Ambiente', servico: 'Consultoria em Legislação Ambiental', descricao_curta: 'Assessoria técnica em normas e regulações ambientais aplicáveis ao setor de combustíveis' },
  { categoria: 'Meio Ambiente', servico: 'Remediação de Área Contaminada', descricao_curta: 'Investigação + diagnóstico + execução de plano de remediação de solo e água subterrânea' },
  { categoria: 'Meio Ambiente', servico: 'Avaliação Ambiental (Investigação de Solo e Água)', descricao_curta: 'Estudo técnico de condições ambientais com relatórios para órgãos reguladores' },
  { categoria: 'Meio Ambiente', servico: 'Limpeza e Manutenção de Caixa Separadora de Água e Óleo', descricao_curta: 'Limpeza periódica da caixa separadora (CAS) e destinação correta dos resíduos oleosos' },
  { categoria: 'Meio Ambiente', servico: 'Destinação de Resíduos Oleosos e Contaminados', descricao_curta: 'Coleta e destinação ambientalmente correta de resíduos oleosos gerados na operação' },

  // Metrologia
  { categoria: 'Metrologia', servico: 'Calibração Certificada de Equipamentos', descricao_curta: 'Calibração de alta precisão com rastreabilidade garantida em laboratório certificado' },
  { categoria: 'Metrologia', servico: 'Certificação Metrológica Rastreável', descricao_curta: 'Emissão de certificados com rastreabilidade a padrões nacionais e internacionais (INMETRO)' },
  { categoria: 'Metrologia', servico: 'Laudos Técnicos Metrológicos', descricao_curta: 'Laudos com análise de incerteza de medição e avaliação de conformidade dos equipamentos' },

  // Lavagem de Veículos
  { categoria: 'Lavagem de Veículos', servico: 'Sistema de Lavagem Automática', descricao_curta: 'Lavagem automática para veículos leves e pesados — tecnologia modular com redução de consumo de água' },
  { categoria: 'Lavagem de Veículos', servico: 'Lavagem Manual', descricao_curta: 'Serviço de lavagem manual de veículos com produtos especializados' },
  { categoria: 'Lavagem de Veículos', servico: 'Aspiração e Higienização Interna', descricao_curta: 'Limpeza interna de veículos — aspiração + higienização de tapetes e bancos' },
  { categoria: 'Lavagem de Veículos', servico: 'Manutenção de Equipamentos de Lavagem', descricao_curta: 'Manutenção preventiva e corretiva dos equipamentos de lavagem instalados no posto' },

  // Serviços Automotivos
  { categoria: 'Serviços Automotivos', servico: 'Troca de Óleo e Filtros', descricao_curta: 'Serviço de troca de óleo do motor e filtros com produtos certificados' },
  { categoria: 'Serviços Automotivos', servico: 'Calibração de Pneus', descricao_curta: 'Calibração manual ou automatizada dos pneus — serviço prestado na pista' },
  { categoria: 'Serviços Automotivos', servico: 'Alinhamento e Balanceamento', descricao_curta: 'Alinhamento e balanceamento de rodas com equipamentos específicos' },
  { categoria: 'Serviços Automotivos', servico: 'Borracharia', descricao_curta: 'Reparo e substituição de pneus — serviço no posto' },
  { categoria: 'Serviços Automotivos', servico: 'Abastecimento de Arla 32', descricao_curta: 'Fornecimento e abastecimento de solução arla 32 para veículos diesel com sistema SCR' },

  // Gestão de Frotas
  { categoria: 'Gestão de Frotas', servico: 'Sistema de Gestão de Abastecimento de Frotas', descricao_curta: 'Controle inteligente de abastecimento corporativo com relatórios e monitoramento em tempo real' },
  { categoria: 'Gestão de Frotas', servico: 'Implantação de Sistema Antifraude de Abastecimento', descricao_curta: 'Tecnologia de controle para prevenção de fraudes no abastecimento de frotas' },

  // Energia Sustentável
  { categoria: 'Energia Sustentável', servico: 'Projeto de Energia Solar Fotovoltaica', descricao_curta: 'Projeto e instalação de sistema fotovoltaico para geração de energia elétrica no posto' },
  { categoria: 'Energia Sustentável', servico: 'Manutenção de Sistema Fotovoltaico', descricao_curta: 'Manutenção preventiva e corretiva de painéis e inversores solares instalados' },

  // Digital e Tecnologia
  { categoria: 'Digital e Tecnologia', servico: 'Implantação de Sistema de Automação Comercial', descricao_curta: 'Instalação e configuração de sistema integrado de gestão do posto (PDV + automação de pista)' },
  { categoria: 'Digital e Tecnologia', servico: 'Manutenção de Sistema de Gestão (PDV)', descricao_curta: 'Suporte e manutenção corretiva do sistema de ponto de venda e gestão operacional' },
  { categoria: 'Digital e Tecnologia', servico: 'Instalação de Rede Lógica (Internet / Cabeamento)', descricao_curta: 'Infraestrutura de rede cabeada e wireless para operação do posto' },

  // Treinamentos e Capacitação
  { categoria: 'Treinamentos e Capacitação', servico: 'Capacitação de Frentistas', descricao_curta: 'Treinamento operacional de frentistas — atendimento, segurança e técnicas de abastecimento' },
  { categoria: 'Treinamentos e Capacitação', servico: 'Capacitação de Gerentes de Posto', descricao_curta: 'Formação gerencial com foco em operação, controle de estoque e gestão de equipe' },
  { categoria: 'Treinamentos e Capacitação', servico: 'Consultorias Operacionais', descricao_curta: 'Assessoria técnica em operação do posto — conformidade normativa e otimização de processos' },
]

export function getCategoryIconName(categoria: string): string {
  const categoryMap: Record<string, string> = {
    'Inspeções Técnicas': 'ClipboardCheck',
    'Tanques e Armazenamento': 'Container',
    'Bombas e Dispensers': 'Fuel',
    'Elétrica e Automação': 'Zap',
    'Controle de Qualidade de Combustível': 'FlaskConical',
    'Construção Civil': 'HardHat',
    'Saúde e Segurança do Trabalho': 'ShieldCheck',
    'Meio Ambiente': 'Leaf',
    'Metrologia': 'Ruler',
    'Lavagem de Veículos': 'Droplets',
    'Serviços Automotivos': 'Wrench',
    'Gestão de Frotas': 'Truck',
    'Energia Sustentável': 'Sun',
    'Digital e Tecnologia': 'Laptop',
    'Treinamentos e Capacitação': 'GraduationCap',
  }
  return categoryMap[categoria] || 'Wrench'
}

export function getCategoryId(categoria: string): string {
  const categoryIdMap: Record<string, string> = {
    'Inspeções Técnicas': 'inspecoes-tecnicas',
    'Tanques e Armazenamento': 'tanques-armazenamento',
    'Bombas e Dispensers': 'bombas-dispensers',
    'Elétrica e Automação': 'eletrica-automacao',
    'Controle de Qualidade de Combustível': 'controle-qualidade',
    'Construção Civil': 'construcao-civil',
    'Saúde e Segurança do Trabalho': 'saude-seguranca',
    'Meio Ambiente': 'meio-ambiente',
    'Metrologia': 'metrologia',
    'Lavagem de Veículos': 'lavagem-veiculos',
    'Serviços Automotivos': 'servicos-automotivos',
    'Gestão de Frotas': 'gestao-frotas',
    'Energia Sustentável': 'energia-sustentavel',
    'Digital e Tecnologia': 'digital-tecnologia',
    'Treinamentos e Capacitação': 'treinamentos',
  }
  return categoryIdMap[categoria] || 'all'
}
