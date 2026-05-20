function redirect(e, t = "") {
  window.location = e + ".html" + t;
}
function toggleAccess() {
  document.querySelector("#accessibility-menu").classList.toggle("active");
}
function decreaseFont() {
  fontSize > 10 &&
    ((fontSize -= 2), (document.body.style = `font-size: ${fontSize}px;`));
}
function increaseFont() {
  fontSize < 28 &&
    ((fontSize += 2), (document.body.style = `font-size: ${fontSize}px;`));
}
function resetFont() {
  (fontSize = 16), (document.body.style = "");
}
function loadVideo(e) {
  let t = e.parentElement;
  for (; !t.classList.contains("playlist"); ) t = t.parentElement;
  t.querySelector(".video-item.selected").classList.remove("selected"),
    e.classList.add("selected");
  let r = e.getAttribute("data-videoid");
  t.querySelector(
    ".video iframe"
  ).src = `https://www.youtube.com/embed/${r}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1`;
}
function selectVideo(e, t) {
  let r = e.target.parentElement.parentElement.querySelector("iframe"),
    a = r.getAttribute("data-current-state"),
    s = r.getAttribute("data-alt-url");
  if (t != a) {
    e.target.parentElement
      .querySelector(".selected")
      .classList.remove("selected"),
      e.target.classList.add("selected"),
      r.setAttribute("data-current-state", t);
    let a = r.getAttribute("src")
      ? r.getAttribute("src")
      : r.getAttribute("data-src");
    r.setAttribute("data-alt-url", a), (r.src = s);
  }
}
function respostaEx(e) {
  let t = e.target;
  for (; !t.classList.contains("um-item"); ) t = t.parentElement;
  let r = t.querySelector("input:checked");
  r &&
    (t.querySelector(".ex-enviar").classList.remove("visible"),
    "true" == r.value
      ? t.querySelector(".ex-fb-correto").classList.add("visible")
      : t.querySelector(".ex-fb-incorreto").classList.add("visible"),
    t.querySelectorAll("input").forEach((e) => {
      e.setAttribute("disabled", "true");
    }));
}
function navEx(e, t) {
  let r = e.target;
  for (; !r.classList.contains("carroussel"); ) r = r.parentElement;
  let a = r.getAttribute("data-selected");
  if (a != t) {
    r.querySelectorAll(".um-item").forEach((e) => {
      e.style.transform = `translateX(calc(${-100 * t}% - ${40 * t}px)) `;
    });
    let e = r.querySelectorAll(".carroussel-indicator i");
    (e[a].innerHTML = "radio_button_unchecked"),
      (e[t].innerHTML = "radio_button_checked"),
      r.setAttribute("data-selected", t);
  }
}
function navExPrev(e) {
  let t = e.target;
  for (; !t.classList.contains("carroussel"); ) t = t.parentElement;
  let r = t.getAttribute("data-selected");
  0 != r && navEx(e, r - 1);
}
function navExNext(e) {
  let t = e.target;
  for (; !t.classList.contains("carroussel"); ) t = t.parentElement;
  let r = parseInt(t.getAttribute("data-selected")),
    a = t.querySelectorAll(".um-item").length - 1;
  r < a && navEx(e, r + 1);
}
var menuVisible = !1,
  fontSize = 16;
let progressBarT;
if (document.querySelector(".topbar-progress"))
  progressBarT = new ProgressBar.Line(
    document.querySelector(".topbar-progress"),
    {
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
        autoStyleContainer: !1,
      },
      step: (e, t) => {
        let r = Math.round(100 * t.value());
        if (r > 0 && r < 97) {
          try {
            t.text.style.transform =
              "translateX(" + t.value() * window.innerWidth + "px)";
          } catch (e) {}
          t.setText(r + "%");
        } else t.setText("");
      },
    }
  );
