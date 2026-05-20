let currentTopico = 0;
let currentRI = 0;
let currentQuestion = '';

let requisitoTotal = 0;
let requisito = 0;
let corretasTotal = 0;
let corretas = 0;

let feedback = '';

let jsonQ;
let progress;
let resultProgress = [];

let currentURL = new URL(window.location);
if (currentURL.searchParams.has('path')) {
    try {
        fetch(`${currentURL.searchParams.get('path')}.json`).then(response => {
            response.json().then((json_file) => {
                jsonQ = json_file.topicos;

                init();
            })
        })
    } catch (e) { }
}

function init() {
    // progessbar
    progress = new ProgressBar.Circle(document.querySelector('.percent'), {
        color: '#aaa',
        strokeWidth: 6,
        trailWidth: 4,
        easing: 'easeInOut',
        duration: 500,
        text: {
            autoStyleContainer: false
        },
        from: { color: '#ff0', width: 6 },
        to: { color: '#5ac75a', width: 6 },
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);
            var value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(`${value}%`);
            }
        }
    });
    progress.text.style.fontFamily = '"Montserrat", Helvetica, sans-serif';
    progress.text.style.fontSize = '2rem';

    for (topico in jsonQ) {
        //setar o numero total de questoes
        requisitoTotal += jsonQ[topico].requisito

        //setar o numero de respostas para historico
        jsonQ[topico].tentativas = 0
    }

    // carregar a primeira atividade
    loadTopico(0);
    loadAtividade(0);
}

//carrega o nome do tópico, o numero de questoes para avançar
function loadTopico(nTopico) {
    document.querySelector('.nome').innerHTML = `Tópico ${nTopico + 1} - ${jsonQ[nTopico].nome}`;

    requisito = jsonQ[nTopico].requisito;
    corretas = 0;

    //barras de resposta correta
    let topicoC = document.querySelector('.topico-completion');

    topicoC.innerHTML = '';
    for (let i = 0; i < requisito; i++) {
        let ti = document.createElement('div');
        ti.classList.add('topico-indicador');

        topicoC.appendChild(ti);
    }

    topicoC.setAttribute('title', `Acerte ${requisito} questões para avançar`)

    currentTopico = nTopico;
}

//carrega o enunciado, alternativas e resposta correta
//pegar uma aleatoria e remover ela, se não tem mais, resetar o status da atual
function loadAtividade(nTopico) {
    let listaQuestoes = jsonQ[nTopico].questoes;

    if (listaQuestoes.length > 0) {
        let keys = Object.keys(jsonQ[nTopico].questoes);
        currentQuestion = keys[keys.length * Math.random() << 0]
        let atividade = jsonQ[nTopico].questoes[currentQuestion];

        // enunciado
        document.querySelector('.enunciado').innerHTML = atividade.enunciado;

        // alternativas
        let alternativasEl = document.querySelector('.alternativas')
        alternativasEl.innerHTML = '';
        for (let alt in atividade.alternativas) {
            let altEl = document.createElement('div');
            altEl.classList.add('uma-alt');

            let altIn = document.createElement('input');
            altIn.setAttribute('type', 'radio');
            altIn.setAttribute('name', 'al');
            altIn.setAttribute('id', 'a' + alt);
            altIn.setAttribute('index', alt);

            let altLa = document.createElement('label');
            altLa.setAttribute('for', 'a' + alt);
            altLa.innerHTML = `<span class="mono">${String.fromCharCode(parseInt(alt) + 97)})&emsp;</span>${atividade.alternativas[alt]}`;

            altEl.appendChild(altIn)
            altEl.appendChild(altLa)

            alternativasEl.appendChild(altEl);
        }

        // resposta correta
        currentRI = atividade.ri;

        // feedback
        feedback = atividade.feedback;


    } else {
        //desbloquear os inputs
        document.querySelectorAll('.alternativas input').forEach((el) => {
            el.setAttribute('disabled', 'false');
        })
    }
}

function avancar() {
    //respondeu tudo?
    if (corretas == requisito) {
        //tem proximo topico?
        if (currentTopico + 1 < jsonQ.length) {
            loadTopico(currentTopico + 1);

            //nao precisa do +1 porque ele atualizou quando carregou
            loadAtividade(currentTopico);
        } else {
            //pagina de resultados
            showResults()
        }
    } else {
        //carregar outra questão
        loadAtividade(currentTopico);
    }

    //resetar o feedback
    document.querySelector('.feedback').innerHTML = '';
    document.querySelector('.feedback').classList.remove('pos');
    document.querySelector('.feedback').classList.remove('neg');

    //resetar o botao
    document.querySelector('.confirma').innerHTML = 'Responder';
    document.querySelector('.confirma').setAttribute("onclick", 'responde()')

    //indicadores de progresso
}

function responde() {
    let resp = document.querySelector('input:checked');
    if (resp) {
        //bloquear os inputs
        document.querySelectorAll('.alternativas input').forEach((el) => {
            el.setAttribute('disabled', 'true');
        })

        let feedbackEl = document.querySelector('.feedback');
        if (resp.getAttribute('index') == currentRI) {
            //resposta correta
            feedbackEl.innerHTML = "Parabéns, você acertou! Siga em frente."

            feedbackEl.classList.add('pos');

            //progresso
            document.querySelectorAll('.topico-indicador')[corretas].classList.add('filled');

            corretas++;
            corretasTotal++

            progress.animate(corretasTotal / requisitoTotal);

            //remover a questão da lista
            jsonQ[currentTopico].questoes.splice(currentQuestion, 1)
        } else {
            //resposta errada
            feedbackEl.innerHTML = feedback;

            feedbackEl.classList.add('neg')
        }

        jsonQ[currentTopico].tentativas++;

        // comportamento botao 
        document.querySelector('.confirma').innerHTML = "Avançar";
        document.querySelector('.confirma').setAttribute('onclick', 'avancar()')
    }
}

function showResults() {
    document.querySelector('.nome').innerHTML = "Resultados"

    document.querySelector('footer').classList.add('hidden');
    document.querySelector('.alternativas').classList.add('hidden');
    document.querySelector('.topico-completion').classList.add('hidden');

    let targetEl = document.querySelector('.enunciado');

    targetEl.innerHTML = '';

    for (let i = 0; i < jsonQ.length; i++) {
        let resDiv = document.createElement('div');
        resDiv.classList.add('resultado-wrapper');

        let resNome = document.createElement('h3');
        resNome.innerHTML = `Tópico ${i + 1} - ${jsonQ[i].nome}`;

        let resCircle = document.createElement('div');
        resCircle.classList.add('resultado-circ');

        resDiv.appendChild(resNome);
        resDiv.appendChild(resCircle);

        targetEl.appendChild(resDiv);

        let precisava = jsonQ[i].requisito;
        let tentou = jsonQ[i].tentativas;

        // progessbar
        resultProgress.push(new ProgressBar.Circle(resCircle, {
            color: '#aaa',
            strokeWidth: 6,
            trailWidth: 4,
            easing: 'easeInOut',
            duration: 500,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#ff0', width: 6 },
            to: { color: '#5ac75a', width: 6 },
            step: function (state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);
                circle.setText(`${precisava}/${tentou}`);
            }
        }));

        resultProgress[i].text.style.fontFamily = '"Montserrat", Helvetica, sans-serif';
        resultProgress[i].text.style.fontSize = '1rem';
        resultProgress[i].animate(precisava / tentou);
    }
}