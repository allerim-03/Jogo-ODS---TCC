const dadosODS = {
    1: {
        tag: "ODS 1",
        titulo: "Erradicação da Pobreza",
        imagem: "img/ods1.png",
        descricao: "Garantir que todas as pessoas tenham o necessário para viver com dignidade, comida, casa, vestuário e acesso a oportunidades de ter uma vida melhor."
    },
    2: {
        tag: "ODS 2",
        titulo: "Fome Zero e Agricultura Sustentável",
        imagem: "img/ods2.png",
        descricao: "Acabar com a fome no mundo, promovendo a distribuição justa de refeições saudáveis e ajudando os agricultores a produzirem sem agredir a natureza."
    },
    3: {
        tag: "ODS 3",
        titulo: "Saúde e Bem-Estar",
        imagem: "img/ods3.png",
        descricao: "Cuidar da saúde de crianças, adultos e idosos, oferecendo hospitais de qualidade, vacinas e incentivo à prática de hábitos de vida saudáveis."
    },
    4: {
        tag: "ODS 4",
        titulo: "Educação de Qualidade",
        imagem: "img/ods4.png",
        descricao: "Garantir que todas as crianças e jovens possam ir à escola, aprender brincando e ter acesso a computadores, livros e bons professores."
    },
    5: {
        tag: "ODS 5",
        titulo: "Igualdade de Gênero",
        imagem: "img/ods5.png",
        descricao: "Assegurar direitos iguais para meninas e meninos, garantindo respeito, segurança e as mesmas oportunidades de crescimento no futuro."
    },
    6: {
        tag: "ODS 6",
        titulo: "Água Potável e Saneamento",
        imagem: "img/ods6.png",
        descricao: "Proteger os rios e fontes de água limpa para beber, tomar banho e manter o planeta limpo e livre de contaminações."
    },
    7: {
        tag: "ODS 7",
        titulo: "Energia Limpa e Acessível",
        imagem: "img/ods7.png",
        descricao: "Utilizar energia gerada pelo sol, pelo vento e pela água em substituição a fontes que poluem a atmosfera e danificam a camada de ozônio."
    },
    8: {
        tag: "ODS 8",
        titulo: "Trabalho Decente e Crescimento Econômico",
        imagem: "img/ods8.png",
        descricao: "Ajudar a criar empregos seguros, pagos de forma justa e sem exploração para que as pessoas possam cuidar de suas famílias."
    },
    9: {
        tag: "ODS 9",
        titulo: "Indústria, Inovação e Infraestrutura",
        imagem: "img/ods9.png",
        descricao: "Construir estradas, redes de internet e fábricas modernas que usem a tecnologia para resolver problemas da sociedade."
    },
    10: {
        tag: "ODS 10",
        titulo: "Redução das Desigualdades",
        imagem: "img/ods10.png",
        descricao: "Lutar contra o preconceito e garantir que pessoas de diferentes origens, raças e condições financeiras tenham as mesmas oportunidades."
    },
    11: {
        tag: "ODS 11",
        titulo: "Cidades e Comunidades Sustentáveis",
        imagem: "img/ods11.png",
        descricao: "Tornar os bairros e cidades mais seguros, arborizados, com transporte limpo e espaços públicos agradáveis para brincar e conviver."
    },
    12: {
        tag: "ODS 12",
        titulo: "Consumo e Produção Responsáveis",
        imagem: "img/ods12.png",
        descricao: "Reduzir o lixo, reciclar embalagens e aprender a consumir apenas o necessário para não esgotar as riquezas da Terra."
    },
    13: {
        tag: "ODS 13",
        titulo: "Ação Contra a Mudança Global do Clima",
        imagem: "img/ods13.png",
        descricao: "Combater o aquecimento global plantando árvores, economizando energia e evitando emissões de fumaça poluente no ar."
    },
    14: {
        tag: "ODS 14",
        titulo: "Vida na Água",
        imagem: "img/ods14.png",
        descricao: "Proteger peixes, corais e tartarugas, limpando os oceanos e acabando com a poluição de plásticos no mar."
    },
    15: {
        tag: "ODS 15",
        titulo: "Vida Terrestre",
        imagem: "img/ods15.png",
        descricao: "Cuidar de florestas, matas e animais terrestres, combatendo o desmatamento e salvando espécies em risco de extinção."
    },
    16: {
        tag: "ODS 16",
        titulo: "Paz, Justiça e Instituições Eficazes",
        imagem: "img/ods16.png",
        descricao: "Promover um mundo sem violência, onde o respeito à lei e a ajuda ao próximo sirvam de base para a convivência pacífica."
    },
    17: {
        tag: "ODS 17",
        titulo: "Parcerias e Meios de Implementação",
        imagem: "img/ods17.png",
        descricao: "Unir países, escolas, governos e cidadãos para juntos alcançarem todas as metas de sustentabilidade do planeta."
    }
};

function abrirModal(id) {
    const modal = document.getElementById('ods-modal');
    const ods = dadosODS[id]; // Corrigido para acessar dadosODS

    if (ods) {
        document.getElementById('modal-tag').innerText = ods.tag;
        document.getElementById('modal-titulo').innerText = ods.titulo;
        document.getElementById('modal-descricao').innerText = ods.descricao;
        document.getElementById('modal-img').src = ods.imagem; // Pega o caminho 'img/ods1.png' etc

        modal.classList.add('ativo');
    }
}

function fecharModal() {
    document.getElementById('ods-modal').classList.remove('ativo');
}

function fecharModalFora(event) {
    if (event.target.id === 'ods-modal') {
        fecharModal();
    }
}