window.onscroll = () => {
  let e = window.pageYOffset,
    t = document.body.scrollHeight - window.innerHeight;
  progressBarT?.animate((e / t).toFixed(2));
  try {
    if (e == t && window.matchMedia("screen and (max-width: 550px)").matches) {
      let e = document.querySelector("#material-menu");
      e.classList.contains("hidden") &&
        e.querySelector("#material-menu-toggle").classList.add("hidden");
    } else
      document
        .querySelector("#material-menu-toggle")
        .classList.remove("hidden");
  } catch (e) {}
};
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
loadAdditionalFonts();
//mensagem seminario
let currentURL = new URL(window.location.toString());
let currentPath = currentURL.pathname;
let currentPage = currentPath.split("/").pop();
let pathArray = currentPath.split(`/`);
let currentDisciplina = pathArray[pathArray.length - 2];
function isOnSemiList(string) {
  let semiList = [
    "LEF101",
    "LEF102",
    "SOC117",
    "LEF110",
    "LEF111",
    "LEF31",
    "SOC45",
    "LEF28",
    "EMP08",
    "LOD33",
    "EMP100",
    "19246",
    "17365",
    "LOD100",
    "19299",
    "19350",
    "ART102",
    "FIL105",
    "MAD109",
    "HID108",
    "MAD112",
    "QUI113",
    "FIL111",
    "SOC111",
    "FIL115",
    "MAD117",
    "16575",
    "LED118",
    "ART111",
    "ART112",
    "18543",
    "18538",
    "18533",
    "16794",
    "ART116",
    "LES127",
    "16805",
    "16810",
    "16799",
    "HID114",
    "ART33",
    "FIL51",
    "ENM02",
    "ENM05",
    "ECE113",
    "ECN113",
    "ENM03",
    "EEA115",
    "19261",
    "17475",
    "20180",
    "17586",
    "19251",
    "20157",
    "19437",
    "17531",
    "20264",
    "20201",
    "17383",
    "17388",
    "17398",
    "20212",
    "19407",
    "18559",
    "18555",
    "20191",
    "19293",
    "17351",
    "17480",
    "20172",
    "17374",
    "17375",
    "CPO08",
    "17471",
    "19274",
    "17553",
    "19321",
    "19338",
    "17592",
    "17558",
    "17360",
    "19347",
    "CPO104",
    "20164",
    "19377",
    "17435",
    "17408",
    "CPO04",
    "BIB111",
    "16570",
    "GED114",
    "19270",
    "MAD114",
    "FSA117",
    "PED24",
    "17477",
    "SES03",
    "HOS44",
    "APU101",
    "APU100",
    "HOS101",
    "APU07",
    "APU08",
    "17526",
    "LEF103",
    "LEF112",
    "LEF32",
    "TIP102",
    "EMD100",
    "CMA17",
    "GCO09",
    "ADG46",
    "ADG100",
    "CMA100",
    "HID109",
    "HID110",
    "LLI59",
    "ART105",
    "ART114",
    "ART42",
    "HOS42",
    "ECN03",
    "HOS46",
    "HOS103",
    "ECN111",
    "ECN118",
    "FPS01",
    "HOS28",
    "PED100",
    "LEF107",
    "PED68",
    "LES122",
    "LES125",
    "LES124",
    "19318",
    "ART107",
    "ART115",
    "ART43",
    "QUI111",
    "QUI117",
    "QUI119",
    "QUI114",
    "GFI101",
    "GFI100",
    "CTB33",
    "GFI19",
    "MOB103",
    "CTB101",
    "17499",
    "LIN19",
    "APU05",
    "GPU43",
    "CME11",
    "GPU44",
    "RHU28",
    "CME102",
    "GPU101",
    "RHU102",
    "APU103",
    "GPU100",
    "17403",
    "FPM02",
    "GED100",
    "SOC102",
    "LED102",
    "LED103",
    "QUI10",
    "QUI116",
    "SOC115",
    "ADG35",
    "ART44",
    "CME01",
    "CTB22",
    "GED31",
    "GTI13",
    "HID11",
    "LED33",
    "SOC23",
    "HID15",
    "ADG37",
    "GED25",
    "SOC100",
    "HID24",
    "HID29",
    "PED19",
    "ADS04",
    "CMA13",
    "CME06",
    "GFI15",
    "GPU31",
    "GPU40",
    "GTI20",
    "LOD24",
    "RHU18",
    "TIP02",
    "TEO37",
    "ADG44",
    "ADS08",
    "CTB45",
    "RHU25",
    "MOB09",
    "GPI04",
    "GFI21",
    "MOB10",
    "CTB48",
    "GFI22",
    "SEG73",
    "SEG68",
    "TEO51",
    "TEO100",
    "16517",
    "FPG02",
    "FPH02",
    "FPM04",
    "FPV02",
    "FSG02",
    "FSH02",
    "FSI02",
    "FSM05",
    "FSS02",
    "FSV02",
    "FPC02",
    "TIP03",
    "16443",
    "SEG101",
    "SEG102",
    "LIN103",
    "GTI27",
    "LES115",
    "LES123",
    "LES126",
    "GTI25",
    "ADS18",
    "LEE38",
    "LEE35",
    "LEE36",
    "LEE37",
    "LEE102",
    "LEE101",
    "LEE103",
    "LEE100",
    "BID106",
    "BID111",
    "CTB46",
    "ART104",
    "ART113",
    "16561",
    "ART36",
    "TIP06",
    "TIP04",
    "TIP101",
    "TIP10",
    "GAM33",
    "GAM39",
    "FIL100",
    "FIL114",
    "FIL48",
    "FIL50",
    "TEO45",
    "TEO09",
    "TEO06",
    "CGQ101",
    "SEG103",
    "16442",
    "ENG33",
    "GPI08",
    "ECE07",
    "ENG35",
    "ENG36",
    "ENG103",
    "GPI100",
    "ENG101",
    "GPI102",
    "LEE26",
    "LEE31",
    "PED101",
    "PED104",
    "PED94",
    "PED88",
    "FSA114",
    "LIN15",
    "LIN20",
    "ADS13",
    "GTI101",
    "CMA18",
    "CTB02",
    "CMA101",
    "GPI06",
    "GPI10",
    "GPI101",
    "LEF100",
    "LEF104",
    "LEF109",
    "LEF113",
    "LEF30",
    "ECN107",
    "ECN117",
    "17355",
    "GAM19",
    "GAM42",
    "CTB49",
    "LED105",
    "LED106",
    "LED117",
    "LED115",
    "LED116",
    "TEO49",
    "TEO50",
    "TEO08",
    "19493",
    "19494",
    "HID103",
    "HID111",
    "HID113",
    "HID31",
    "LBR105",
    "LBR109",
    "LBR113",
    "LBR122",
    "LBR121",
    "LBR120",
    "17411",
    "SES01",
    "LEE22",
    "HID112",
    "HID30",
    "PED62",
    "MOB101",
    "GAM23",
    "GAM28",
    "19403",
    "GAM100",
    "GAM03",
    "GFI20",
    "CTB47",
    "GFI102",
    "CTB100",
    "GSA108",
    "GSA104",
    "GSA09",
    "GTU20",
    "GTU21",
    "GTU102",
    "GTU101",
    "GED105",
    "GED115",
    "RHU26",
    "RHU27",
    "RHU101",
    "RHU100",
    "BID32",
    "BID33",
    "CGQ11",
    "EEA113",
    "SEG104",
    "CGQ102",
    "19381",
    "EMD27",
    "GCO10",
    "EMP10",
    "GCO11",
    "GCO01",
    "EMP102",
    "GCO07",
    "MAD113",
    "TIP05",
    "TIP100",
    "LBR09",
    "LBR118",
    "LBR12",
    "LBR123",
    "GAM101",
    "LED113",
    "LED114",
    "LLI44",
    "LLI62",
    "LLI102",
    "LLI101",
    "LLI105",
    "18551",
    "18546",
    "SEC08",
    "LOD32",
    "ECN102",
    "ECN116",
    "LOD01",
    "QUI115",
    "SOC108",
    "FIL108",
    "SOC119",
    "FIL52",
    "SOC48",
    "TEO75",
    "CPO01",
    "TEO101",
    "ENG34",
    "ENG102",
    "MAD115",
    "MAD116",
    "BID107",
    "BID109",
    "AGR22",
    "AGR23",
    "AGR25",
    "AGR101",
    "AGR103",
    "AGR102",
    "AGR24",
    "ECE03",
    "ECE102",
    "EEA01",
    "SOC118",
    "SOC47",
    "CPO101",
    "ADS22",
    "ADS102",
    "FSC02",
    "BID07",
    "BID108",
    "BID30",
    "BID31",
    "BID34",
    "AGR100",
    "FSM03",
    "LLI60",
    "LLI61",
    "LLI104",
    "LLI103",
    "APU03",
    "CME09",
    "APU06",
    "CME100",
    "LBR04",
    "LEE28",
    "LBR119",
    "PED102",
    "PED78",
    "HOS43",
    "CME10",
    "HOS100",
    "CME101",
    "LLI63",
    "LEF02",
    "LEF108",
    "LEF01",
    "LEF09",
    "BIB110",
    "LEE33",
    "PED98",
    "PED93",
    "ADS26",
    "GTI100",
    "ADS103",
    "ENG31",
    "ENM01",
    "ENG09",
    "GTI26",
    "LIN101",
    "LIN109",
    "LIN110",
    "LIN10",
    "GTI07",
    "PED71",
    "LEE24",
    "LEE34",
    "LEE07",
    "GPU42",
    "HOS45",
    "HOS102",
    "GPU03",
    "16800",
    "16791",
    "LIN102",
    "GTI28",
    "ADG48",
    "ADG50",
    "ADG102",
    "ADG101",
    "BIB112",
    "GED117",
    "GED113",
    "GED29",
    "ADS101",
    "ADS100",
    "CMA19",
    "GTU22",
    "LOD34",
    "LOD101",
    "CMA102",
    "GTU103",
    "FSA115",
    "FSA116",
    "19433",
    "EEA114",
    "CGQ100",
    "MOB102",
    "ENG100",
    "SOC116",
    "FIL49",
    "SOC44",
    "FSA112",
    "SEC05",
    "SEC01",
    "GED116",
    "GED28",
    "EMD21",
    "ADG52",
    "EMD101",
    "ADG103",
    "EMD22",
    "ADG54",
    "EMD102",
    "HOS23",
    "ADG41",
    "HOS41",
    "EMD26",
    "LOD31",
    "EMD15",
    "ENG29",
    "ENG30",
    "19956",
    "MOB100",
    "LEE29",
    "PED103",
    "17413",
    "PED83",
    "ART100",
    "16565",
    "ART29",
    "19289",
    "16786",
    "18531",
    "17467",
    "EMP09",
    "ECN08",
    "ECN115",
    "EMP101",
  ];
  for (let i = 0; i < semiList.length; i++) {
    if (string == semiList[i]) return true;
  }
  return false;
}
function seminarioPopup() {
  if (
    ((currentDisciplina === null || currentDisciplina === void 0
      ? void 0
      : currentDisciplina.includes(`seminario`)) ||
      (currentDisciplina === null || currentDisciplina === void 0
        ? void 0
        : currentDisciplina.includes(`pratica`))) &&
    currentPage == `apresentacao.html` &&
    isOnSemiList(currentDisciplina.split(`_`)[0])
  ) {
    document.body.insertAdjacentHTML(
      `beforeend`,
      `
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
            `
    );
    let texts = document.querySelectorAll(`.content-text`);
    texts[texts.length - 1].insertAdjacentHTML(
      `beforeend`,
      `
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
        `
    );
  }
}
function closeSeminarioWarning() {
  var _a;
  (_a = document.querySelector(`.popup-seminario`)) === null || _a === void 0
    ? void 0
    : _a.classList.remove(`visible`);
}
seminarioPopup();
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
    (_a = firstScript.parentNode) === null || _a === void 0
      ? void 0
      : _a.insertBefore(webchatScript, firstScript);
  } else {
    document.body.insertAdjacentHTML(
      `beforeend`,
      `
            <a href="https://api.whatsapp.com/send?phone=554733016100" target="_blank" class="zap">
                <img src="../img/whatsapp_v.svg" alt="">
            </a>        
        `
    );
  }
}

