//variaveis globais
const apiBuzzQuizz = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let scrollar = null;
let contadorRespostasCertas = 0;
let contadorAlternativasMarcadas = 0;
let guardarIdDoQuizzAberto = undefined;

let tituloQuizz = "null";
let valorUrl = "null";
let qtdPerguntas = "null";
let qtdNiveis = "null";
let qtdPerguntasNumero = "null";
let qtdNiveisNumero = "null";

// So pra guardar um html (Ignora)
let guardarhtml = `
<!-- Se tiver algum Quizz criado já -->
<article class="lista-seus-quizzes">
    <span>
                <p>Seus Quizzes</p>
                <ion-icon name="add-circle" onclick="criarQuizz()"></ion-icon>
            </span>
            <!-- Seu Quizz Individual -->
            <div class="seu-quizz" onclick="abrirQuizz(this)">
                <span>
                    <p>O quão Potterhead é você?</p>
                </span>
            </div>
            <!-- Seu Quizz Individual -->
            <div class="seu-quizz" onclick="abrirQuizz(this)">
                <span>
                    <p>O quão Potterhead é você?</p>
                </span>
            </div>
        </article>
    </section>
`;

// Variaveis que guarda as página

let telaRevisaoFinalQuizz = `
<!-- Tela 3.4 -->
<section class="tela_3-4">
    <h2>Seu quizz está pronto!</h2>

    <div class="quiz-finalizado">
        <img src="imagens/Rectangle 34.png" alt="O quão Potterhead é você?">
        <p>O quão Potterhead é você?</p>
    </div>

    <button class="acessar-quiz" type="button" onclick="acessarQuizz()">Acessar Quizz</button>
    <button class="voltar-home" type="button" onclick="abrirHome()">Voltar pra home</button>
</section>  
`;

// Tela 1
async function abrirHome() {
    // Renderiza a home até o "Seus Quizzes"
    const telaHome =`
    <section class="seus-quizzes">
        <article class="adicionar-primeiroquizz">
            <span>
                <p>Você não criou nenhum quizz ainda :(</p>
            </span>
            <div class="criar-quizz" onclick="criarQuizz()">
                <p>Criar Quizz</p>
            </div>
        </article>
    </section>
    <section class="todos-quizzes">
        <p>Todos os Quizzes</p>
        <article class="lista-todos-quizzes">
        </article>
    </section>
    `;
    document.querySelector('main').innerHTML = telaHome;

    // Pega os quizzes do servidor e renderiza eles
    await axios.get(apiBuzzQuizz).then(response => {
        const quizzesDoServidor = response.data;
        quizzesDoServidor.forEach(element => {
            const backgroundConteinerQuizz = `
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); 
            background-size: 100%;
            `;
            let conteinerComQuizz = `
            <div class="quizz" onclick="abrirQuizz(this)" style="${backgroundConteinerQuizz}" id="${element.id}">
                <span>
                    <p>${element.title}</p>
                </span>
            </div>
            `;
            document.querySelector('.lista-todos-quizzes').innerHTML += conteinerComQuizz;
        });
    });
}

