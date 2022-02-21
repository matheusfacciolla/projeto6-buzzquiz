//variaveis globais
const apiBuzzQuizz = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
let scrollar = null;
let contadorRespostasCertas = 0;
let contadorAlternativasMarcadas = 0;
let guardarIdDoQuizzAberto = undefined;
let contadorDosQuizzesLocalStorage = 0;
let quizzSerializado = undefined;
let quizzDeserializados = undefined;
let arrayQuizzesDeserializados = [];

let tituloQuizz = "null";
let imagemUrlQuizz = "null";
let qtdPerguntas = "null";
let qtdNiveis = "null";
let objetoQuizzUsuario = {
    title: undefined,
    image: undefined,
    questions: undefined,
    levels: undefined
};
let perguntasArray = [];

// Tela 1
async function abrirHome() {
    guardarIdDoQuizzAberto = undefined;
    // Renderiza a home até o "Seus Quizzes"
    if (localStorage.length === 0) {
        const telaHomeCriarQuizz =`
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
        <div class ="telaCarregando escondido">
            <img src="imagens/carregando.svg" alt="carregando...">
            <p>Carregando...</p>
        </div>
        `;
        document.querySelector('main').innerHTML = telaHomeCriarQuizz;
    } else {
        desserializarQuizzEGuardarEmArray();
        const telaHomeSeusQuizzes = `
            <section class="seus-quizzes">
            <span>
                <p>Seus Quizzes</p>
                <ion-icon name="add-circle" onclick="criarQuizz()"></ion-icon>
            </span>
            <article class="lista-seus-quizzes">
            </article>
        </section>
        `;
        const backgroundConteinerQuizz = `
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); 
            background-size: 100%;
            `;
        document.querySelector('main').innerHTML = telaHomeSeusQuizzes;
        arrayQuizzesDeserializados.forEach(element => {
            let seusQuizzes = `
            <div class="seu-quizz" onclick="abrirQuizz(this)" style="${backgroundConteinerQuizz}">
                <span>
                    <p>${element.title}</p>
                </span>
            </div>
            `;
            document.querySelector('.lista-seus-quizzes').innerHTML += seusQuizzes;
        });
        
    }
    // Pega os quizzes do servidor e renderiza eles
    mostrarTelaCarregando();
    await axios.get(apiBuzzQuizz).then(response => {
        
        const quizzesDoServidor = response.data;
        removerTelaCarregando();
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
    if (guardarIdDoQuizzAberto === undefined) {
        guardarIdDoQuizzAberto = identificador.id;
    }
    mostrarTelaCarregando();
    await axios.get(apiBuzzQuizz + `/${guardarIdDoQuizzAberto}`).then(response => {
        // Varieaveis importantes
        const dadosDoQuizzSelecionado = response.data;
        removerTelaCarregando();
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
            alternativaPerguntas.sort(comparador);
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
function comparador() { 
    return Math.random() - 0.5; 
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
                    <button onclick="resetarQuizz()">
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
        const botaoFinal = document.querySelector(".botoes-finalquizz");
        botaoFinal.scrollIntoView();
    }, 2000);
}
// Resetar Variaveis
function resetarQuizz(){
    contadorRespostasCertas = 0;
    contadorAlternativasMarcadas = 0;
    window.scrollTo(0, 0);
    abrirQuizz()
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
            <label for="titulo-quizz" id="titulo-quizz-label" class="escondido">Deve ter no mínimo 20 e no máximo 65 caracteres</label>
            <input id="valor-url" type="url" placeholder="URL da imagem do seu quizz">
            <label for="valor-url" id="valor-url-label" class="escondido">Deve ter formato de URL</label>
            <input id="qtd-perguntas" type="number" min="3" placeholder="Quantidade de perguntas do quizz">
            <label for="qtd-perguntas" id="qtd-perguntas-label" class="escondido">Quantidade de perguntas: no mínimo 3 perguntas</label>
            <input id="qtd-niveis" type="number" min="2" placeholder="Quantidade de níveis do quizz">
            <label for="qtd-niveis" id="qtd-niveis-label" class="escondido">Quantidade de níveis: no mínimo 2 níveis</label>
        </article>
    
        <button class="padrao" type="button" onclick="validarInfoBasicas()">Prosseguir pra criar perguntas</button>
    </section>
    `;
}
//validação input informações basicas
function validarInfoBasicas() {
    tituloQuizz = document.getElementById("titulo-quizz").value;
    imagemUrlQuizz = document.getElementById("valor-url").value;
    qtdPerguntas = document.getElementById("qtd-perguntas").value;
    qtdNiveis = document.getElementById("qtd-niveis").value;

    limparErros();

    let tituloQuizzOk = (tituloQuizz.length > 20 && tituloQuizz.length < 65 && tituloQuizz !== null);
    let checarUrlOk = (checarUrl(imagemUrlQuizz) && imagemUrlQuizz !== null);
    let qtdPerguntasOk = (qtdPerguntas >= 3 && qtdPerguntas !== null);
    let qtdNiveisOk = (qtdNiveis >= 2 && qtdNiveis !== null);

    //Adiciona na lista se for válido
    if (tituloQuizzOk && checarUrlOk && qtdPerguntasOk && qtdNiveisOk){
        objetoQuizzUsuario.title = tituloQuizz;
        objetoQuizzUsuario.image = imagemUrlQuizz;

        console.log(objetoQuizzUsuario);

        const section31 = document.querySelector(".tela_3-1");
        section31.classList.add("escondido");
        renderizarTelaPerguntasQuizz();

    }else{
        if(!tituloQuizzOk){
            document.getElementById("titulo-quizz-label").classList.remove("escondido");
            document.getElementById("titulo-quizz").style.backgroundColor = "#FFE9E9";
        }  
        if(!checarUrlOk){
            document.getElementById("valor-url-label").classList.remove("escondido");
            document.getElementById("valor-url").style.backgroundColor = "#FFE9E9";
        }    
        if(!qtdPerguntasOk){
            document.getElementById("qtd-perguntas-label").classList.remove("escondido");
            document.getElementById("qtd-perguntas").style.backgroundColor = "#FFE9E9";
        } 
        if(!qtdNiveis){
            document.getElementById("qtd-niveis-label").classList.remove("escondido");
            document.getElementById("qtd-niveis").style.backgroundColor = "#FFE9E9";
        }      
    }
}
//Renderizar tela 3.2
function renderizarTelaPerguntasQuizz() {

    let tela32 = document.querySelector('main').innerHTML;
    tela32 +=
    `<!-- Tela 3.2 -->
    <section class="tela_3-2">
        <h2>Crie suas perguntas</h2>`;

    for(let i=1; i<=qtdPerguntas; i++){
        tela32 +=  `
        <div class="todas-perguntas">
            <div class="encapsulado" onclick="removerEscondidoPerguntas(${i})">
                <h2>Pergunta ${i}</h2>
                <ion-icon class="icon-expandir" name="create-outline"></ion-icon>
            </div> 
        <div class="perguntas${i} escondido">
            <article class="pergunta">
                <input id="valor${i}-perguntas" type="text" minlength="20" placeholder="Texto da pergunta">
                <label for="valor${i}-perguntas" id="valor${i}-perguntas-label" class="escondido">No mínimo 20 caracteres</label>
                
                <input id="valor${i}-cor" type="text" minlength="7" maxlength="7" placeholder="Cor de fundo da pergunta">
                <label for="valor${i}-cor" id="valor${i}-cor-label" class="escondido">Cor em hexadecimal</label>
                
                <h3>Resposta correta</h3>
                
                <input id="valor${i}-resposta-correta" type="text" minlength="1" placeholder="Resposta correta">
                <label for="valor${i}-resposta" id="valor${i}-resposta-label" class="escondido">Não pode estar vazio</label>

                <input id="valor${i}-url-correta" type="url" placeholder="URL da imagem">
                <label for="valor${i}-url-correta" id="valor${i}-url-correta-label" class="escondido">Deve ter formato de URL</label>
                
                <h3>Respostas incorretas</h3>
                
                <input id="valor${i}-resposta-incorreta1" type="text" minlength="1" placeholder="Resposta incorreta 1">
                <label for="valor${i}-resposta-incorreta1" id="valor${i}-resposta-incorreta1-label" class="escondido">Não pode estar vazio</label>
                
                <input id="valor${i}-url-incorreta1" type="url" placeholder="URL da imagem 1">
                <label for="valor${i}-url-incorreta1" id="valor${i}-url-incorreta1-label" class="escondido">Deve ter formato de URL</label>
                
                <input id="valor${i}-resposta-incorreta2" type="text" minlength="1" placeholder="Resposta incorreta 2">
                <label for="valor${i}-resposta-incorreta2" id="valor${i}-resposta-incorreta2-label" class="escondido">Não pode estar vazio</label>
                
                <input id="valor${i}-url-incorreta2" type="url" placeholder="URL da imagem 2">
                <label for="valor${i}-url-incorreta2" id="valor${i}-url-incorreta2-label" class="escondido">Deve ter formato de URL</label>
                
                <input id="valor${i}-resposta-incorreta3" type="text" minlength="1" placeholder="Resposta incorreta 3">
                <label for="valor${i}-resposta-incorreta3" id="valor${i}-resposta-incorreta3-label" class="escondido">Não pode estar vazio</label>
                
                <input id="valor${i}-url-incorreta3" type="url" placeholder="URL da imagem 3">
                <label for="valor${i}-url-incorreta3" id="valor${i}-url-incorreta3-label" class="escondido">Deve ter formato de URL</label>
            </article>    
        </div>
        </div>
        `;
    }
    tela32 +=
    `
        <button class="padrao" type="button" onclick="validarPerguntas()">Prosseguir pra criar níveis</button>
    </section>
    `;
    document.querySelector('main').innerHTML = tela32;
}
//Encapsular as perguntas
function removerEscondidoPerguntas(numero){
    const pergunta = document.querySelector(`.perguntas${numero}`);
    pergunta.classList.toggle("escondido");
}
// validação dos inputs das perguntas
function validarPerguntaIndividual(id){
    const perguntaTitulo = document.getElementById(`valor${id}-perguntas`).value;
    const perguntaCor = document.getElementById(`valor${id}-cor`).value; 
    const respostaCorreta = document.getElementById(`valor${id}-resposta-correta`).value;
    const urlCorreta = document.getElementById(`valor${id}-url-correta`).value;

    let arrayRespostas = [];
    let incorretaTitulosValidos = []
    let incorretaUrlValidos = [];
    
    for(let i=1; i<=3; i++){
        let respostaIncorreta = document.getElementById(`valor${id}-resposta-incorreta${i}`).value;
        let urlIncorreta = document.getElementById(`valor${id}-url-incorreta${i}`).value;

        let incorretaAtualOk = (respostaIncorreta !== "") && checarUrl(urlIncorreta);

        let tituloAtualInvalido = (respostaIncorreta !== "") && (urlIncorreta !== "");
        let urlAtualInvalida = (!checarUrl(urlIncorreta)) && (respostaIncorreta !== "");

        incorretaTitulosValidos.push(tituloAtualInvalido);
        incorretaUrlValidos.push(urlAtualInvalida);
        
        //Adiciona na lista se for válido
        if(incorretaAtualOk){
            let incorretaObjeto = {
                text: respostaIncorreta,
                image: urlIncorreta,
                isCorrectAnswer: false
            };
            
            arrayRespostas.push(incorretaObjeto);             
        }
    }

    let tituloOk = (perguntaTitulo.length > 20 && perguntaTitulo !== '');
    let corOk = checarHexadecimal(perguntaCor);
    let urlCorretaOk = checarUrl(urlCorreta);
    let temCorreta = (respostaCorreta !== "");

    //pelo menos uma resposta incorreta deve estar na lista (ou seja ser válida)
    let temIncorretaOk = arrayRespostas.length > 0;

    //se pergunta nao for válida retorna null
    if(!(tituloOk && corOk && urlCorretaOk && temCorreta && temIncorretaOk)){
        if(!tituloOk){
            document.getElementById(`valor${id}-perguntas-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-perguntas`).style.background = "#FFE9E9";
        }
        if(!corOk){
            document.getElementById(`valor${id}-cor-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-cor`).style.background = "#FFE9E9";
        }
        if(!urlCorretaOk){
            document.getElementById(`valor${id}-url-correta-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-url-correta`).style.background = "#FFE9E9";
        }
        if(!temCorreta){
            document.getElementById(`valor${id}-resposta-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-resposta-correta`).style.background = "#FFE9E9";
        }
        if(!temIncorretaOk){
            document.getElementById(`valor${id}-resposta-incorreta1-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-resposta-incorreta1`).style.background = "#FFE9E9";
            
            document.getElementById(`valor${id}-url-incorreta1-label`).classList.remove("escondido");
            document.getElementById(`valor${id}-url-incorreta1`).style.background = "#FFE9E9";
        }

        for(let i=0; i<3; i++){
            if(incorretaTitulosValidos[i]){
                document.getElementById(`valor${id}-resposta-incorreta${i+1}-label`).classList.remove("escondido");
                document.getElementById(`valor${id}-resposta-incorreta${i+1}`).style.background = "#FFE9E9";
            }
            if(incorretaUrlValidos[i]){
                document.getElementById(`valor${id}-url-incorreta${i+1}-label`).classList.remove("escondido");
                document.getElementById(`valor${id}-url-incorreta${i+1}`).style.background = "#FFE9E9";
            }
        }        
        objetoQuizzUsuario.questions = [];
        perguntasArray = [];

        return null;
    }
    
    //Cria objeto para resposta correta e adiciona na lista de respostas
    let respostaCorretaObjeto = {
        text: respostaCorreta,
        image: urlCorreta,
        isCorrectAnswer: true,
    };
    arrayRespostas.push(respostaCorretaObjeto);
 
    //Cria objeto com toda pergunta
    let perguntaObj = {
        title: perguntaTitulo,
        color: perguntaCor,
        answers: arrayRespostas
    };

    return perguntaObj;
}
function validarPerguntas (){
    limparErros();
    console.log("aqui")

    for(let i=1; i<= qtdPerguntas; i++){
        atualObjeto = validarPerguntaIndividual(i);
        let atualValida = (atualObjeto !== null);
        console.log("atual",atualObjeto)
        
        //só adiciona na lista se pergunta for válida
        if(atualValida){
            perguntasArray.push(atualObjeto);
        }
    }  
    console.log("aqui2")
    console.log("perguntasArray.length",perguntasArray.length)
    console.log("perguntasArray",perguntasArray)


    //A lista tem o mesmo numero de perguntas
    let todasValidas = (perguntasArray.length == qtdPerguntas);

    if(todasValidas){
        console.log("aqui3")
        objetoQuizzUsuario.questions = perguntasArray;
        console.log(objetoQuizzUsuario);

        document.querySelector("section.tela_3-2").classList.add("escondido");
        renderizarTelaNiveisQuizz();
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
                    <label for="titulo-nivel${i}" id="titulo-nivel${i}-label" class="escondido">Mínimo de 10 caracteres</label>
                    <input id="porcentagem-acerto${i}" type="number" min="0" max="100" placeholder="% de acerto mínima">
                    <label for="porcentagem-acerto${i}" id="porcentagem-acerto${i}-label" class="escondido">Número entre 0 e 100 (um deles tem que ser zero)</label>
                    <input id="url-nivel${i}" type="url" placeholder="URL da imagem do nível">
                    <label for="url-nivel${i}" id="url-nivel${i}-label" class="escondido">Deve ter formato de URL</label>
                    <textarea id="descricao-nivel${i}" placeholder="Descrição do nível"></textarea>
                    <label for="descricao-nivel${i}" id="descricao-nivel${i}-label" class="escondido">Mínimo de 30 caracteres</label>
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
// Encapsular os niveis
function removerEscondidoNiveis(numero){
    const nivel = document.querySelector(`.niveis${numero}`);
    nivel.classList.toggle("escondido");
}
// validação dos inputs dos niveis
function validarNiveis(){
    let temPorcentagemZero = false;
    let arrayNiveis = [];
    let titulosValidos = [];
    let porcentagemValidos = [];
    let checarUrlValidos = [];
    let descricaoValidos = [];
    
    limparErros();

    for(let i=1; i<=qtdNiveis; i++){
        const tituloNivel = document.getElementById(`titulo-nivel${i}`).value;
        const porcentagemAcerto = document.getElementById(`porcentagem-acerto${i}`).valueAsNumber;
        const valorUrlNivel = document.getElementById(`url-nivel${i}`).value;
        const descricao = document.getElementById(`descricao-nivel${i}`).value;
    
        if(porcentagemAcerto == 0){
            temPorcentagemZero = true;
        }
        
        //validar inputs
        let tituloNivelOk = (tituloNivel.length > 10 && tituloNivel !== null);
        let porcentagemAcertoOk = (porcentagemAcerto >= 0 && porcentagemAcerto <= 100);
        let checarUrlNiveislOk = (checarUrl(valorUrlNivel) && valorUrlNivel !== null);
        let descricaoOk = (descricao.length > 30 && descricao !== null);
        
        let atualValido = (tituloNivelOk && porcentagemAcertoOk && checarUrlNiveislOk && descricaoOk);

        titulosValidos.push(tituloNivelOk);
        porcentagemValidos.push(porcentagemAcertoOk);
        checarUrlValidos.push(checarUrlNiveislOk);
        descricaoValidos.push(descricaoOk);
        
        //Se o nivel for válido adiciona o objeto na lista
        if(atualValido){
            let nivelObjeto = {
                title: tituloNivel,
                image: valorUrlNivel,
                text: descricao,
                minValue: porcentagemAcerto
            };
            arrayNiveis.push(nivelObjeto);
        }
    } 

    //Todos são válidos se lista tem todos os niveis
    let todosValidos = (arrayNiveis.length == qtdNiveis);

    //Todos válidos com pelo menos um nivel de porcentagem 0
    if(todosValidos && temPorcentagemZero){
        objetoQuizzUsuario.levels = arrayNiveis;
        console.log(objetoQuizzUsuario);
        renderizarTelaRevisaoFinalQuizz();

    }else{
        if(!temPorcentagemZero){
            for(let i=0; i<qtdNiveis; i++){
                document.getElementById(`porcentagem-acerto${i+1}-label`).classList.remove("escondido");
                document.getElementById(`porcentagem-acerto${i+1}`).style.background = "#FFE9E9";
            }
        }

        for(let i=0; i<qtdNiveis; i++){
            if(!titulosValidos[i]){
                document.getElementById(`titulo-nivel${i+1}-label`).classList.remove("escondido");
                document.getElementById(`titulo-nivel${i+1}`).style.background = "#FFE9E9";
            }
            if(!porcentagemValidos[i]){
                document.getElementById(`porcentagem-acerto${i+1}-label`).classList.remove("escondido");
                document.getElementById(`porcentagem-acerto${i+1}`).style.background = "#FFE9E9";
            }
            if(!checarUrlValidos[i]){
                document.getElementById(`url-nivel${i+1}-label`).classList.remove("escondido");
                document.getElementById(`url-nivel${i+1}`).style.background = "#FFE9E9";
            }
            if(!descricaoValidos[i]){
                document.getElementById(`descricao-nivel${i+1}-label`).classList.remove("escondido");
                document.getElementById(`descricao-nivel${i+1}`).style.background = "#FFE9E9";
            }else{
                objetoQuizzUsuario.levels = [];
                arrayNiveis = [];
            }
        }
    }
} 
//Renderizar tela 3.4
function  renderizarTelaRevisaoFinalQuizz() {
    enviarQuizz();
    document.querySelector('main').innerHTML = `
    <!-- Tela 3.4 -->
    <section class="tela_3-4">
        <h2>Seu quizz está pronto!</h2>
    
        <article class="quiz-finalizado" style="background-image: url('${imagemUrlQuizz}')">
            <p>${tituloQuizz}</p>
        </article>
    
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
function checarUrl(str){
    if (str != null && str != '') {
        let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        return regex.test(str);
    }else{
        return false;
    }
}
function limparErros(){
    let inputs = document.querySelectorAll("input");
    let labels = document.querySelectorAll("label");
    let textareas = document.querySelectorAll("textarea");

    for(let i=0; i<inputs.length; i++){
        inputs[i].style.background = "#FFFFFF";
    }

    for(let i=0; i<labels.length; i++){
        labels[i].classList.add("escondido");
    }

    for(let i=0; i<textareas.length; i++){
        textareas[i].style.background = "#FFFFFF";
    }
}
function mostrarTelaCarregando(){
    const telaCarregando = document.querySelector(".telaCarregando");
    telaCarregando.classList.remove("escondido");
}
function removerTelaCarregando(){
    const telaCarregando = document.querySelector(".telaCarregando");
    telaCarregando.classList.add("escondido");
}
function guardarQuizzLocalStorage() {
    quizzSerializado = JSON.stringify(objetoQuizzUsuario);
    localStorage.setItem(`quizz${contadorDosQuizzesLocalStorage}`, quizzSerializado);
    contadorDosQuizzesLocalStorage++;
}
function desserializarQuizzEGuardarEmArray() {
    for (let index = 0; index < contadorDosQuizzesLocalStorage; index++) {
        let pegarQuizzLocalStorage = localStorage.getItem(`quizz${index}`)
        quizzDeserializados = JSON.parse(pegarQuizzLocalStorage);
        arrayQuizzesDeserializados.push(quizzDeserializados);
    }
}
function enviarQuizz() {
    guardarQuizzLocalStorage();
    axios.post(apiBuzzQuizz, objetoQuizzUsuario);
}

// Executar funções
abrirHome();