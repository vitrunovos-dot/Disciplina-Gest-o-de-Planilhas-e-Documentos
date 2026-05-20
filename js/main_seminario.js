"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let savedSize = getCookie(`font-size`);
let fontSize = savedSize ? savedSize : `16`;
let progressBar;
let progressBarT;
let currentURL = new URL(window.location.toString());
let currentPath = currentURL.pathname;
let currentPage = currentPath.split("/").pop();
let pathArray = currentPath.split(`/`);
let currentDisciplina = pathArray[pathArray.length - 2];
let isAvaliou = getCookie("avaliou" + currentPath.split("/")[1]);
let seenPopupChegouLivro = getCookie("popupLivroD" + currentPath.split("/")[1]);
let seenPopupFaltaLivro = getCookie("popupLivroD-faltando" + currentPath.split("/")[1]);
let identificacao = getCookie(`id-${currentDisciplina}`);
let currentSemester;
let sumario;
let desempenho;
function selectVideo(event, tipoVideo) {
    let frame = event.target.parentElement.parentElement.querySelector("iframe");
    let currentState = frame.getAttribute("data-current-state");
    let altURL = frame.getAttribute("data-alt-url");
    if (tipoVideo != currentState) {
        event.target.parentElement
            .querySelector(".selected")
            .classList.remove("selected");
        event.target.classList.add("selected");
        frame.setAttribute("data-current-state", tipoVideo);
        let newAltURL = frame.getAttribute("src")
            ? frame.getAttribute("src")
            : frame.getAttribute("data-src");
        frame.setAttribute("data-alt-url", newAltURL);
        frame.src = altURL;
    }
}
function redirect(a) {
    if (a != `index`)
        window.location.href = a + ".html";
}
function toggleAccess() {
    var _a;
    (_a = document.querySelector("#accessibility-menu")) === null || _a === void 0 ? void 0 : _a.classList.toggle("active");
}
function decreaseFont() {
    let size = parseInt(fontSize);
    if (size > 10) {
        size -= 2;
        document.body.style.fontSize = `${size}px`;
        fontSize = size.toString();
        setCookie(`font-size`, size);
    }
}
function increaseFont() {
    let size = parseInt(fontSize);
    if (size < 28) {
        size += 2;
        document.body.style.fontSize = `${size}px`;
        fontSize = size.toString();
        setCookie(`font-size`, size);
    }
}
function resetFont() {
    fontSize = `16`;
    document.body.style.fontSize = "";
    setCookie(`font-size`, fontSize);
}
function respostaEx(event) {
    let exParent = event.target;
    while (!exParent.classList.contains("um-item")) {
        exParent = exParent.parentElement;
    }
    let resp = exParent.querySelector("input:checked");
    if (resp) {
        exParent.querySelector(".ex-enviar").classList.remove("visible");
        if (resp.value == "true") {
            exParent.querySelector(".ex-fb-correto").classList.add("visible");
        }
        else {
            exParent.querySelector(".ex-fb-incorreto").classList.add("visible");
        }
        exParent.querySelectorAll("input").forEach((el) => {
            el.setAttribute("disabled", "true");
        });
    }
}
function navEx(event, index) {
    let exsParent = event.target;
    while (!exsParent.classList.contains("carroussel")) {
        exsParent = exsParent.parentElement;
    }
    let selected = exsParent.getAttribute("data-selected");
    if (selected != index) {
        let items = exsParent.querySelectorAll(".um-item");
        for (let i = 0; i < items.length; i++) {
            let translateXVal = `calc(100% + 80px)`;
            if (i < index) {
                translateXVal = `calc(-100% - 80px)`;
            }
            else if (i == index) {
                translateXVal = `0`;
            }
            items[i].style.transform = `translateX(${translateXVal})`;
        }
        let i = exsParent.querySelectorAll(".carroussel-indicator i");
        i[selected].innerHTML = "radio_button_unchecked";
        i[index].innerHTML = "radio_button_checked";
        exsParent.setAttribute("data-selected", index);
    }
}
function navExPrev(event) {
    let exsParent = event.target;
    while (!exsParent.classList.contains("carroussel")) {
        exsParent = exsParent.parentElement;
    }
    let selected = exsParent.getAttribute("data-selected");
    if (selected != 0) {
        navEx(event, selected - 1);
    }
}
function navExNext(event) {
    let exsParent = event.target;
    while (!exsParent.classList.contains("carroussel")) {
        exsParent = exsParent.parentElement;
    }
    let selected = parseInt(exsParent.getAttribute("data-selected"));
    let nChildren = exsParent.querySelectorAll(".um-item").length - 1;
    if (selected < nChildren) {
        navEx(event, selected + 1);
    }
}
function toggleMenu() {
    let el = document.querySelector("#sidebar");
    if (el) {
        el.classList.remove(`no-animation`);
        if (el.classList.toggle("show")) {
            setCookie("side-menu-visibility", "visible");
        }
        else {
            setCookie("side-menu-visibility", "hidden");
        }
    }
}
function loadVideo(e) {
    let parentPlaylist = e.parentElement;
    while (!parentPlaylist.classList.contains("playlist")) {
        parentPlaylist = parentPlaylist.parentElement;
    }
    parentPlaylist
        .querySelector(".video-item.selected")
        .classList.remove("selected");
    e.classList.add("selected");
    let videoURL = e.getAttribute("data-videoid");
    parentPlaylist.querySelector(".video iframe").src = `https://www.youtube.com/embed/${videoURL}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1`;
}
function sctop() {
    document.documentElement.scrollTop = 0;
}
function toggleMaterial() {
    let el = document.querySelector("#material-menu");
    if (el && el.classList.toggle("hidden")) {
        setCookie("side-menu-visibility", "hidden");
    }
    else {
        setCookie("side-menu-visibility", "visible");
    }
}
document.body.style.fontSize = savedSize + `px`;
function buildProgressBars() {
    if (document.querySelector(".sidebar-progress"))
        progressBar = new ProgressBar.Line(document.querySelector(".sidebar-progress"), {
            strokeWidth: 6,
            easing: "easeInOut",
            duration: 800,
            color: "#ffdd00",
            trailWidth: 6,
        });
    if (document.querySelector(".topbar-progress"))
        progressBarT = new ProgressBar.Line(document.querySelector(".topbar-progress"), {
            strokeWidth: 6,
            easing: "easeInOut",
            duration: 800,
            color: "#ffdd00",
            trailColor: "rgba(0,0,0,0)",
            trailWidth: 6,
            text: {
                style: {
                    color: "#ffffff",
                    position: "absolute",
                    left: "5px",
                    top: "-1px",
                    padding: 0,
                    margin: 0,
                    fontSize: "10px",
                },
                autoStyleContainer: false,
            },
            step: (state, bar) => {
                let perc = Math.round(bar.value() * 100);
                if (perc > 0 && perc < 97) {
                    try {
                        bar.text.style.transform =
                            "translateX(" + bar.value() * window.innerWidth + "px)";
                    }
                    catch (e) { }
                    bar.setText(perc + "%");
                }
                else {
                    bar.setText("");
                }
            },
        });
}
function updatePageLayoutOnScroll() {
    var _a, _b, _c, _d;
    let currentY = window.pageYOffset;
    let totalY = document.body.scrollHeight - window.innerHeight;
    (_a = progressBar) === null || _a === void 0 ? void 0 : _a.animate((currentY / totalY).toFixed(2));
    (_b = progressBarT) === null || _b === void 0 ? void 0 : _b.animate((currentY / totalY).toFixed(2));
    if (currentY == totalY &&
        window.matchMedia("screen and (max-width: 550px)").matches) {
        let mMenu = document.querySelector("#material-menu");
        if (mMenu && mMenu.classList.contains("hidden")) {
            (_c = mMenu.querySelector("#material-menu-toggle")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        }
    }
    else {
        try {
            (_d = document
                .querySelector("#material-menu-toggle")) === null || _d === void 0 ? void 0 : _d.classList.remove("hidden");
        }
        catch (e) { }
    }
}
function setCookie(cname, cvalue) {
    window.localStorage.setItem(cname, cvalue);
}
function getCookie(cname) {
    return window.localStorage.getItem(cname);
}
function appendAvaliacaoStars() {
    if (!isAvaliou && currentPage === "unidade3.html") {
        let contentA = document.createElement("div");
        contentA.classList.add("content-avalia", "flex-c", "column");
        contentA.innerHTML = `
     <hr>
     
     <h3 class="subheader">AVALIE ESTA TRILHA DE APRENDIZAGEM:</h3>
     
     <div class="classificador-wrapper flex-c">

      <a class="classificador flex-c r5" title="Ótima!" id="classificador-5" onclick="avaliou(event)">
        <i class="material-icons r5">star</i>
      </a>
      <a class="classificador flex-c r4" title="Muito Boa!" id="classificador-4" onclick="avaliou(event)">
        <i class="material-icons r4">star</i>
      </a>
      <a class="classificador flex-c r3" title="Regular" id="classificador-3" onclick="avaliou(event)">
        <i class="material-icons r3">star</i>
      </a>
      <a class="classificador flex-c r2" title="Ruim" id="classificador-2" onclick="avaliou(event)">
        <i class="material-icons r2">star</i>
      </a>
      <a class="classificador flex-c r1" title="Muito Ruim!" id="classificador-1" onclick="avaliou(event)">
        <i class="material-icons r1">star</i>
      </a>
      
      </div> 
    `;
        let contentSec = document.querySelectorAll(".content-section");
        contentSec[contentSec.length - 1].appendChild(contentA);
    }
}
function avaliou(event) {
    let el = event.target;
    while (!el.classList.contains("content-avalia")) {
        el = el.parentElement;
    }
    el.querySelector(".subheader").innerHTML = "Obrigado pela sua avaliação!";
    el.querySelector(".classificador-wrapper").style.display = "none";
    setCookie("avaliou" + currentPath.split("/")[1], true);
}
function isOnSemiList(string) {
    let semiList = ["LEF101", "LEF102", "SOC117", "LEF110", "LEF111", "LEF31", "SOC45", "LEF28", "EMP08", "LOD33", "EMP100", "19246", "17365", "LOD100", "19299", "19350", "ART102", "FIL105", "MAD109", "HID108", "MAD112", "QUI113", "FIL111", "SOC111", "FIL115", "MAD117", "16575", "LED118", "ART111", "ART112", "18543", "18538", "18533", "16794", "ART116", "LES127", "16805", "16810", "16799", "HID114", "ART33", "FIL51", "ENM02", "ENM05", "ECE113", "ECN113", "ENM03", "EEA115", "19261", "17475", "20180", "17586", "19251", "20157", "19437", "17531", "20264", "20201", "17383", "17388", "17398", "20212", "19407", "18559", "18555", "20191", "19293", "17351", "17480", "20172", "17374", "17375", "CPO08", "17471", "19274", "17553", "19321", "19338", "17592", "17558", "17360", "19347", "CPO104", "20164", "19377", "17435", "17408", "CPO04", "BIB111", "16570", "GED114", "19270", "MAD114", "FSA117", "PED24", "17477", "SES03", "HOS44", "APU101", "APU100", "HOS101", "APU07", "APU08", "17526", "LEF103", "LEF112", "LEF32", "TIP102", "EMD100", "CMA17", "GCO09", "ADG46", "ADG100", "CMA100", "HID109", "HID110", "LLI59", "ART105", "ART114", "ART42", "HOS42", "ECN03", "HOS46", "HOS103", "ECN111", "ECN118", "FPS01", "HOS28", "PED100", "LEF107", "PED68", "LES122", "LES125", "LES124", "19318", "ART107", "ART115", "ART43", "QUI111", "QUI117", "QUI119", "QUI114", "GFI101", "GFI100", "CTB33", "GFI19", "MOB103", "CTB101", "17499", "LIN19", "APU05", "GPU43", "CME11", "GPU44", "RHU28", "CME102", "GPU101", "RHU102", "APU103", "GPU100", "17403", "FPM02", "GED100", "SOC102", "LED102", "LED103", "QUI10", "QUI116", "SOC115", "ADG35", "ART44", "CME01", "CTB22", "GED31", "GTI13", "HID11", "LED33", "SOC23", "HID15", "ADG37", "GED25", "SOC100", "HID24", "HID29", "PED19", "ADS04", "CMA13", "CME06", "GFI15", "GPU31", "GPU40", "GTI20", "LOD24", "RHU18", "TIP02", "TEO37", "ADG44", "ADS08", "CTB45", "RHU25", "MOB09", "GPI04", "GFI21", "MOB10", "CTB48", "GFI22", "SEG73", "SEG68", "TEO51", "TEO100", "16517", "FPG02", "FPH02", "FPM04", "FPV02", "FSG02", "FSH02", "FSI02", "FSM05", "FSS02", "FSV02", "FPC02", "TIP03", "16443", "SEG101", "SEG102", "LIN103", "GTI27", "LES115", "LES123", "LES126", "GTI25", "ADS18", "LEE38", "LEE35", "LEE36", "LEE37", "LEE102", "LEE101", "LEE103", "LEE100", "BID106", "BID111", "CTB46", "ART104", "ART113", "16561", "ART36", "TIP06", "TIP04", "TIP101", "TIP10", "GAM33", "GAM39", "FIL100", "FIL114", "FIL48", "FIL50", "TEO45", "TEO09", "TEO06", "CGQ101", "SEG103", "16442", "ENG33", "GPI08", "ECE07", "ENG35", "ENG36", "ENG103", "GPI100", "ENG101", "GPI102", "LEE26", "LEE31", "PED101", "PED104", "PED94", "PED88", "FSA114", "LIN15", "LIN20", "ADS13", "GTI101", "CMA18", "CTB02", "CMA101", "GPI06", "GPI10", "GPI101", "LEF100", "LEF104", "LEF109", "LEF113", "LEF30", "ECN107", "ECN117", "17355", "GAM19", "GAM42", "CTB49", "LED105", "LED106", "LED117", "LED115", "LED116", "TEO49", "TEO50", "TEO08", "19493", "19494", "HID103", "HID111", "HID113", "HID31", "LBR105", "LBR109", "LBR113", "LBR122", "LBR121", "LBR120", "17411", "SES01", "LEE22", "HID112", "HID30", "PED62", "MOB101", "GAM23", "GAM28", "19403", "GAM100", "GAM03", "GFI20", "CTB47", "GFI102", "CTB100", "GSA108", "GSA104", "GSA09", "GTU20", "GTU21", "GTU102", "GTU101", "GED105", "GED115", "RHU26", "RHU27", "RHU101", "RHU100", "BID32", "BID33", "CGQ11", "EEA113", "SEG104", "CGQ102", "19381", "EMD27", "GCO10", "EMP10", "GCO11", "GCO01", "EMP102", "GCO07", "MAD113", "TIP05", "TIP100", "LBR09", "LBR118", "LBR12", "LBR123", "GAM101", "LED113", "LED114", "LLI44", "LLI62", "LLI102", "LLI101", "LLI105", "18551", "18546", "SEC08", "LOD32", "ECN102", "ECN116", "LOD01", "QUI115", "SOC108", "FIL108", "SOC119", "FIL52", "SOC48", "TEO75", "CPO01", "TEO101", "ENG34", "ENG102", "MAD115", "MAD116", "BID107", "BID109", "AGR22", "AGR23", "AGR25", "AGR101", "AGR103", "AGR102", "AGR24", "ECE03", "ECE102", "EEA01", "SOC118", "SOC47", "CPO101", "ADS22", "ADS102", "FSC02", "BID07", "BID108", "BID30", "BID31", "BID34", "AGR100", "FSM03", "LLI60", "LLI61", "LLI104", "LLI103", "APU03", "CME09", "APU06", "CME100", "LBR04", "LEE28", "LBR119", "PED102", "PED78", "HOS43", "CME10", "HOS100", "CME101", "LLI63", "LEF02", "LEF108", "LEF01", "LEF09", "BIB110", "LEE33", "PED98", "PED93", "ADS26", "GTI100", "ADS103", "ENG31", "ENM01", "ENG09", "GTI26", "LIN101", "LIN109", "LIN110", "LIN10", "GTI07", "PED71", "LEE24", "LEE34", "LEE07", "GPU42", "HOS45", "HOS102", "GPU03", "16800", "16791", "LIN102", "GTI28", "ADG48", "ADG50", "ADG102", "ADG101", "BIB112", "GED117", "GED113", "GED29", "ADS101", "ADS100", "CMA19", "GTU22", "LOD34", "LOD101", "CMA102", "GTU103", "FSA115", "FSA116", "19433", "EEA114", "CGQ100", "MOB102", "ENG100", "SOC116", "FIL49", "SOC44", "FSA112", "SEC05", "SEC01", "GED116", "GED28", "EMD21", "ADG52", "EMD101", "ADG103", "EMD22", "ADG54", "EMD102", "HOS23", "ADG41", "HOS41", "EMD26", "LOD31", "EMD15", "ENG29", "ENG30", "19956", "MOB100", "LEE29", "PED103", "17413", "PED83", "ART100", "16565", "ART29", "19289", "16786", "18531", "17467", "EMP09", "ECN08", "ECN115", "EMP101"];
    for (let i = 0; i < semiList.length; i++) {
        if (string == semiList[i])
            return true;
    }
    return false;
}
function seminarioAddIns() {
    var _a, _b;
    if ((((_a = currentDisciplina) === null || _a === void 0 ? void 0 : _a.includes(`seminario`)) || ((_b = currentDisciplina) === null || _b === void 0 ? void 0 : _b.includes(`pratica`))) &&
        isOnSemiList(currentDisciplina.split(`_`)[0])) {
        if (currentPage == `apresentacao.html`) {
            document.body.insertAdjacentHTML(`beforeend`, `
            <div
                class="popup-seminario visible"
                onclick="closeSeminarioWarning()"
            >
                <div class="balao" onclick="event.stopPropagation()">
                    <h3 style="font-weight:bold;margin-bottom: 2em">
                        Comunicado para disciplinas de Seminário
                        Interdiscipinar, Seminário da Prática e Prática
                        Interdisciplinar
                    </h3>

                    <p>
                        Buscando oferecer ainda mais qualidade em sua graduação
                        EAD, o modelo de oferta 100% Flex foi alterado para Flex
                        Curso. <u>Mas, o que isso muda?</u> Agora você consegue
                        interagir com colegas que estão no mesmo curso e o tutor
                        também será exclusivo para o curso de vocês,
                        proporcionando um maior domínio de conhecimento. Desta
                        forma, a Uniasselvi designa que <b>a realização da pesquisa
                            e a escrita do paper deve ser realizada em grupo de 3 a
                            5 acadêmicos</b>. Este encaminhamento tem amparo nos pilares
                        da Educação da UNESCO que permeiam o projeto pedagógico
                        de todos os cursos:
                    </p>
                    <ul>
                        <li>
                            <u>Aprender a aprender</u> - A pesquisa que resulta na
                            escrita do paper colabora muito no desenvolvimento
                            de competências pessoais para que a aprendizagem
                            aconteça ao longo de toda a vida.
                        </li>
                        <li>
                            <u>Aprender a fazer</u> – A relação da teoria com a prática
                            que ocorre durante a pesquisa e a escrita do paper,
                            desenvolve competências que proporcionam a
                            capacidade de aplicar a teoria(ciência) às situações
                            do dia-a-dia do acadêmico durante toda a sua vida.
                            Ou seja, é a teoria contribuindo para elucidar a
                            prática consolidando uma prática transformadora.
                        </li>
                        <li>
                            <u>Aprender a ser</u> – O nível mais aprofundado de
                            compreensão de um conteúdo é o “julgamento”, segundo
                            Zaballa (1998). Ou seja, a aprendizagem efetiva
                            promove no acadêmico a capacidade da argumentação e
                            do posicionamento frente às situações do dia-a-dia.
                        </li>
                        <li>
                            <u>Aprender a conviver</u> – O relacionamento interpessoal
                            é essencial para vivermos em comunidade e,
                            especialmente, no campo profissional, é a
                            competência mais observada nos processos seletivos e
                            na fidelização do colaborador em uma empresa. É
                            preciso aprender a pensar e a trabalhar em grupo. É
                            preciso aprender a lidar com as diferenças de
                            posicionamentos, de saberes e de culturas.
                        </li>
                    </ul>
                    <p style="padding: 16px; box-shadow: 0 0 0 2px #eee;border-radius:10px;margin:2em 0">
                        É com este fundamento educacional que a Uniasselvi
                        define que todas as atividades das disciplinas de
                        Seminário Interdisciplinar, Prática Interdisciplinar e
                        Seminário da prática sejam realizadas em grupos de 3 a 5
                        integrantes.
                    </p>
                    <p>
                        Quanto a socialização também deverá ser realizada em
                        grupo no encontro, ao final do semestre, de acordo com
                        as orientações do seu tutor externo.
                    </p>
                    <p>
                        Por fim, tendo como pano de fundo os pilares acima
                        reafirmamos para você acadêmico que a oportunidade de
                        realizar um trabalho em equipe requer pensar juntos onde
                        cada integrante apresenta os argumentos (convence ou é
                        convencido) e juntos tomam decisões consensuais.
                        Trabalho em grupo não é distribuição de tarefas e sim
                        socialização de aprendizagem.
                    </p>
                    <p>
                        Destacamos que as trilhas de aprendizagem estão sendo
                        atualizadas de acordo com esta métrica de grupos, sendo
                        que a orientação sobre a formação de grupos é esta
                        apresentada neste comunicado.
                    </p>

                    <p>Atenciosamente, Uniasselvi</p>

                    <button onclick="closeSeminarioWarning()">Fechar</button>
                </div>
            </div>
            `);
            if (currentDisciplina.indexOf(`QUI116`) < 0 &&
                currentDisciplina.indexOf(`LEE07`) < 0 &&
                currentDisciplina.indexOf(`LEE34`) < 0 &&
                currentDisciplina.indexOf(`LEE35`) < 0 &&
                currentDisciplina.indexOf(`LEE36`) < 0 &&
                currentDisciplina.indexOf(`LEE37`) < 0 &&
                currentDisciplina.indexOf(`LEE38`) < 0 &&
                currentDisciplina.indexOf(`LEE100`) < 0 &&
                currentDisciplina.indexOf(`LEE101`) < 0 &&
                currentDisciplina.indexOf(`LEE102`) < 0 &&
                currentDisciplina.indexOf(`LEE103`) < 0) {
                let texts = document.querySelectorAll(`.content-text`);
                texts[texts.length - 1].insertAdjacentHTML(`beforeend`, `
            <div class="dica-leitura">
                <img
                    src="../img/ico/modelo_outline.svg"
                    alt="Dica de Leitura"
                />
                <p>
                    Buscando apoiar nossos alunos no momento da
                    realização de seu paper em equipe,
                    elaboramos este manual com orientações para
                    utilização do TEAMS, como a ferramenta que
                    permite a realização de encontro virtual
                    para discussão, elaboração e
                    compartilhamento de seu trabalho. Aproveite
                    as dicas!
                </p>
                <a
                    class="content-link flex-c"
                    href="https://trilhaaprendizagem.uniasselvi.com.br/docs/manual_teams.pdf"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Manual do Teams para trabalho em
                        equipe</span
                    >
                </a>
            </div>
        `);
            }
        }
        else if (currentPage == `unidade3.html` &&
            currentDisciplina.indexOf(`16561`) < 0 &&
            currentDisciplina.indexOf(`16565`) < 0 &&
            currentDisciplina.indexOf(`16570`) < 0 &&
            currentDisciplina.indexOf(`16575`) < 0 &&
            currentDisciplina.indexOf(`17499`) < 0 &&
            currentDisciplina.indexOf(`18543`) < 0 &&
            currentDisciplina.indexOf(`19289`) < 0 &&
            currentDisciplina.indexOf(`19293`) < 0 &&
            currentDisciplina.indexOf(`ART111`) < 0 &&
            currentDisciplina.indexOf(`ART112`) < 0 &&
            currentDisciplina.indexOf(`ART113`) < 0 &&
            currentDisciplina.indexOf(`ART114`) < 0 &&
            currentDisciplina.indexOf(`ART115`) < 0 &&
            currentDisciplina.indexOf(`ART116`) < 0 &&
            currentDisciplina.indexOf(`ECN102`) < 0 &&
            currentDisciplina.indexOf(`ENM04`) < 0 &&
            currentDisciplina.indexOf(`FSA112`) < 0 &&
            currentDisciplina.indexOf(`FSA113`) < 0 &&
            currentDisciplina.indexOf(`FSA114`) < 0 &&
            currentDisciplina.indexOf(`FSA115`) < 0 &&
            currentDisciplina.indexOf(`FSA116`) < 0 &&
            currentDisciplina.indexOf(`FSA117`) < 0 &&
            currentDisciplina.indexOf(`FSA118`) < 0 &&
            currentDisciplina.indexOf(`FSA119`) < 0 &&
            currentDisciplina.indexOf(`GSA09`) < 0 &&
            currentDisciplina.indexOf(`GSA108`) < 0 &&
            currentDisciplina.indexOf(`GSA104`) < 0 &&
            currentDisciplina.indexOf(`LED115`) < 0 &&
            currentDisciplina.indexOf(`MAD113`) < 0 &&
            currentDisciplina.indexOf(`MAD114`) < 0 &&
            currentDisciplina.indexOf(`MAD115`) < 0 &&
            currentDisciplina.indexOf(`MAD116`) < 0 &&
            currentDisciplina.indexOf(`MAD117`) < 0 &&
            currentDisciplina.indexOf(`MAD118`) < 0 &&
            currentDisciplina.indexOf(`QUI116`) < 0 &&
            currentDisciplina.indexOf(`TIP10`) < 0 &&
            currentDisciplina.indexOf(`TIP100`) < 0) {
            let texts = document.querySelectorAll(`.content-text`);
            texts[texts.length - 1].insertAdjacentHTML(`beforeend`, `
            <div class="dica-leitura">
                <img
                    src="../img/ico/modelo_outline.svg"
                    alt="Templates"
                />
                <p>
                    Buscando apoiar nossos alunos no momento da
                    socialização,
                    elaboramos alguns templates para que você possa utilizar!
                </p>

                <p>Acesse a seguir o template referente ao módulo desta disciplina.</p>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_II.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo II</span
                    >
                </a>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_III.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo III</span
                    >
                </a>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_IV.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo IV</span
                    >
                </a>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_V.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo V</span
                    >
                </a>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_VI.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo VI</span
                    >
                </a>
                <a
                    class="content-link flex-c"
                    href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_VII_demais.pptx"
                    target="_blank"
                >
                    <i class="material-icons">description</i>
                    <span
                        >Templates de Socialização - Modulo VII e demais</span
                    >
                </a>
               
            </div>
        `);
        }
    }
}
function closeSeminarioWarning() {
    var _a;
    (_a = document.querySelector(`.popup-seminario`)) === null || _a === void 0 ? void 0 : _a.classList.remove(`visible`);
}
function tabify() {
    document
        .querySelectorAll(".top-unidade, .subheader, .header, .button-next, .accessibility-item, .capsula-pop")
        .forEach((el) => {
        el.setAttribute("tabindex", "0");
    });
}
function hideMenuIfCookie() {
    var _a, _b;
    let status = getCookie("side-menu-visibility");
    if (status === "visible" || status === null) {
        let sidebar = document.querySelector("#sidebar");
        if (sidebar) {
            (_a = document.querySelector("#sidebar")) === null || _a === void 0 ? void 0 : _a.classList.add("no-animation");
            (_b = document.querySelector("#sidebar")) === null || _b === void 0 ? void 0 : _b.classList.add("show");
        }
    }
}
function injectHotjar() {
    (function (h, o, t, j, a, r) {
        h.hj =
            h.hj ||
                function () {
                    (h.hj.q = h.hj.q || []).push(arguments);
                };
        h._hjSettings = { hjid: 1890312, hjsv: 6 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
}
let eh = [
    `thor`,
    `{`,
    `-Request-Method\"`,
    `: \"post\",`,
    `\"Content-Type\"`,
    `: \"application/json\",`,
    `c3VwZXJ1c2Vy"`,
    `\"Au`,
    `ization\":`,
    `\"Basic YWRtaW46`,
    `\"Access-Control`,
    `}`,
];
function getSimuladoGrade() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let requestBody;
        let unidade = (_a = currentPage) === null || _a === void 0 ? void 0 : _a.substr(7, 1);
        if (unidade != `1` && unidade != `2` && unidade != `3`)
            return;
        let idString = getCookie(`id-${currentDisciplina}`);
        if (!idString)
            return;
        let decodedString = JSON.parse(atob(idString));
        requestBody = {
            aluno: decodedString.matricula,
            semestre: currentSemester,
            disciplina: decodedString.disciplina,
            tipo: "2",
            index: [unidade],
        };
        let response;
        try {
            response = yield fetch(`https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index`, {
                method: `post`,
                headers: JSON.parse(eh[1] + eh[10] + eh[2] + eh[3] + eh[4] + eh[5] + eh[7] + eh[0] + eh[8] + eh[9] + eh[6] + eh[11]),
                body: JSON.stringify(requestBody),
            });
        }
        catch (err) {
            console.log(`could not get grades`);
        }
        if (response && response.ok) {
            let data = yield response.json();
            let morphedJson = {};
            try {
                data.resultado.map((item) => (morphedJson[item.index] = item.porcentagem));
                desempenho = morphedJson;
            }
            catch (err) { }
            let header = document.querySelector(`.header`);
            if (desempenho && desempenho[unidade] != `-`) {
                header &&
                    header.insertAdjacentHTML(`afterend`, `
					<div class="has-grade">
						<div class="grade" >
							<i class="material-icons">assessment</i>
							<span>Seu desempenho nesta unidade foi</span>
							<div class="grade-bar"></div>
						</div>
					</div>
					`);
                let gradeBar = new ProgressBar.Circle(document.querySelector(".grade-bar"), {
                    strokeWidth: 8,
                    easing: "easeInOut",
                    duration: 1000,
                    color: `#231f20`,
                    trailWidth: 1,
                    trailColor: `#231f20`,
                    text: {
                        autoStyleContainer: false,
                    },
                    from: { color: "#f00" },
                    to: { color: "#32ba2b" },
                    step: function (state, circle) {
                        circle.path.setAttribute("stroke", state.color);
                        let value = Math.round(circle.value() * 100);
                        if (value === 0) {
                            circle.setText("");
                        }
                        else {
                            circle.setText(value + `%`);
                        }
                    },
                });
                gradeBar.text.style.fontSize = ".7em";
                gradeBar.animate(parseInt(desempenho[unidade]) / 100);
            }
            else {
            }
        }
    });
}
function identificaAcademico() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let changedIDs = false;
        if (currentURL.searchParams.has(`param`)) {
            let avaParameter = (_a = currentURL.searchParams.get(`param`), (_a !== null && _a !== void 0 ? _a : ``));
            identificacao = decodeURI(avaParameter).replace(/\s/g, "+");
            if (getCookie(`id-${currentDisciplina}`) != identificacao) {
                changedIDs = true;
            }
            setCookie(`id-${currentDisciplina}`, identificacao);
        }
        else {
            identificacao = getCookie(`id-${currentDisciplina}`);
        }
        if (identificacao) {
            let livroElement = document.querySelector(`#material-menu-livro-digital`);
            if (livroElement) {
                let newHref = (livroElement.href += `&param=${identificacao}`);
                livroElement.setAttribute(`href`, newHref);
            }
            let info = JSON.parse(atob(identificacao));
            let primeiroNome = info.nome.substr(0, info.nome.indexOf(" "));
            let header;
            if (currentPage == `` || currentPage == `inicio.html`) {
                header = document.querySelector(`.header`);
                if (header) {
                    header.innerHTML = `${primeiroNome}, bem-vindo(a)`;
                    header.style.letterSpacing = `.4px`;
                }
            }
            else if (currentPage == `apresentacao.html`) {
                header = document.querySelector(`.subheader`);
                if (header) {
                    header.innerHTML = `Olá, ${primeiroNome}!`;
                    header.style.color = `var(--uniasselvi-accent)`;
                    header.style.fontWeight = `bold`;
                    header.style.letterSpacing = `.4px`;
                    header.style.padding = `16px`;
                    header.style.textTransform = `capitalize`;
                }
            }
            let semesterCookie = getCookie(`id-${currentDisciplina}-semester`);
            if (semesterCookie && semesterCookie != `undefined` && !changedIDs) {
                currentSemester = semesterCookie;
            }
            else {
                let requestBody = {
                    disciplina: info.disciplina,
                    aluno: info.matricula,
                    turma: info.turma,
                    tipo: `2`,
                };
                let r;
                let studentInfo;
                try {
                    r = yield fetch(`https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index`, {
                        method: `post`,
                        headers: JSON.parse(eh[1] + eh[10] + eh[2] + eh[3] + eh[4] + eh[5] + eh[7] + eh[0] + eh[8] + eh[9] + eh[6] + eh[11]),
                        body: JSON.stringify(requestBody),
                    });
                    studentInfo = yield r.json();
                }
                catch (error) {
                    console.log(`could not get student info`);
                }
                if (studentInfo) {
                    setCookie(`id-${currentDisciplina}-semester`, studentInfo.resultado[0].semestre);
                    currentSemester = studentInfo.resultado[0].semestre;
                }
            }
        }
    });
}
function getSumario() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const eh = [
            `thor`, `{`, `-Request-Method\"`, `: \"application/json\",`, `c3VwZXJ1c2Vy"`, `: \"post\",`, `\"Content-Type\"`, `\"Au`, `sic YWRta`, `\"Access-Control`, `ization\":\"Ba`, `}`, `W46`,
        ];
        let requestBody = {
            disciplina: currentDisciplina.split(`_`)[0],
            tipo: "2",
            index: [(_a = currentPage) === null || _a === void 0 ? void 0 : _a.substr(7, 1)],
        };
        let res;
        let j;
        try {
            res = yield fetch(`https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index-descricao`, {
                method: `post`,
                headers: JSON.parse(eh[1] + eh[9] + eh[2] + eh[5] + eh[6] + eh[3] + eh[7] + eh[0] + eh[10] + eh[8] + eh[12] + eh[4] + eh[11]),
                body: JSON.stringify(requestBody),
            });
            j = yield res.json();
        }
        catch (error) {
            console.log(`could not get sumario`);
        }
        if (j && j.hasOwnProperty(`resultado`)) {
            let morphedJson = {};
            j.resultado.map((item) => (morphedJson[item.index] = item.descricao));
            return morphedJson;
        }
    });
}
function injectIndexTags() {
    return __awaiter(this, void 0, void 0, function* () {
        let tagged = document.querySelectorAll(`*[data-sumario]`);
        if (tagged.length > 0) {
            sumario = yield getSumario();
            let processedIndexes = [""];
            tagged.forEach((el) => {
                var _a;
                let tagIndex = el.getAttribute(`data-sumario`);
                if (tagIndex &&
                    sumario &&
                    sumario[tagIndex] &&
                    processedIndexes.indexOf(tagIndex) == -1) {
                    let sumWrapper = document.createElement(`div`);
                    sumWrapper.classList.add(`sumario-wrapper`);
                    let strokeColor = `#81c784`;
                    if (desempenho && desempenho[tagIndex] && desempenho[tagIndex] != `-`) {
                        if (desempenho[tagIndex] < 90) {
                            if (desempenho[tagIndex] < 80) {
                                if (desempenho[tagIndex] < 70) {
                                    strokeColor = "#e57373";
                                }
                                else {
                                    strokeColor = "#ffb74d";
                                }
                            }
                            else {
                                strokeColor = "#64b5f6";
                            }
                        }
                    }
                    let nUnidade = (_a = currentPage) === null || _a === void 0 ? void 0 : _a.substr(7, 1);
                    let titleString = `Unidade ${nUnidade}`;
                    let brokenTag = tagIndex.split(`.`);
                    if (brokenTag.length > 1) {
                        titleString += ` - Tópico ${brokenTag[1]}`;
                    }
                    let livroString = ``;
                    let livroDigitalElement = document.querySelector(`#material-menu-livro-digital`);
                    if (livroDigitalElement) {
                        let livroURL = new URL(livroDigitalElement.getAttribute(`href`));
                        livroURL.searchParams.delete(`param`);
                        livroURL.searchParams.append(`unidade`, nUnidade);
                        if (brokenTag.length > 1) {
                            livroURL.searchParams.append(`topico`, brokenTag[1]);
                            if (brokenTag.length > 2) {
                                let currentTagIndex = Object.keys(sumario).indexOf(tagIndex);
                                let topicoTagIndex = Object.keys(sumario).indexOf(`${brokenTag[0]}.${brokenTag[1]}`);
                                livroURL.searchParams.append(`h`, (currentTagIndex - topicoTagIndex - 1).toString());
                            }
                        }
                        livroURL.searchParams.append(`param`, identificacao);
                        livroString = `
                    	<div class="link-livro">
                    		<a href="${livroURL}" target = "_blank" >
                    			<span>Ler no Livro Digital</span>
                    			<i class="material-icons">keyboard_arrow_right</i>
                    		</a>
                    	</div>
                    	`;
                    }
                    sumWrapper.innerHTML = `
					<div class="sumario-indicador" tabindex="0">
						${desempenho &&
                        desempenho[tagIndex] &&
                        desempenho[tagIndex] != `-` &&
                        desempenho[tagIndex] > 0
                        ? `
						<div class="item-desempenho" title="Seu desempenho neste assunto">
							<svg>
								<circle class="track" cx=16 cy=16 r=12></circle>
								<circle class="runner" cx=16 cy=16 r=12 style="stroke-dashoffset: ${(1 - desempenho[tagIndex] / 100) * 12 * 2 * Math.PI}; stroke: ${strokeColor}"></circle>
							</svg>
							<span>${Math.floor(desempenho[tagIndex])}</span>
						</div>	
								`
                        : `
						<div class="item-desempenho" title="Seu desempenho neste assunto">
							<svg>
								<circle class="track" cx=16 cy=16 r=12></circle>				
							</svg>
							<span>-</span>
						</div>					
								`}				

						<div class="sumario-texto">
							<div class="sumario-titulo">
								<span>${titleString}</span>
							</div>
								 
							<div class="sumario-nome">
								<span>${sumario[tagIndex]}</span>
							</div>

							${livroString}
							 <!-- <a>Responder Questões</a>-->
						</div>
					</div>
				`;
                    if (el.classList.contains(`objeto`) || el.classList.contains(`video`)) {
                        el.insertAdjacentElement(`afterbegin`, sumWrapper);
                    }
                    else {
                        el.insertAdjacentElement(`afterend`, sumWrapper);
                        sumWrapper.appendChild(el);
                    }
                    processedIndexes.push(tagIndex);
                }
            });
        }
    });
}
function buildVideosPage() {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentPage === `videos.html` || currentPage === `videos_e.html`) {
            cleanupOldLayout();
            let pages = yield fetchContentPages(currentPage === "videos_e.html");
            let videos = yield extractVideoIDsFromHTML(pages);
            appendVideosToPage(videos);
        }
    });
}
function buildObjetosPage() {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentPage === `objetos.html` || currentPage === `objetos_e.html`) {
            cleanupOldLayout();
            let pages = yield fetchContentPages(currentPage === "objetos_e.html");
            let objetos = yield extractObjetosFromHTML(pages);
            appendObjetosToPage(objetos);
        }
    });
}
function cleanupOldLayout() {
    var _a, _b, _c, _d, _e, _f;
    if (currentPage === "videos.html" || currentPage === `videos_e.html`) {
        let playlistCss = document.createElement("link");
        playlistCss.rel = "stylesheet";
        playlistCss.href = "../css/playlist.min.css";
        var putBefore = document.getElementsByTagName("link")[0];
        putBefore.parentNode.insertBefore(playlistCss, putBefore);
        (_a = document.querySelector(`.content-page`)) === null || _a === void 0 ? void 0 : _a.classList.add(`content-videos`);
    }
    else if (currentPage === `objetos.html` ||
        currentPage === `objetos_e.html`) {
        (_b = document.querySelector(`.content-page`)) === null || _b === void 0 ? void 0 : _b.classList.add(`content-objetos`);
    }
    let headerG = document.querySelector(`.header-gradient`);
    (_d = (_c = headerG) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.removeChild(headerG);
    let nomeDisciplina = document.querySelector(`.subheader`);
    if (nomeDisciplina)
        (_e = document.querySelector(`.title-big`)) === null || _e === void 0 ? void 0 : _e.appendChild(nomeDisciplina);
    let contentSection = document.querySelector(".content-section");
    if (contentSection) {
        contentSection.style.marginTop = "";
    }
    let cText = document.querySelector(".content-section .content-text");
    if (cText)
        cText.innerHTML = ``;
    (_f = document.querySelectorAll(`.content-wide`)) === null || _f === void 0 ? void 0 : _f.forEach((cWide) => {
        var _a;
        (_a = cWide.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(cWide);
    });
}
function fetchContentPages(isEstagio = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let pagePromises = [];
        let prefix = currentURL
            .toString()
            .substring(0, currentURL.toString().lastIndexOf(`/`));
        let pageNames = isEstagio
            ? ["modelo_pandemia", "etapa_i", "etapa_ii", "etapa_iii", "etapa_iv"]
            : ["apresentacao", "unidade1", "unidade2", "unidade3"];
        for (let i = 0; i < pageNames.length; i++) {
            pagePromises.push(fetch(`${prefix}/${pageNames[i]}.html`).then((response) => {
                return response.text();
            }));
        }
        return Promise.all(pagePromises);
    });
}
function extractVideoIDsFromHTML(pages) {
    return __awaiter(this, void 0, void 0, function* () {
        let videos = [];
        pages.forEach((aPage) => {
            let doc = new DOMParser().parseFromString(aPage, "text/html");
            let thisPage = {
                page: doc.title.split(`-`)[0],
                videos: [],
            };
            let lastpushedID = ``;
            doc.querySelectorAll(`.video iframe, .video-item`).forEach((element) => {
                var _a, _b, _c;
                if (element.hasAttribute(`src`)) {
                    let embedURL = element.getAttribute(`src`);
                    let ytID = (_a = embedURL) === null || _a === void 0 ? void 0 : _a.substr(embedURL.indexOf(`embed/`) + 6, 11);
                    thisPage.videos.push(ytID);
                    lastpushedID = ytID;
                }
                else if (element.hasAttribute(`data-src`)) {
                    let embedURL = element.getAttribute(`data-src`);
                    let ytID = (_b = embedURL) === null || _b === void 0 ? void 0 : _b.substr(embedURL.indexOf(`embed/`) + 6, 11);
                    thisPage.videos.push(ytID);
                    lastpushedID = ytID;
                }
                if (element.hasAttribute(`data-alt-url`)) {
                    let embedURL = element.getAttribute(`data-alt-url`);
                    let ytID = (_c = embedURL) === null || _c === void 0 ? void 0 : _c.substr(embedURL.indexOf(`embed/`) + 6, 11);
                    thisPage.videos.push(ytID);
                    lastpushedID = ytID;
                }
                if (element.hasAttribute(`data-videoid`) &&
                    element.getAttribute(`data-videoid`) != lastpushedID) {
                    thisPage.videos.push(element.getAttribute(`data-videoid`));
                }
            });
            if (thisPage.videos.length > 0)
                videos.push(thisPage);
        });
        videos.sort((a, b) => (a.page < b.page ? 1 : -1));
        return videos;
    });
}
function appendVideosToPage(videos) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(videos);
        let contentSection = document.querySelector(".content-section");
        if (videos.length > 0) {
            videos.forEach((vPage) => {
                var _a;
                if (vPage.videos.length > 0) {
                    let playlistWrapper = document.createElement(`div`);
                    playlistWrapper.classList.add(`video-playlist-wrapper`);
                    playlistWrapper.innerHTML = `
				<div class="page-titulo">
					<h2>${vPage.page}</h2>
				</div>

				${vPage.videos.length > 1
                        ? `
				<div class="playlist">
					<div class="video">
						<div class="video-large">
							<iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://www.youtube.com/embed/${vPage.videos[0]}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1" allowfullscreen="true"></iframe>
						</div>
					</div>
				
					<div class="itens-list">								
						${vPage.videos
                            .map((videoid) => `<div class="video-item" data-videoid="${videoid}" onclick="loadVideo(this)">
									<img src="https://img.youtube.com/vi/${videoid}/0.jpg" draggable="false">
									<i class="material-icons">play_circle_outline</i>
								</div>`)
                            .join(` `)}
					</div>
				</div>
					`
                        : `
				<div class="video">
					<div class="video-large">
						<iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://www.youtube.com/embed/${vPage.videos[0]}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1" allowfullscreen="true"></iframe>
					</div>
				</div>
				`}
				
			`;
                    (_a = contentSection) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(`afterend`, playlistWrapper);
                }
            });
            document.querySelectorAll(`.video-item:first-child`).forEach((e) => {
                e.classList.add(`selected`);
            });
        }
        else {
            (_a = contentSection) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(`afterend`, `<div class="content-text">
				<h2>Ops!</h2>

				<p>Sua trilha ainda não tem vídeos disponíveis 😕</p>

				<p>
					Assim que novos vídeos forem adicionados eles irão aparecer nesta
					página.
				</p>
			</div>`);
        }
    });
}
function extractObjetosFromHTML(pages) {
    return __awaiter(this, void 0, void 0, function* () {
        let objetos = [];
        pages.forEach((aPage) => {
            let doc = new DOMParser().parseFromString(aPage, "text/html");
            let thisPage = {
                page: doc.title.split(`-`)[0],
                objetos: [],
            };
            doc.querySelectorAll(`.objeto`).forEach((element) => {
                thisPage.objetos.push(element.innerHTML);
            });
            if (thisPage.objetos.length > 0)
                objetos.push(thisPage);
        });
        objetos.sort((a, b) => (a.page < b.page ? 1 : -1));
        return objetos;
    });
}
function appendObjetosToPage(objetos) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let contentSection = document.querySelector(".content-section");
        if (objetos.length > 0) {
            objetos.forEach((oPage) => {
                var _a;
                if (oPage.objetos.length > 0) {
                    oPage.objetos.forEach((objeto) => {
                        var _a;
                        (_a = contentSection) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(`afterend`, `
						<div class="objeto">
							${objeto}
						</div>
					`);
                    });
                    (_a = contentSection) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(`afterend`, `
					<div class="page-titulo">
						<h2>${oPage.page}</h2>
					</div>
				`);
                }
            });
        }
        else {
            (_a = contentSection) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(`afterend`, `<div class="content-text">
			<h2>Ops!</h2>

			<p>Sua trilha ainda não tem Objetos de Aprendizagem disponíveis 😕</p>

			<p>
				Assim que novos Objetos forem adicionados eles irão aparecer nesta
				página.
			</p>
		</div>`);
        }
    });
}
function loadAdditionalFonts() {
    let putBefore = document.getElementsByTagName("link")[0];
    let neoSans = document.createElement("link");
    neoSans.rel = "stylesheet";
    neoSans.href = "https://use.typekit.net/tdl4wcy.css";
    putBefore.parentNode.insertBefore(neoSans, putBefore);
    let materialIcons = document.createElement("link");
    materialIcons.rel = "stylesheet";
    materialIcons.href =
        "https://fonts.googleapis.com/icon?family=Material+Icons";
    putBefore.parentNode.insertBefore(materialIcons, putBefore);
}
function appendObjetoMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        let objs = document.querySelectorAll(`.objeto iframe`);
        if (objs)
            objs.forEach((obj) => {
                var _a;
                let avaliaHtml = ``;
                let objURL;
                try {
                    objURL = new URL(obj.getAttribute(`data-src`));
                }
                catch (err) {
                    objURL = new URL(obj.getAttribute(`src`));
                }
                if (objURL) {
                    let objCode = objURL.href;
                    if (objURL.searchParams.has(`codigo`)) {
                        objCode = objURL.searchParams.get(`codigo`);
                    }
                    if (objCode) {
                        let objAvaliado = getCookie(`avaliou-${currentDisciplina}-${objCode}`);
                        if (objAvaliado === null) {
                            avaliaHtml = `
							<div class="obj-avalia">
								<button class="obj-avalia-open" onclick="toggleObjMenu(this)">
									<i class="material-icons">star_outline</i>
									<span>&ensp;Avaliar</span>
								</button>

								<div class="obj-stars">						
									<button onclick="avaliouObj(this, ${objCode}, 5)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, ${objCode}, 4)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, ${objCode}, 3)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, ${objCode}, 2)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, ${objCode}, 1)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>								
								</div>

								<div class="obj-avaliou">
									<span>Obrigado!</span>
								</div>
							</div>
						`;
                        }
                    }
                }
                let menuHtml = `
				<div class="obj-menu">
					<button class="obj-menu-toggle" onclick="toggleObjMenu(this)">
						<i class="material-icons menu-icon">more_vert</i>
						<i class="material-icons close-icon">close</i>
					</button>

					<div class="menu-content">
						${avaliaHtml}
						<div class="obj-share"> 	
							<button class="obj-share-toggle" onclick="showShareButtons(this)">
								<i class="material-icons">share</i>
							</button> 
							<div class="obj-share-items">
								<a href="https://www.addtoany.com/add_to/facebook?linkurl=${objURL}&amp;linkname=" target="_blank"><img src="https://static.addtoany.com/buttons/facebook.svg"></a>

								<a href="https://www.addtoany.com/add_to/whatsapp?linkurl=${objURL}&amp;linkname=" target="_blank"><img src="https://static.addtoany.com/buttons/whatsapp.svg"></a>
							</div>
						</div>
						${document.fullscreenEnabled
                    ? ` <button onclick="goBig(this)">
										<i class="material-icons">fullscreen</i>
									</button>`
                    : ``}
						
					</div>
				</div>
			`;
                let parent = obj.parentElement;
                if (parent) {
                    if (parent.classList.contains(`objeto`)) {
                        parent.insertAdjacentHTML(`afterbegin`, menuHtml);
                    }
                    else {
                        (_a = parent.parentElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(`afterbegin`, menuHtml);
                    }
                }
            });
    });
}
function toggleObjMenu(el) {
    var _a;
    (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.classList.toggle(`open`);
}
function avaliouObj(origin, code, score) {
    var _a;
    let objAvalia = (_a = origin.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    if (objAvalia) {
        objAvalia.classList.add(`avaliou`);
        window.setTimeout(() => {
            var _a, _b;
            (_b = (_a = objAvalia) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(objAvalia);
        }, 1500);
    }
    setCookie(`avaliou-${currentDisciplina}-${code}`, `true`);
    sendObjScore(code, score);
}
function sendObjScore(name, score) {
    ga("send", "event", {
        eventCategory: `Avaliação - Objeto`,
        eventAction: `${score} Estrelas`,
        eventLabel: name,
        eventValue: score,
    });
}
function showShareButtons(el) {
    var _a;
    (_a = el.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.add(`visible`);
    el.classList.add(`hidden`);
}
function goBig(el) {
    var _a, _b, _c;
    let wrapper = (_b = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
    if (wrapper) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            if (wrapper.classList.contains(`objeto`)) {
                wrapper.requestFullscreen();
            }
            else {
                (_c = wrapper.parentElement) === null || _c === void 0 ? void 0 : _c.requestFullscreen();
            }
        }
    }
}
function appendWebchat() {
    var _a;
    if (identificacao) {
        let decodedString = JSON.parse(atob(identificacao));
        let splitName = decodedString.nome.split(` `);
        let firstName = splitName.shift();
        let surName = splitName.join(` `);
        let webchatScript = document.createElement("script");
        (webchatScript.type = "text/javascript"),
            (webchatScript.async = !0),
            (webchatScript.src = "https://static.omni.chat/web-chat/web-chat.min.js"),
            (webchatScript.onload = function () {
                OmniChatWebChat.init({
                    retailerId: "x2THigtexm",
                    customer: {
                        externalId: decodedString.matricula,
                        name: firstName,
                        email: "",
                        lastName: surName,
                        phoneAreaCode: "",
                        phoneNumber: "",
                        phoneCountryCode: "",
                        customFields: [],
                    },
                });
            });
        let firstScript = document.getElementsByTagName("script")[0];
        (_a = firstScript.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(webchatScript, firstScript);
    }
    else {
        document.body.insertAdjacentHTML(`beforeend`, `
            <a href="https://api.whatsapp.com/send?phone=554733016100" target="_blank" class="zap">
                <img src="../img/whatsapp_v.svg" alt="">
            </a>        
        `);
    }
}
function redirectToTarget() {
    if (currentURL.searchParams.has(`item`)) {
        let pItem = currentURL.searchParams.get(`item`);
        let splitem = pItem.split(`.`);
        if (currentPage === "" || currentPage === "inicio.html") {
            let newPage = `unidade${splitem[0]}.html`;
            let splitPathname = currentURL.pathname.split(`/`);
            splitPathname[splitPathname.length - 1] = newPage;
            currentURL.pathname = splitPathname.join(`/`);
            window.location = currentURL;
        }
        else {
            if (splitem.length > 1) {
                let targetElement = document.querySelector(`[data-sumario="${pItem}"]`);
                if (targetElement) {
                    let scrollPosition = targetElement.getBoundingClientRect().top - 80;
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: "smooth",
                    });
                }
            }
        }
    }
}
function buildDocsLinks() {
    let docElements = document.querySelectorAll(`a[data-gdoc]`);
    if (docElements.length > 0) {
        if (identificacao && identificacao != ``) {
            let studentInfo = JSON.parse(atob(identificacao));
            docElements.forEach((docEl) => {
                let docCode = docEl.getAttribute(`data-gdoc`);
                docEl.href = `https://www.uniasselvi.com.br/extranet/o-2.0/relatorio2/gerenciador_modelo/impressao/impressao_modelo_documento_trilha.php?specialization=${studentInfo.matricula}&document=${docCode}&semester=${studentInfo.semestre}&subject=${studentInfo.disciplina}`;
            });
        }
        else {
            docElements.forEach((docEl) => {
                docEl.addEventListener(`click`, popGerador);
            });
        }
    }
}
function popGerador() {
    document.body.insertAdjacentHTML(`beforeend`, `
            <div
                class="popup-seminario visible"
                onclick="closeSeminarioWarning()"
            >
                <div class="balao" onclick="event.stopPropagation()">
                    <h3 style="font-weight:bold;margin-bottom: 2em">
                        Ops!
                    </h3>

                    <p>Não encontramos suas credenciais.</p>

                    <p>Para acessar os documentos de estágio, você precisa acessar sua trilha pelo AVA, dessa forma conseguimos certificar de que é você tentando acessar estas informações.</p>

                    <p><a href="https://ava2.uniasselvi.com.br"><b><u>Clique aqui</u></b></a> para ir ao AVA, selecione a disciplina, e clique em "Trilha de Aprendizagem".</p>
                    
                    <br>

                    <button onclick="closeSeminarioWarning()">Fechar</button>
                </div>
            </div>
            `);
}
function showPopper(element) {
    element.classList.add(`has-popper`);
    let elementPosition = element.getBoundingClientRect();
    let hint = element.querySelector(".hint");
    hint.setAttribute("data-show", "");
    hint.setAttribute(`data-placement`, elementPosition.top < 370 ? "bottom" : "top");
    let pageWidth = document.body.getBoundingClientRect().width;
    let hintXOffset = pageWidth - 280 - elementPosition.left - 48;
    if (hintXOffset < 0) {
        hint.style.transform = `translateX(${hintXOffset}px)`;
    }
}
function hidePopper(element) {
    if (document.activeElement != element) {
        element.classList.remove(`has-popper`);
        element.querySelector(".hint").removeAttribute("data-show");
        element.querySelector(".hint").removeAttribute("data-placement");
    }
}
const popperShowEvents = ["mouseenter", "focus"];
const popperHideEvents = ["mouseleave", "blur"];
function initPopperOn(element) {
    popperShowEvents.forEach((event) => {
        element.addEventListener(event, () => {
            showPopper(element);
        });
    });
    popperHideEvents.forEach((event) => {
        element.addEventListener(event, () => {
            hidePopper(element);
        });
    });
}
function initPops() {
    let capsulas = document.querySelectorAll(".capsula-pop");
    if (capsulas.length > 0) {
        capsulas.forEach((el) => __awaiter(this, void 0, void 0, function* () {
            let keywords = el.innerHTML.split(` `).join(`+`);
            let youtubeUrl = `https://www.youtube.com/results?search_query=${keywords}+aula`;
            let wikiResponse = yield fetch("https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&exchars=200&redirects=1&origin=*&titles=" +
                keywords);
            let wikiJson = yield wikiResponse.json();
            let wikiPages = wikiJson.query.pages;
            let explain = wikiPages[Object.keys(wikiPages)[0]].extract;
            let hint = `
				<div class="hint">
					<div class="hint-wrapper">
						${explain != undefined && explain != ``
                ? `<div class="hint-section">
										<span class="hint-title">Sobre este termo:</span>
										<p>${explain}</p>
									</div>`
                : ""}
						<span class="hint-materiais">Fontes externas:</span>
						<p>
							<a  href="https://pt.wikipedia.org/w/index.php?search=${keywords}"
								target="_blank">
									Ler mais na Wikipedia
									<i class="material-icons">open_in_new</i>
							</a>
						</p>
						
						<p>
							<a  href="${youtubeUrl}"
								target="_blank">Buscar no YouTube <i class="material-icons">smart_display</i></a>
						</p>
						<div id="arrow" data-popper-arrow></div>
					</div>
				</div>
			`;
            el.insertAdjacentHTML("beforeend", hint);
            initPopperOn(el);
        }));
    }
}
function buildMenu() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        let novoMenu = document.querySelector("#sidebar.second-revision");
        let menuFlutuante = document.querySelector(`#material-menu`);
        let sidebar = document.querySelector(`#sidebar`);
        if (!novoMenu) {
            let iconMap = {
                Início: "home",
                Apresentação: "ap",
                "Unidade 1": "1",
                "Etapa I": "1",
                "Unidade 2": "2",
                "Etapa II": "2",
                "Unidade 3": "3",
                "Etapa III": "3",
                "Etapa IV": "4",
                "Modelo Pandemia": "alt",
                "Modelo Presencial": "alt",
            };
            let existingLinks = [];
            (_a = sidebar) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`#main-menu-inicio, #main-menu-pandemia, #main-menu-presencial, #main-menu-apresentacao, #main-menu-etapa_i, #main-menu-u1, #main-menu-u2, #main-menu-u3`).forEach((el) => {
                var _a, _b;
                let redirectLink = (_a = el.getAttribute(`onclick`)) === null || _a === void 0 ? void 0 : _a.split(`'`);
                (_b = redirectLink) === null || _b === void 0 ? void 0 : _b.shift();
                existingLinks.push({
                    id: el.id,
                    nome: el.innerText.trim(),
                    href: redirectLink ? redirectLink[0] + `.html` : "",
                    selected: el.classList.contains(`selected`),
                });
            });
            let groupNav = `${existingLinks
                .map((item) => `<a id="${item.id}" class="sidebar-item ${item.selected ? "selected" : ""}" href="${item.href}">
			<img src="../img/ico/menu/${iconMap[item.nome]}.svg" alt="">
			<span>${item.nome}</span>
			${item.selected ? `<div class="sidebar-progress"></div>` : ""}
		</a>`)
                .join(`\n`)}`;
            let groupMateriais = ``;
            let materiais = [
                {
                    seletor: "#topbar-bio",
                    icone: "bio",
                    nome: "BioUniasselvi",
                    target: "_blank",
                },
                {
                    seletor: "#material-menu-livro-digital",
                    icone: "livro_digital",
                    nome: "Livro Digital",
                    target: "_blank",
                },
                {
                    seletor: "#material-menu-livro",
                    icone: "livro",
                    nome: "Livro em PDF",
                    target: "_blank",
                },
                {
                    seletor: "#material-menu-gabarito",
                    icone: "gabarito",
                    nome: "Gabarito",
                    target: "_blank",
                },
                {
                    seletor: "#material-menu-videos",
                    icone: "videos",
                    nome: "Vídeos",
                    target: "",
                },
                {
                    seletor: "#material-menu-objetos",
                    icone: "recursos",
                    nome: "Recursos Interativos",
                    target: "",
                },
            ];
            materiais.forEach((material) => {
                let element = document.querySelector(material.seletor);
                if (element) {
                    groupMateriais += `
				<a href="${element.href}" class="sidebar-item" target="${material.target}">
					<img src="../img/ico/menu/${material.icone}.svg">
					<span>${material.nome}</span>
				</a>
			`;
                }
            });
            if (sidebar)
                sidebar.innerHTML = `
			<div class="wrapper">
				<div class="sidebar-group">
					<div class="sidebar-title">Minha Trilha</div>
					${groupNav}
				</div>
				${groupMateriais.length > 0
                    ? `<div class="sidebar-group">
								<div class="sidebar-title">Meus Materiais</div>
								${groupMateriais}
							</div>`
                    : ""}
				<div class="sidebar-group access">
					<div class="sidebar-title">Acessibilidade</div>
				</div>
			</div>
		`;
            let acMenu = document.querySelector(`#accessibility-menu`);
            if (acMenu) {
                (_b = acMenu
                    .querySelector(`#accessibility-decrease`)) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML(`beforeend`, `Diminuir a fonte`);
                (_c = acMenu
                    .querySelector(`#accessibility-reset`)) === null || _c === void 0 ? void 0 : _c.insertAdjacentHTML(`beforeend`, `Redefinir a fonte`);
                (_d = acMenu
                    .querySelector(`#accessibility-increase`)) === null || _d === void 0 ? void 0 : _d.insertAdjacentHTML(`beforeend`, `Aumentar a fonte`);
                (_f = (_e = sidebar) === null || _e === void 0 ? void 0 : _e.querySelector(`.sidebar-group.access`)) === null || _f === void 0 ? void 0 : _f.appendChild(acMenu);
            }
        }
        else {
        }
    });
}
function initPage() {
    return __awaiter(this, void 0, void 0, function* () {
        redirectToTarget();
        loadAdditionalFonts();
        buildVideosPage();
        buildObjetosPage();
        yield identificaAcademico();
        yield buildMenu();
        hideMenuIfCookie();
        yield getSimuladoGrade();
        yield injectIndexTags();
        buildProgressBars();
        injectHotjar();
        tabify();
        appendAvaliacaoStars();
        appendObjetoMenu();
        buildDocsLinks();
        appendWebchat();
        initPops();
        seminarioAddIns();
    });
}
initPage();
window.addEventListener("scroll", updatePageLayoutOnScroll);
//# sourceMappingURL=main.js.map