("use strict");
// adiciona um video ao final das trilhas do enade
function appendVideoEnade() {
  if (
    (currentDisciplina === null || currentDisciplina === void 0
      ? void 0
      : currentDisciplina.includes(`ENADE`)) ||
    (currentDisciplina === null || currentDisciplina === void 0
      ? void 0
      : currentDisciplina.includes(`enade`))
  ) {
    let cttsInThisPage = document.querySelectorAll(`.enade-news`);
    cttsInThisPage[cttsInThisPage.length - 1].insertAdjacentHTML(
      `beforeend`,
      `

                <div class="video">
                    <div class="video-large">
                        <iframe class="lazyload" title="Vídeo da Disciplina" width="1280" height="720"
                            data-src="https://www.youtube.com/embed/ap8HUuVQn_I?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1"
                            allowfullscreen="true">
                        </iframe>
                    </div>
                </div>

            <div class="video">
                <div class="video-large">
                    <iframe class="lazyload" title="Vídeo da Disciplina" width="1280" height="720"
                        data-src="https://www.youtube.com/embed/LZP3ZGcsSFY?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1"
                        allowfullscreen="true">
                    </iframe>
                </div>
            </div>

            <div style="background-color: #fff29d;
            border-radius: 10px;
            padding: 5px 15px;
            margin: 35px 0 0 0;
            box-shadow: 0px 4px 4px rgb(0 0 0 / 15%);
            ">

                <p>O que achou dos conteúdos abordados nos vídeos do Enade News? Acesse a <b>
                        pesquisa de
                        satisfação
                    </b> e
                    compartilhe a sua opnião através do link abaixo:</p>

                <p><a href="https://forms.office.com/r/Bz0zctBMSP" class="humanas" target="_blank">Pesquisa
                        de Satisfação - Enade News</a></p>

            </div>
           
            `
    );
  }
}
function criaVlibrasNode() {
  const DOM = `
        <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
        </div>
    `;
  document.body.insertAdjacentHTML("beforeend", DOM);
}

function importaScriptVlibras() {
  let script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.onload = () => {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  };
  document.head.appendChild(script);
}

criaVlibrasNode();
importaScriptVlibras();
appendVideoEnade();
appendWebchat();