// Funções Relacionada a abrir o Quizz
async function abrirQuizz(identificador) {
    guardarIdDoQuizzAberto = identificador.id;
    await axios.get(apiBuzzQuizz + `/${guardarIdDoQuizzAberto}`).then(response => {

        // Varieaveis importantes
        const dadosDoQuizzSelecionado = response.data;
        const backgroundConteinerQuizz = `
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${dadosDoQuizzSelecionado.image}); 
            background-size: 100%;
            `;
        const tituloTemaQuizz = `
        <section class="tema-quizz" style="${backgroundConteinerQuizz}">
            <span>
                <p>${dadosDoQuizzSelecionado.title}</p>
            </span>
        </section>
        <section class="perguntas-quizz">
        </section>
        `;
        const conteinerPerguntas = dadosDoQuizzSelecionado.questions;
        

        // Renderiza a Page do Quizz
        document.querySelector('main').innerHTML = tituloTemaQuizz;
        // Renderiza o conteiner maior da Pergunta
        conteinerPerguntas.forEach(element => {
            const conteinerComPerguntaQuizz = `
            <article class="conteiner-pergunta-maior">
                <div class="conteiner-pegunta-menor">
                    <div class="titulo-pergunta" style="background-color: ${element.color};">
                        <p>${element.title}</p>
                    </div>
                    <div class="alternativas-pergunta" data-clicavel="true">
                    </div>
                </div>
            </article>
            `;
            document.querySelector('.perguntas-quizz').innerHTML += conteinerComPerguntaQuizz;

        });
        // Renderiza as alternativas
        for (let index = 0; index < conteinerPerguntas.length; index++) {
            let conta = 0;
            const alternativaPerguntas = dadosDoQuizzSelecionado.questions[index].answers;
            alternativaPerguntas.forEach(element => {
                const conteinerComAlternativa = `
                <div class="alternativa-individual" data-id=${conta++} data-answer=${element.isCorrectAnswer} onclick="selecionarResposta(this)">
                    <img src="${element.image}" alt="hogwarts">
                    <span>
                        <p>${element.text}</p>
                    </span>
                </div>
                `;
                document.querySelectorAll('.alternativas-pergunta')[index].innerHTML += conteinerComAlternativa;
            });
        }

        
    })
}
function selecionarResposta(element) {

    let arrayComConteinersPergunta = document.querySelectorAll('.conteiner-pergunta-maior');
    let parent = element.parentNode;

    if(parent.dataset.clicavel === "false"){
        return;
    }
    // Guarda o NUM de respostas acertadas
    if (element.dataset.answer === "true") {
        contadorRespostasCertas++;
    }

    let alternativas = parent.querySelectorAll(".alternativa-individual")
    for(let i = 0; i < alternativas.length; i++){
        let node = alternativas[i];

        // opaco nas alternativas que não foram clicadas
        if(node.dataset.id !== element.dataset.id){
            node.classList.add("opaco");
        }

        // cores nas alternativas corretas e incorretas
        if(node.dataset.answer === "true"){
            node.querySelector("p").classList.add("alternativaCorreta");
        }else{
            node.querySelector("p").classList.add("alternativaIncorreta");
        }
    }

    //scrollar para próxima pergunta após 2 segundos da escolha da resposta
    scrollar = parent;
    setTimeout(() => {
        if(scrollar !== null){
            scrollar.scrollIntoView();
        }
    }, 2000)
    
    contadorAlternativasMarcadas++;
    if (arrayComConteinersPergunta.length === contadorAlternativasMarcadas) {
        darResultadoQuizz(contadorRespostasCertas, arrayComConteinersPergunta.length)
    }
    parent.dataset.clicavel = "false";

}
async function darResultadoQuizz(numAcertos , numElmentos) {
    let htmlResultadoQuizz = undefined;

    await axios.get(apiBuzzQuizz + `/${guardarIdDoQuizzAberto}`).then(response => {
        const porcentagemAcerto = Math.round((100 * numAcertos) / numElmentos);
        const niveisDaResposta = response.data.levels;
        niveisDaResposta.forEach(element => {
            if (porcentagemAcerto >= element.minValue) {
                htmlResultadoQuizz = `
                <article class="conteiner-resultado-maior">
                    <div class="conteiner-resultado-menor">
                            <div class="titulo-resultado">
                                <p>${porcentagemAcerto}% de acerto: ${element.title}</p>
                            </div>
                        <div class="descricao-resultado" >
                            <img src="${element.image}" alt="">
                            <p>
                                ${element.text}
                            </p>
                        </div>
                    </div>
                </article>
                <div class="botoes-finalquizz">
                    <button onclick="abrirQuizz(${guardarIdDoQuizzAberto})">
                        <p>Reiniciar Quizz</p>
                    </button>
                    <span onclick="abrirHome()">
                        <p>Voltar para home</p>
                    </span>
                </div>
        `;
            }
        });
    })

    document.querySelector('main').innerHTML += htmlResultadoQuizz;

    //scrollar para resultado após 2 segundos da escolha da resposta
    setTimeout(() => {
        document.querySelector(".botoes-finalquizz").scrollIntoView();
    }, 2000)

    // Resetar Variaveis
    contadorRespostasCertas = 0;
    contadorAlternativasMarcadas = 0;
    guardarIdDoQuizzAberto = undefined;
}

//Tela 3
//Renderizar tela 3.1
function criarQuizz() {
    document.querySelector('main').innerHTML = `
    <!-- Tela 3 -->
    <!-- Tela 3.1 -->
    <section class="tela_3-1">
        <h2>Comece pelo começo</h2>
    
        <article class="infos">
            <input id="titulo-quizz" type="text" minlength="20" maxlength="65" placeholder="Título do seu quizz">
            <input id="valor-url" type="url" placeholder="URL da imagem do seu quizz">
            <input id="qtd-Perguntas" type="number" min="3" placeholder="Quantidade de perguntas do quizz">
            <input id="qtd-Niveis" type="number" min="2" placeholder="Quantidade de níveis do quizz">
        </article>
    
        <button class="padrao" type="button" onclick="validarInfoBasicas()">Prosseguir pra criar perguntas</button>
    </section>
    `;
}

