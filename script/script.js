//variaveis globais
let alternativaSelecionada = null;
let div = null;
let numero = null;

// So pra guardar um html
let guardarhtml = `
<!-- Se tiver algum Quizz criado já -->
<article class="lista-seus-quizzes">
    <span>
                <p>Seus Quizzes</p>
                <ion-icon name="add-circle" onclick="criarQuizz()"></ion-icon>
            </span>
            <!-- Seu Quizz Individual -->
            <div class="seu-quizz" onclick="abrirQuizz()">
                <span>
                    <p>O quão Potterhead é você?</p>
                </span>
            </div>
            <!-- Seu Quizz Individual -->
            <div class="seu-quizz" onclick="abrirQuizz()">
                <span>
                    <p>O quão Potterhead é você?</p>
                </span>
            </div>
        </article>
    </section>
`;

// Variaveis que guarda as página


let telaQuizz = `
<!-- Tela 2 -->
        <!-- Section com o "Tema" do Quizz -->
        <section class="tema-quizz">
            <span>
                <p>O quão Potterhead é você?</p>
            </span>
        </section>

        <!-- Section com a perguntas do "Quizz" -->
        <section class="perguntas-quizz">
            <!-- Conteiner contendo toda a "Pergunta" -->
            <article class="conteiner-pergunta-maior">
                <!-- Parte Interna do Conteiner -->
                <div class="conteiner-pegunta-menor">
                    <div class="titulo-pergunta">
                        <p>Em qual animal Olho-Tonto Moody transfigurou Malfoy?</p>
                    </div>
                    <!-- Alternativas -->
                    <div class="alternativas-pergunta">
                        <!-- Alternativa Individual -->
                        <div class="alternativa-individual" onclick="selecionarResposta(this, 1)">
                            <img src="imagens/gris.png" alt="hogwarts">
                            <span>
                                <p>Gatineo</p>
                            </span>
                        </div>
                        <!-- Alternativa Individual -->
                        <div class="alternativa-individual" onclick="selecionarResposta(this, 2)">    
                            <img src="imagens/gris.png" alt="hogwarts">
                            <span>
                                <p>Ratata</p>
                            </span>
                        </div>
                        <!-- Alternativa Individual -->
                        <div class="alternativa-individual" onclick="selecionarResposta(this, 3)">
                            <img src="imagens/gris.png" alt="hogwarts">
                            <span>
                                <p>Sapo Gordo</p>
                            </span>
                        </div>
                        <!-- Alternativa Individual -->
                        <div class="alternativa-individual" onclick="selecionarResposta(this, 4)">
                            <img src="imagens/gris.png" alt="hogwarts">
                            <span>
                                <p>Furão</p>
                            </span>
                        </div>
                    </div>
                </div>
            </article>
            <div class="botoes-finalquizz">
                <button>
                    <p>Reiniciar Quizz</p>
                </button>
                <span onclick="abrirHome()">
                    <p>Voltar para home</p>
                </span>
            </div>
        </section>
`;
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
    await axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes').then(response => {
        const quizzesDoServidor = response.data;
        quizzesDoServidor.forEach(element => {
            const backgroundConteinerQuizz = `
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); 
            background-size: 100%;
            `;
            let conteinerComQuizz = `
            <!-- Quizz Individual -->
            <div class="quizz" onclick="abrirQuizz()" style="${backgroundConteinerQuizz}">
                <span>
                    <p>${element.title}</p>
                </span>
            </div>
            `;
            document.querySelector('.lista-todos-quizzes').innerHTML += conteinerComQuizz;
        });
    });
}
function criarQuizz() {
    document.querySelector('main').innerHTML = telaDadosIniciasPergunta;
}
function abrirQuizz() {
    document.querySelector('main').innerHTML = telaQuizz;
}

abrirHome();

// Tela 2

//selecionar a alternativa desejada
function selecionarResposta(div, numero) {
    const todosItensLista = document.querySelectorAll(".alternativa-individual");
    const todasFontesLista = document.querySelectorAll(".alternativa-individual p");
    alternativaSelecionada = numero;

    //console.log(todosItensLista)
    //console.log(div)
    //console.log(todasFontesLista)
    //console.log(numero)

    for(let i=0; i<todosItensLista.length; i++){
        if(todosItensLista[i] !== div){
            todosItensLista[i].classList.add("opaco");
            disable = true;
        }else{
            div.classList.remove("opaco");
        }
    }

    for(let j=0; j<todasFontesLista.length; j++){
        if(j !== alternativaSelecionada-1){
            todasFontesLista[j].classList.add("alternativaIncorreta");
            todasFontesLista[j].disable = true;

        } else {
            todasFontesLista[j].classList.remove("alternativaIncorreta");
            todasFontesLista[j].classList.add("alternativaCorreta");
        }
    }
    
    if( div !== null && numero !== null){

        setTimeout(scrollar, 2000);
    }
}

// scrollar para proxima pergunta após 2 segundos da escolha da resposta
function scrollar (){
    const botao = document.querySelector(".botoes-finalquizz");
    //console.log(botao)
    botao.scrollIntoView();
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
    abrirQuizz();
}
