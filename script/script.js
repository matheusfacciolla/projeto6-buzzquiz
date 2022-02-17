//variaveis globais
const apiBuzzQuizz = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';

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
let telaDadosIniciasPergunta = `
<!-- Tela 3 -->
<!-- Tela 3.1 -->
<section class="tela_3-1">
    <h2>Comece pelo começo</h2>

    <article class="infos">
        <input type="text" minlength="20" maxlength="65" placeholder="Título do seu quizz">
        <input type="url" placeholder="URL da imagem do seu quizz">
        <input type="number" min="3" placeholder="Quantidade de perguntas do quizz">
        <input type="number" min="2" placeholder="Quantidade de níveis do quizz">
    </article>

    <button class="padrao" type="button" onclick="prosseguirPerguntas()">Prosseguir pra criar perguntas</button>
</section>
`;
let telaEscolherPerguntasQuizz = `
<!-- Tela 3.2 -->
<section class="tela_3-2">
    <h2>Crie suas perguntas</h2>

    <div class="perguntas">
        <article class="pergunta1">
            <h3>Pergunta 1</h3>
            <input type="text" minlength="20" placeholder="Texto da pergunta">
            <input type="text" minlength="7" maxlength="7" placeholder="Cor de fundo da pergunta">
            <h3>Resposta correta</h3>
            <input type="text" minlength="1" placeholder="Resposta correta">
            <input type="url" placeholder="URL da imagem">
            <h3>Respostas incorretas</h3>
            <input type="text" minlength="1" placeholder="Resposta incorreta 1">
            <input type="url" placeholder="URL da imagem 1">
            <input type="text" minlength="1" placeholder="Resposta incorreta 2">
            <input type="url" placeholder="URL da imagem 2">
            <input type="text" minlength="1" placeholder="Resposta incorreta 3">
            <input type="url" placeholder="URL da imagem 3">
        </article>

        <article class="pergunta2">
            <h3>Pergunta 2</h3>
            <img src="imagens/Vector.svg" alt="icon">
        </article>

        <article class="pergunta3">
            <h3>Pergunta 2</h3>
            <img src="imagens/Vector.svg" alt="icon">
        </article>     
    </div>

        <button class="padrao" type="button" onclick="prosseguirNiveis()">Prosseguir pra criar níveis</button>
</section>
`;
let telaEscolherNiveisQuizz = `
<!-- Tela 3.3 -->
<section class="tela_3-3">
    <h2>Agora, decida os níveis!</h2>

    <div class="niveis">
        <article class="nivel1">
            <h3>Nível 1</h3>
            <input type="text" minlength="10" placeholder="Título do nível">
            <input type="number" min="0" max="100" placeholder="% de acerto mínima">
            <input type="url" placeholder="URL da imagem do nível">
            <input type="text" minlength="30" placeholder="Descrição do nível">
        </article>

        <article class="nivel2">
            <h3>Nível 2</h3>
            <img src="imagens/Vector.svg" alt="icon">
        </article>

        <article class="nivel3">
            <h3>Nível 3</h3>
            <img src="imagens/Vector.svg" alt="icon">
        </article>     
    </div>

        <button class="padrao" type="button" onclick="finalizarQuizz()">Finalizar Quizz</button>
</section>   
`;
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
async function abrirQuizz(identificador) {
    await axios.get(apiBuzzQuizz + `/${identificador.id}`).then(response => {

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
        const botoesFinalQuizz = `
        <div class="botoes-finalquizz">
                <button>
                    <p>Reiniciar Quizz</p>
                </button>
                <span onclick="abrirHome()">
                    <p>Voltar para home</p>
                </span>
            </div>
        `;

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
            console.log(element);
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

        // Renderiza os Botões do final
        document.querySelector('main').innerHTML += botoesFinalQuizz;
    })
}
function criarQuizz() {
    document.querySelector('main').innerHTML = telaDadosIniciasPergunta;
}


// Tela 2

//selecionar a alternativa desejada e mostrar resposta correta/incorreta
function selecionarResposta(element) {

    let parent = element.parentNode;
    if(parent.dataset.clicavel === "false"){
        return;
    }

    let alternativas = parent.querySelectorAll(".alternativa-individual")

    for(let i=0; i<alternativas.length; i++){
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

        // scrollar para próxima pergunta após 2 segundos da escolha da resposta
        const scrollar = node.nextElementSibling
        setTimeout(() => {
            scrollar.scrollIntoView()
        }, 2000)
    }

    parent.dataset.clicavel = "false";
}


//Tela 3

//Renderizar tela 3.1

//Botão tela 3.1
function prosseguirPerguntas() {
    renderizarTelaEscolherPerguntasQuizz();
}

//Renderizar tela 3.2
function renderizarTelaEscolherPerguntasQuizz() {
    document.querySelector('main').innerHTML = telaEscolherPerguntasQuizz;
}

//Botão tela 3.2
function prosseguirNiveis() {
    renderizarTelaEscolherNiveisQuizz();
    console.log('Prosseguir para criar níveis');
}

//Renderizar tela 3.3
function renderizarTelaEscolherNiveisQuizz() {
    document.querySelector('main').innerHTML = telaEscolherNiveisQuizz;
}

//Botão tela 3.3
function finalizarQuizz() {
    renderizarTelaRevisaoFinalQuizz();
    console.log('Finalizar Quizz');
}

//Renderizar tela 3.4
function  renderizarTelaRevisaoFinalQuizz() {
    document.querySelector('main').innerHTML = telaRevisaoFinalQuizz;
}

//Botão confirmar - tela 3.4
function acessarQuizzRecemCriado() {
    abrirQuizz(this);
}


// Executar funções
abrirHome();