//validação input informações basicas
function validarInfoBasicas() {
    tituloQuizz = document.getElementById("titulo-quizz").value;
    valorUrl = document.getElementById("valor-url").value
    qtdPerguntas = document.getElementById("qtd-Perguntas").value;
    qtdPerguntasNumero =document.getElementById("qtd-Perguntas").valueAsNumber;
    qtdNiveis = document.getElementById("qtd-Niveis").value;
    qtdNiveisNumero = document.getElementById("qtd-Niveis").valueAsNumber;

    let tituloQuizzOk = (tituloQuizz.length > 20 && tituloQuizz.length < 65 && tituloQuizz !== null)
    let checarUrlOk = (checarUrl(valorUrl) && valorUrl !== null)
    let qtdPerguntasOk = (qtdPerguntasNumero >= 3 && qtdPerguntasNumero !== null)
    let qtdNiveisOk = (qtdNiveisNumero >= 2 && qtdNiveisNumero !== null)

    if (tituloQuizzOk && checarUrlOk && qtdPerguntasOk && qtdNiveisOk){
        const section31 = document.querySelector(".tela_3-1");
        section31.classList.add("escondido")
        renderizarTelaPerguntasQuizz()
    }else{
        alert("Preencha os campos com informações corretas!");
    }
}

//Renderizar tela 3.2
function renderizarTelaPerguntasQuizz() {
    document.querySelector('main').innerHTML +=
    `<!-- Tela 3.2 -->
    <section class="tela_3-2">
        <h2>Crie suas perguntas</h2>`;

    for(let i=1; i<=qtdPerguntas; i++){
        document.querySelector('main').innerHTML +=
        `
        <div class="todas-perguntas">
            <div class="encapsulado" onclick="removerEscondidoPerguntas(${i})">
                <h2>Pergunta ${i}</h2>
                <ion-icon class="icon-expandir" name="create-outline"></ion-icon>
            </div> 
        <div class="perguntas${i} escondido">
            <article class="pergunta">
                <input id="valor${i}-perguntas" type="text" minlength="20" placeholder="Texto da pergunta">
                <input id="valor${i}-cor" type="text" minlength="7" maxlength="7" placeholder="Cor de fundo da pergunta">
                <h3>Resposta correta</h3>
                <input id="valor${i}-resposta-correta" type="text" minlength="1" placeholder="Resposta correta">
                <input id="valor${i}-url-correta" type="url" placeholder="URL da imagem">
                <h3>Respostas incorretas</h3>
                <input id="valor${i}-resposta-incorreta1" type="text" minlength="1" placeholder="Resposta incorreta 1">
                <input id="valor${i}-url-incorreta1" type="url" placeholder="URL da imagem 1">
                <input id="valor${i}-resposta-incorreta2" type="text" minlength="1" placeholder="Resposta incorreta 2">
                <input id="valor${i}-url-incorreta2" type="url" placeholder="URL da imagem 2">
                <input id="valor${i}-resposta-incorreta3" type="text" minlength="1" placeholder="Resposta incorreta 3">
                <input id="valor${i}-url-incorreta3" type="url" placeholder="URL da imagem 3">
            </article>    
        </div>
        `
    }
    document.querySelector('main').innerHTML +=
    `
        <button class="padrao" type="button" onclick="validarPerguntas()">Prosseguir pra criar níveis</button>
    </section>
    `;
}

function removerEscondidoPerguntas(numero){
    const pergunta = document.querySelector(`.perguntas${numero}`);
    pergunta.classList.toggle("escondido");
}

function validarPerguntaIndividual(id){
    const perguntaTitulo = document.getElementById(`valor${id}-perguntas`).value;
    const perguntaCor = document.getElementById(`valor${id}-cor`).value; 
    const respostaCorreta = document.getElementById(`valor${id}-resposta-correta`).value;
    const urlCorreta = document.getElementById(`valor${id}-url-correta`).value;

    let temIncorretaOk = false;
    for(let i=1; i<=3; i++){
        let respostaIncorreta = document.getElementById(`valor${id}-resposta-incorreta${i}`).value;
        let urlIncorreta = document.getElementById(`valor${id}-url-incorreta${i}`).value;

        let incorretaAtualOk = (respostaIncorreta !== "") && checarUrl(urlIncorreta);
        temIncorretaOk = temIncorretaOk || incorretaAtualOk;
    }

    let tituloOk = (perguntaTitulo.length > 20 && perguntaTitulo !== '');
    let corOk = checarHexadecimal(perguntaCor);
    let urlCorretaOk = checarUrl(urlCorreta);
    let temCorreta = (respostaCorreta !== "");

    return tituloOk && corOk && urlCorretaOk && temCorreta && temIncorretaOk;
}

// validação dos inputs das perguntas
function validarPerguntas (){
    let todasValidas = true;
    for(let i=1; i<= qtdPerguntas; i++){
        let atualValida = validarPerguntaIndividual(i);
        todasValidas = todasValidas && atualValida;
    }  

    if(todasValidas){
        document.querySelector("section.tela_3-2").classList.add("escondido");
        document.querySelector(".todas-perguntas").classList.add("escondido");
        renderizarTelaNiveisQuizz();
    }else{
        alert("Preencha os campos com informações corretas!");
    }
}

//Renderizar tela 3.3
function renderizarTelaNiveisQuizz() {
    document.querySelector('main').innerHTML += `
    <!-- Tela 3.3 -->
    <section class="tela_3-3">
        <h2>Agora, decida os níveis!</h2>`;

    for(let i=1; i<= qtdNiveis; i++){

        document.querySelector('main').innerHTML +=
        `
        <div class="todos-niveis">
            <div class="encapsulado" onclick="removerEscondidoNiveis(${i})">
                <h2>Nível ${i}</h2>
                <ion-icon class="icon-expandir" name="create-outline"></ion-icon>
            </div>
            <div class="niveis${i} escondido">
                <article class="nivel">
                    <input id="titulo-nivel${i}" type="text" minlength="10" placeholder="Título do nível">
                    <input id="porcentagem-acerto${i}" type="number" min="0" max="100" placeholder="% de acerto mínima">
                    <input id="url-nivel${i}" type="url" placeholder="URL da imagem do nível">
                    <textarea id="descricao-nivel${i}" placeholder="Descrição do nível"></textarea>
                </article>
            </div>
        </div>
        `;
    }   

    document.querySelector('main').innerHTML += `
    <button class="padrao" type="button" onclick="validarNiveis()">Finalizar Quizz</button>
    </section>   
    `;
}

function removerEscondidoNiveis(numero){
    const nivel = document.querySelector(`.niveis${numero}`);
    nivel.classList.toggle("escondido");
}

// validação dos inputs dos niveis
function validarNiveis(){
    let temPorcentagemZero = false;
    let todosValidos = true;
    for(let i=1; i<=qtdNiveis; i++){
        const tituloNivel = document.getElementById(`titulo-nivel${i}`).value;
        const porcentagemAcerto = document.getElementById(`porcentagem-acerto${i}`).valueAsNumber;
        const valorUrlNivel = document.getElementById(`url-nivel${i}`).value
        const descricao = document.getElementById(`descricao-nivel${i}`).value;
    
        if(porcentagemAcerto == 0){
            temPorcentagemZero = true;
        }
    
        let tituloNivelOk = (tituloNivel.length > 10 && tituloNivel !== null);
        let porcentagemAcertoOk = (porcentagemAcerto >= 0 && porcentagemAcerto <= 100);
        let checarUrlNiveislOk = (checarUrl(valorUrlNivel) && valorUrlNivel !== null);
        let descricaoOk = (descricao.length > 30 && descricao !== null);
        
        
        let atualValido = tituloNivelOk && porcentagemAcertoOk && checarUrlNiveislOk && descricaoOk;
        todosValidos = todosValidos && atualValido;
    } 
    if(todosValidos && temPorcentagemZero){
        renderizarTelaRevisaoFinalQuizz()
    }else{
        alert("Preencha os campos com informações corretas!");
    }
} 

//Renderizar tela 3.4
function  renderizarTelaRevisaoFinalQuizz() {
    document.querySelector('main').innerHTML = `
    <!-- Tela 3.4 -->
    <section class="tela_3-4">
        <h2>Seu quizz está pronto!</h2>
    
        <div class="quiz-finalizado">
            <img src="${valorUrl}" alt="${tituloQuizz}">
            <p>${tituloQuizz}</p>
        </div>
    
        <button class="acessar-quiz" type="button" onclick="acessarQuizz()">Acessar Quizz</button>
        <button class="voltar-home" type="button" onclick="abrirHome()">Voltar pra home</button>
    </section>  
    `;
}

//Botão confirmar - tela 3.4
function acessarQuizzRecemCriado() {
    abrirQuizz(this);
}

// checar hexadecimal
function checarHexadecimal (str){
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
    return regex.test(str);
}

// checar url
function checarUrl (str){
    if (str != null && str != '') {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(str);
    }
    return false;
}

// Executar funções
abrirHome();