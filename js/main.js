"use strict";
let savedSize = getStorage(`font-size`);
let trilhaFontSize = savedSize ? savedSize : `16`;
let progressBar;
let progressBarT;
let currentURL = new URL(window.location.toString());
let currentPath = currentURL.pathname;
let currentPage = currentPath.split("/").pop();
let pathArray = currentPath.split(`/`);
let currentDisciplina = pathArray[pathArray.length - 2];
let isAvaliou = getStorage("avaliou" + currentPath.split("/")[1]);
let seenPopupChegouLivro = getStorage(
  "popupLivroD" + currentPath.split("/")[1]
);
let seenPopupFaltaLivro = getStorage(
  "popupLivroD-faltando" + currentPath.split("/")[1]
);
let identificacao = getStorage(`id-${currentDisciplina}`);
let studentObj;
let currentSemester;
let sumario;
let desempenho;
let nAnswers = {};
let checkSet;
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
  if (a != `index`) window.location.href = a + ".html";
}
function toggleAccess() {
  document.querySelector("#accessibility-menu")?.classList.toggle("active");
}
function decreaseFont() {
  let size = parseInt(trilhaFontSize);
  if (size > 10) {
    size -= 2;
    document.body.style.fontSize = `${size}px`;
    trilhaFontSize = size.toString();
    setStorage(`font-size`, size);
  }
}
function increaseFont() {
  let size = parseInt(trilhaFontSize);
  if (size < 28) {
    size += 2;
    document.body.style.fontSize = `${size}px`;
    trilhaFontSize = size.toString();
    setStorage(`font-size`, size);
  }
}
function resetFont() {
  trilhaFontSize = `16`;
  document.body.style.fontSize = "";
  setStorage(`font-size`, trilhaFontSize);
}
function respostaEx(event) {
  let exParent = event.target;
  while (!exParent.classList.contains("um-item")) {
    exParent = exParent.parentElement;
  }
  let resp = exParent.querySelector("input:checked");
  if (resp) {
    const correct = resp.value == "true";
    let inputIndex = 0;
    exParent.querySelector(".ex-enviar").classList.remove("visible");
    if (correct) {
      exParent.querySelector(".ex-fb-correto").classList.add("visible");
    } else {
      exParent.querySelector(".ex-fb-incorreto").classList.add("visible");
    }
    exParent.querySelectorAll("input").forEach((el) => {
      el.setAttribute("disabled", "true");
      if (el.checked) {
        nAnswers[exParent.id] = {
          i: inputIndex,
          c: correct,
        };
        setStorage(`at-${currentDisciplina}`, JSON.stringify(nAnswers));
      }
      inputIndex++;
    });
  }
}

function addActiveToFirstRadioButton() {
  const carroussels = document.querySelectorAll(".carroussel");

  carroussels.forEach((carroussel) => {
    const firstRadioButton = carroussel.querySelector(
      ".carroussel-indicator i"
    );

    firstRadioButton.classList.add("__active");
  });
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
      } else if (i == index) {
        translateXVal = `0`;
      }
      items[i].style.transform = `translateX(${translateXVal})`;
    }
    let i = exsParent.querySelectorAll(".carroussel-indicator i");

    i[selected].innerHTML = "radio_button_unchecked";
    i[selected].classList.toggle("__active");
    i[index].innerHTML = "radio_button_checked";
    i[index].classList.toggle("__active");
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
      setStorage("side-menu-visibility", "visible");
    } else {
      setStorage("side-menu-visibility", "hidden");
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
    ?.classList.remove("selected");
  e.classList.add("selected");
  if (e.classList.contains("watched")) {
    parentPlaylist.querySelector(`.watched-toggle`)?.classList.add(`true`);
    parentPlaylist.querySelector(`.watched-toggle`)?.classList.remove(`false`);
  } else {
    parentPlaylist.querySelector(`.watched-toggle`)?.classList.add(`false`);
    parentPlaylist.querySelector(`.watched-toggle`)?.classList.remove(`true`);
  }
  let videoURL = e.getAttribute("data-videoid");
  parentPlaylist.querySelector(
    ".video iframe"
  ).src = `https://www.youtube.com/embed/${videoURL}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1`;
  updateVideoTitle(parentPlaylist, videoURL);
}
function loadPreviousVideo(from) {
  let parentPlaylist = from.parentElement;
  while (!parentPlaylist.classList.contains("playlist")) {
    parentPlaylist = parentPlaylist.parentElement;
  }
  let selectedItem = parentPlaylist.querySelector(`.video-item.selected`);
  let allVideoItems = parentPlaylist.querySelectorAll(`.video-item`);
  let indexOfSelected = -1;
  allVideoItems.forEach((item, index) => {
    if (item == selectedItem) {
      indexOfSelected = index;
    }
  });
  if (indexOfSelected > 0) {
    selectedItem?.classList.remove(`selected`);
    loadVideo(allVideoItems.item(indexOfSelected - 1));
  }
}
function loadNextVideo(from) {
  let parentPlaylist = from.parentElement;
  while (!parentPlaylist.classList.contains("playlist")) {
    parentPlaylist = parentPlaylist.parentElement;
  }
  let selectedItem = parentPlaylist.querySelector(`.video-item.selected`);
  let allVideoItems = parentPlaylist.querySelectorAll(`.video-item`);
  let indexOfSelected = -1;
  allVideoItems.forEach((item, index) => {
    if (item == selectedItem) {
      indexOfSelected = index;
    }
  });
  if (indexOfSelected < allVideoItems.length - 1) {
    selectedItem?.classList.remove(`selected`);
    loadVideo(allVideoItems.item(indexOfSelected + 1));
  }
}
function toggleWatchedState(el) {
  let parentPlaylist = el.parentElement;
  while (!parentPlaylist.classList.contains("playlist")) {
    parentPlaylist = parentPlaylist.parentElement;
  }
  let isNowWatched = el.classList.toggle(`true`);
  let selectedVideoItem = parentPlaylist.querySelector(`.video-item.selected`);
  let whichID = selectedVideoItem.getAttribute(`data-videoid`);
  if (isNowWatched) {
    checkSet.add(whichID);
    selectedVideoItem.classList.add(`watched`);
  } else {
    checkSet.delete(whichID);
    selectedVideoItem.classList.remove(`watched`);
  }
  saveCheckSet();
}
function toggleWatchedFilter(el) {
  let parentPlaylist = el.parentElement;
  while (!parentPlaylist.classList.contains("playlist")) {
    parentPlaylist = parentPlaylist.parentElement;
  }
  parentPlaylist.classList.toggle(`filtered`);
}
async function updateVideoTitle(playlist, videoID) {
  let response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoID}`
  );
  let oembedJson = await response.json();
  playlist.querySelector(`.video-title h2`).innerHTML = oembedJson.title;
}
function sctop() {
  document.documentElement.scrollTop = 0;
}
function toggleMaterial() {
  let el = document.querySelector("#material-menu");
  if (el && el.classList.toggle("hidden")) {
    setStorage("side-menu-visibility", "hidden");
  } else {
    setStorage("side-menu-visibility", "visible");
  }
}
function toggleLinkStatus(event, from) {
  event.preventDefault();
  let parent = from.parentElement;
  let spanHash = md5(parent.querySelector(`span`).innerHTML);
  if (parent.hasAttribute(`data-viewed`)) {
    parent.removeAttribute(`data-viewed`);
    checkSet.delete(spanHash);
  } else {
    parent.setAttribute(`data-viewed`, ``);
    checkSet.add(spanHash);
  }
  saveCheckSet();
}
document.body.style.fontSize = savedSize + `px`;

function buildProgressBars() {
  const progressBarColor = "#EEAD2D";

  if (document.querySelector(".sidebar-progress"))
    progressBar = new ProgressBar.Line(
      document.querySelector(".sidebar-progress"),
      {
        strokeWidth: 6,
        easing: "easeInOut",
        duration: 800,
        color: progressBarColor,
        trailWidth: 6,
      }
    );
  if (document.querySelector(".topbar-progress"))
    progressBarT = new ProgressBar.Line(
      document.querySelector(".topbar-progress"),
      {
        strokeWidth: 6,
        easing: "easeInOut",
        duration: 800,
        color: progressBarColor,
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
            } catch (e) {}
            bar.setText(perc + "%");
          } else {
            bar.setText("");
          }
        },
      }
    );
}

function updatePageLayoutOnScroll() {
  let yOffset = window.scrollY;
  let totalY = document.body.scrollHeight - window.innerHeight;
  progressBar?.animate((yOffset / totalY).toFixed(2));
  progressBarT?.animate((yOffset / totalY).toFixed(2));

  if (
    yOffset == totalY &&
    window.matchMedia("screen and (max-width: 550px)").matches
  ) {
    let mMenu = document.querySelector("#material-menu");
    if (mMenu && mMenu.classList.contains("hidden")) {
      mMenu.querySelector("#material-menu-toggle")?.classList.add("hidden");
    }
  } else {
    try {
      document
        .querySelector("#material-menu-toggle")
        ?.classList.remove("hidden");
    } catch (e) {}
  }
}

function setStorage(cname, cvalue) {
  window.localStorage.setItem(cname, cvalue);
}
function getStorage(cname) {
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
  setStorage("avaliou" + currentPath.split("/")[1], true);
}
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
    "115256",
    "CPO104",
    "LED114",
  ];
  for (let i = 0; i < semiList.length; i++) {
    if (string == semiList[i]) return true;
  }
  return false;
}
async function isSeminarioEmQueNaoVaiTemplate(string) {
  let exlusionListReq = await fetch("../js/templates_seminarios.json");
  let exclusionListData = await exlusionListReq.json();
  let exclusionList = exclusionListData.sem_template;
  for (let i = 0; i < exclusionList.length; i++) {
    if (string == exclusionList[i]) return true;
  }
  return false;
}
// async function seminarioAddIns() {
//     if (
//         (currentDisciplina?.includes(`seminario`) ||
//             currentDisciplina?.includes(`pratica`)) &&
//         isOnSemiList(currentDisciplina.split(`_`)[0])
//     ) {
//         if (currentPage == `apresentacao.html`) {
//             document.body.insertAdjacentHTML(
//                 `beforeend`,
//                 `
//             <div
//                 class="popup-seminario visible"
//                 onclick="closeSeminarioWarning()"
//             >
//                 <div class="balao" onclick="event.stopPropagation()">
//                     <h3 style="font-weight:bold;margin-bottom: 2em">
//                         Comunicado para disciplinas de Seminário
//                         Interdiscipinar, Seminário da Prática e Prática
//                         Interdisciplinar
//                     </h3>

//                     <p>
//                         Buscando oferecer ainda mais qualidade em sua graduação
//                         EAD, o modelo de oferta 100% Flex foi alterado para Flex
//                         Curso. <u>Mas, o que isso muda?</u> Agora você consegue
//                         interagir com colegas que estão no mesmo curso e o tutor
//                         também será exclusivo para o curso de vocês,
//                         proporcionando um maior domínio de conhecimento. Desta
//                         forma, a Uniasselvi designa que <b>a realização da pesquisa
//                             e a escrita do paper deve ser realizada em grupo de 3 a
//                             5 acadêmicos</b>. Este encaminhamento tem amparo nos pilares
//                         da Educação da UNESCO que permeiam o projeto pedagógico
//                         de todos os cursos:
//                     </p>
//                     <ul>
//                         <li>
//                             <u>Aprender a aprender</u> - A pesquisa que resulta na
//                             escrita do paper colabora muito no desenvolvimento
//                             de competências pessoais para que a aprendizagem
//                             aconteça ao longo de toda a vida.
//                         </li>
//                         <li>
//                             <u>Aprender a fazer</u> – A relação da teoria com a prática
//                             que ocorre durante a pesquisa e a escrita do paper,
//                             desenvolve competências que proporcionam a
//                             capacidade de aplicar a teoria(ciência) às situações
//                             do dia-a-dia do acadêmico durante toda a sua vida.
//                             Ou seja, é a teoria contribuindo para elucidar a
//                             prática consolidando uma prática transformadora.
//                         </li>
//                         <li>
//                             <u>Aprender a ser</u> – O nível mais aprofundado de
//                             compreensão de um conteúdo é o “julgamento”, segundo
//                             Zaballa (1998). Ou seja, a aprendizagem efetiva
//                             promove no acadêmico a capacidade da argumentação e
//                             do posicionamento frente às situações do dia-a-dia.
//                         </li>
//                         <li>
//                             <u>Aprender a conviver</u> – O relacionamento interpessoal
//                             é essencial para vivermos em comunidade e,
//                             especialmente, no campo profissional, é a
//                             competência mais observada nos processos seletivos e
//                             na fidelização do colaborador em uma empresa. É
//                             preciso aprender a pensar e a trabalhar em grupo. É
//                             preciso aprender a lidar com as diferenças de
//                             posicionamentos, de saberes e de culturas.
//                         </li>
//                     </ul>
//                     <p style="padding: 16px; box-shadow: 0 0 0 2px #eee;border-radius:10px;margin:2em 0">
//                         É com este fundamento educacional que a Uniasselvi
//                         define que todas as atividades das disciplinas de
//                         Seminário Interdisciplinar, Prática Interdisciplinar e
//                         Seminário da prática sejam realizadas em grupos de 3 a 5
//                         integrantes.
//                     </p>
//                     <p>
//                         Quanto a socialização também deverá ser realizada em
//                         grupo no encontro, ao final do semestre, de acordo com
//                         as orientações do seu tutor externo.
//                     </p>
//                     <p>
//                         Por fim, tendo como pano de fundo os pilares acima
//                         reafirmamos para você acadêmico que a oportunidade de
//                         realizar um trabalho em equipe requer pensar juntos onde
//                         cada integrante apresenta os argumentos (convence ou é
//                         convencido) e juntos tomam decisões consensuais.
//                         Trabalho em grupo não é distribuição de tarefas e sim
//                         socialização de aprendizagem.
//                     </p>
//                     <p>
//                         Destacamos que as trilhas de aprendizagem estão sendo
//                         atualizadas de acordo com esta métrica de grupos, sendo
//                         que a orientação sobre a formação de grupos é esta
//                         apresentada neste comunicado.
//                     </p>

//                     <p>Atenciosamente, Uniasselvi</p>

//                     <button onclick="closeSeminarioWarning()">Fechar</button>
//                 </div>
//             </div>
//             `
//             );
//             if (
//                 currentDisciplina.indexOf(`QUI114`) < 0 &&
//                 currentDisciplina.indexOf(`QUI116`) < 0 &&
//                 currentDisciplina.indexOf(`LEE07`) < 0 &&
//                 currentDisciplina.indexOf(`LEE34`) < 0 &&
//                 currentDisciplina.indexOf(`LEE35`) < 0 &&
//                 currentDisciplina.indexOf(`LEE36`) < 0 &&
//                 currentDisciplina.indexOf(`LEE37`) < 0 &&
//                 currentDisciplina.indexOf(`LEE38`) < 0 &&
//                 currentDisciplina.indexOf(`LEE100`) < 0 &&
//                 currentDisciplina.indexOf(`LEE101`) < 0 &&
//                 currentDisciplina.indexOf(`LEE102`) < 0 &&
//                 currentDisciplina.indexOf(`LED114`) < 0 &&
//                 currentDisciplina.indexOf(`LEE103`) < 0
//             ) {
//                 let texts = document.querySelectorAll(`.content-text`);
//                 texts[texts.length - 1].insertAdjacentHTML(
//                     `beforeend`,
//                     `
//             <div class="dica-leitura">
//                 <img
//                     src="../img/ico/modelo_outline.svg"
//                     alt="Dica de Leitura"
//                 />
//                 <p>
//                     Buscando apoiar nossos alunos no momento da
//                     realização de seu paper em equipe,
//                     elaboramos este manual com orientações para
//                     utilização do TEAMS, como a ferramenta que
//                     permite a realização de encontro virtual
//                     para discussão, elaboração e
//                     compartilhamento de seu trabalho. Aproveite
//                     as dicas!
//                 </p>
//                 <a
//                     class="content-link flex-c"
//                     href="https://trilhaaprendizagem.uniasselvi.com.br/docs/manual_teams.pdf"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Manual do Teams para trabalho em
//                         equipe</span
//                     >
//                 </a>
//             </div>
//         `
//                 );
//             }
//         } else if (
//             currentPage == `unidade3.html` &&
//             !(await isSeminarioEmQueNaoVaiTemplate(
//                 currentDisciplina.split(`_`)[0]
//             ))
//         ) {
//             let texts = document.querySelectorAll(`.content-text`);
//             texts[texts.length - 1].insertAdjacentHTML(
//                 `beforeend`,
//                 `
//             <div class="dica-leitura">
//                 <img
//                     src="../img/ico/modelo_outline.svg"
//                     alt="Templates"
//                 />
//                 <p>
//                     Buscando apoiar nossos alunos no momento da
//                     socialização,
//                     elaboramos alguns templates para que você possa utilizar!
//                 </p>

//                 <p>Acesse a seguir o template referente ao módulo desta disciplina.</p>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_II.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo II</span
//                     >
//                 </a>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_III.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo III</span
//                     >
//                 </a>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_IV.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo IV</span
//                     >
//                 </a>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_V.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo V</span
//                     >
//                 </a>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_VI.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo VI</span
//                     >
//                 </a>
//                 <a
//                     class="content-link flex-c"
//                     href="../docs/templates/socializacao/Templates_Socialização_Seminario_modulo_VII_demais.pptx"
//                     target="_blank"
//                 >
//                     <i class="material-icons">description</i>
//                     <span
//                         >Templates de Socialização - Modulo VII e demais</span
//                     >
//                 </a>

//             </div>
//         `
//             );
//         }
//     }
// }
function closeSeminarioWarning() {
  document.querySelector(`.popup-seminario`)?.classList.remove(`visible`);
}
function tabify() {
  document
    .querySelectorAll(
      ".top-unidade, .subheader, .header, .button-next, .accessibility-item, .rex"
    )
    .forEach((el) => {
      el.setAttribute("tabindex", "0");
    });
}
function hideMenuIfCookie() {
  let status = getStorage("side-menu-visibility");
  if (status === "visible" || (status === null && window.innerWidth >= 1100)) {
    let sidebar = document.querySelector("#sidebar");
    if (sidebar) {
      document.querySelector("#sidebar")?.classList.add("no-animation");
      document.querySelector("#sidebar")?.classList.add("show");
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
async function getSimuladoGrade() {
  let requestBody;
  let unidade = currentPage?.substr(7, 1);
  if (unidade != `1` && unidade != `2` && unidade != `3`) return;
  let idString = getStorage(`id-${currentDisciplina}`);
  if (!idString) return;
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
    response = await fetch(
      `https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index`,
      {
        method: `post`,
        headers: JSON.parse(
          eh[1] +
            eh[10] +
            eh[2] +
            eh[3] +
            eh[4] +
            eh[5] +
            eh[7] +
            eh[0] +
            eh[8] +
            eh[9] +
            eh[6] +
            eh[11]
        ),
        body: JSON.stringify(requestBody),
      }
    );
  } catch (err) {
    console.log(`could not get grades`);
  }
  if (response && response.ok) {
    let data = await response.json();
    let morphedJson = {};
    try {
      data.resultado.map(
        (item) => (morphedJson[item.index] = item.porcentagem)
      );
      desempenho = morphedJson;
    } catch (err) {}
    let header = document.querySelector(`.header`);
    if (desempenho && desempenho[unidade] != `-`) {
      header &&
        header.insertAdjacentHTML(
          `afterend`,
          `
					<div class="has-grade">
						<div class="grade" >
							<i class="material-icons">assessment</i>
							<span>Seu desempenho nesta unidade foi</span>
							<div class="grade-bar"></div>
						</div>
					</div>
					`
        );
      let gradeBar = new ProgressBar.Circle(
        document.querySelector(".grade-bar"),
        {
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
            } else {
              circle.setText(value + `%`);
            }
          },
        }
      );
      gradeBar.text.style.fontSize = ".7em";
      gradeBar.animate(parseInt(desempenho[unidade]) / 100);
    } else {
    }
  }
}
async function identificaAcademico() {
  let changedIDs = false;
  if (currentURL.searchParams.has(`param`)) {
    let avaParameter = currentURL.searchParams.get(`param`) ?? ``;
    let decodedParam = atob(decodeURI(avaParameter).replace(/\s/g, "+"));
    try {
      identificacao = btoa(decodeURIComponent(escape(decodedParam)));
    } catch (e) {
      identificacao = btoa(decodedParam);
    }
    if (getStorage(`id-${currentDisciplina}`) != identificacao) {
      changedIDs = true;
    }
    setStorage(`id-${currentDisciplina}`, identificacao);
  } else {
    identificacao = getStorage(`id-${currentDisciplina}`);
  }
  if (identificacao) {
    let livroElement = document.querySelector(`#material-menu-livro-digital`);
    if (livroElement) {
      let newHref = (livroElement.href += `&param=${identificacao}`);
      livroElement.setAttribute(`href`, newHref);
    }
    studentObj = JSON.parse(atob(identificacao));
    let primeiroNome = studentObj.nome.substr(0, studentObj.nome.indexOf(" "));
    studentObj.primeiroNome = primeiroNome;
    let header;
    if (currentPage == `` || currentPage == `inicio.html`) {
      header = document.querySelector(`.header`);
      if (header) {
        header.innerHTML = `${primeiroNome}, bem-vindo(a)`;
        header.style.letterSpacing = `.4px`;
      }
    } else if (currentPage == `apresentacao.html`) {
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
    let semesterCookie = getStorage(`id-${currentDisciplina}-semester`);
    if (semesterCookie && semesterCookie != `undefined` && !changedIDs) {
      currentSemester = semesterCookie;
    } else {
      let requestBody = {
        disciplina: studentObj.disciplina,
        aluno: studentObj.matricula,
        turma: studentObj.turma,
        tipo: `2`,
      };
      let r;
      let studentInfo;
      try {
        r = await fetch(
          `https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index`,
          {
            method: `post`,
            headers: JSON.parse(
              eh[1] +
                eh[10] +
                eh[2] +
                eh[3] +
                eh[4] +
                eh[5] +
                eh[7] +
                eh[0] +
                eh[8] +
                eh[9] +
                eh[6] +
                eh[11]
            ),
            body: JSON.stringify(requestBody),
          }
        );
        studentInfo = await r.json();
      } catch (error) {
        console.log(`could not get student info`);
      }
      if (studentInfo) {
        setStorage(
          `id-${currentDisciplina}-semester`,
          studentInfo.resultado[0].semestre
        );
        currentSemester = studentInfo.resultado[0].semestre;
      }
    }
  }
}
async function getSumario() {
  const eh = [
    `thor`,
    `{`,
    `-Request-Method\"`,
    `: \"application/json\",`,
    `c3VwZXJ1c2Vy"`,
    `: \"post\",`,
    `\"Content-Type\"`,
    `\"Au`,
    `sic YWRta`,
    `\"Access-Control`,
    `ization\":\"Ba`,
    `}`,
    `W46`,
  ];
  let requestBody = {
    disciplina: currentDisciplina.split(`_`)[0],
    tipo: "2",
    index: [currentPage?.substr(7, 1)],
  };
  let res;
  let j;
  try {
    res = await fetch(
      `https://api.uniasselvi.com.br/evolucao-disciplina/busca-valor-index-descricao`,
      {
        method: `post`,
        headers: JSON.parse(
          eh[1] +
            eh[9] +
            eh[2] +
            eh[5] +
            eh[6] +
            eh[3] +
            eh[7] +
            eh[0] +
            eh[10] +
            eh[8] +
            eh[12] +
            eh[4] +
            eh[11]
        ),
        body: JSON.stringify(requestBody),
      }
    );
    j = await res.json();
  } catch (error) {
    console.log(`could not get sumario`);
  }
  if (j && j.hasOwnProperty(`resultado`)) {
    let morphedJson = {};
    j.resultado.map((item) => (morphedJson[item.index] = item.descricao));
    return morphedJson;
  }
}
async function injectIndexTags() {
  let tagged = document.querySelectorAll(`*[data-sumario]`);
  if (tagged.length > 0) {
    sumario = await getSumario();
    let processedIndexes = new Set();
    tagged.forEach((el) => {
      let tagIndex = el.getAttribute(`data-sumario`);
      if (
        tagIndex &&
        sumario &&
        sumario[tagIndex] &&
        !processedIndexes.has(tagIndex)
      ) {
        let sumWrapper = document.createElement(`div`);
        sumWrapper.classList.add(`sumario-wrapper`);
        let strokeColor = `#81c784`;
        if (desempenho && desempenho[tagIndex] && desempenho[tagIndex] != `-`) {
          if (desempenho[tagIndex] < 90) {
            if (desempenho[tagIndex] < 80) {
              if (desempenho[tagIndex] < 70) {
                strokeColor = "#e57373";
              } else {
                strokeColor = "#ffb74d";
              }
            } else {
              strokeColor = "#64b5f6";
            }
          }
        }
        let livroAnchorElement = document.querySelector(`#material-menu-livro`);
        let codigoMaterial;
        if (livroAnchorElement)
          codigoMaterial = new URL(livroAnchorElement.href).searchParams.get(
            `codigo`
          );
        let nUnidade = currentPage?.substr(7, 1);
        let titleString = `Unidade ${nUnidade}`;
        let brokenTag = tagIndex.split(`.`);
        if (brokenTag.length > 1) {
          titleString += ` - Tópico ${brokenTag[1]}`;
        }
        let centralButton = `
					<div class="link-livro">
						<a href="https://trilhaaprendizagem.uniasselvi.com.br/central/?codigo=${codigoMaterial}&item=${tagIndex}${
          identificacao ? `&param=${identificacao}` : ``
        }">
							<span>Ver mais</span>
							<i class="material-icons">chevron_right</i>
						</a>
					</div>
				`;
        sumWrapper.innerHTML = `
					<div class="sumario-indicador" tabindex="0">
						${
              desempenho &&
              desempenho[tagIndex] &&
              desempenho[tagIndex] != `-` &&
              desempenho[tagIndex] > 0
                ? `
						<div class="item-desempenho" title="Seu desempenho neste assunto">
							<svg>
								<circle class="track" cx=16 cy=16 r=12></circle>
								<circle class="runner" cx=16 cy=16 r=12 style="stroke-dashoffset: ${
                  (1 - desempenho[tagIndex] / 100) * 12 * 2 * Math.PI
                }; stroke: ${strokeColor}"></circle>
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
								`
            }				

						<div class="sumario-texto">
							<div class="sumario-titulo">
								<span>${titleString}</span>
							</div>
								 
							<div class="sumario-nome">
								<span>${removeSumarioItemPrefixes(sumario[tagIndex])}</span>
							</div>

							${centralButton}
							 <!-- <a>Responder Questões</a>-->
						</div>
					</div>
				`;
        if (el.classList.contains(`objeto`) || el.classList.contains(`video`)) {
          el.insertAdjacentElement(`afterbegin`, sumWrapper);
        } else {
          el.insertAdjacentElement(`afterend`, sumWrapper);
          sumWrapper.appendChild(el);
        }
        processedIndexes.add(tagIndex);
      }
    });
  }
}
async function buildVideosPage() {
  if (currentPage === `videos.html` || currentPage === `videos_e.html`) {
    cleanupOldLayout();
    let pages = await fetchContentPages(currentPage === "videos_e.html");
    let videos = await extractVideoIDsFromHTML(pages);
    appendVideosToPage(videos);
  }
}
async function buildObjetosPage() {
  if (currentPage === `objetos.html` || currentPage === `objetos_e.html`) {
    cleanupOldLayout();
    let pages = await fetchContentPages(currentPage === "objetos_e.html");
    let objetos = await extractObjetosFromHTML(pages);
    appendObjetosToPage(objetos);
  }
}
function cleanupOldLayout() {
  if (currentPage === "videos.html" || currentPage === `videos_e.html`) {
    let playlistCss = document.createElement("link");
    playlistCss.rel = "stylesheet";
    playlistCss.href = "../css/playlist.min.css";
    document.head.insertAdjacentElement(`beforeend`, playlistCss);
    document.querySelector(`.content-page`)?.classList.add(`content-videos`);
  } else if (
    currentPage === `objetos.html` ||
    currentPage === `objetos_e.html`
  ) {
    document.querySelector(`.content-page`)?.classList.add(`content-objetos`);
  }
  let headerG = document.querySelector(`.header-gradient`);
  headerG?.parentElement?.removeChild(headerG);
  let nomeDisciplina = document.querySelector(`.subheader`);
  if (nomeDisciplina)
    document.querySelector(`.title-big`)?.appendChild(nomeDisciplina);
  let contentSection = document.querySelector(".content-section");
  if (contentSection) {
    contentSection.style.marginTop = "";
  }
  let cText = document.querySelector(".content-section .content-text");
  if (cText) cText.innerHTML = ``;
  document.querySelectorAll(`.content-wide`)?.forEach((cWide) => {
    cWide.parentElement?.removeChild(cWide);
  });
}
async function fetchContentPages(isEstagio = false) {
  let pagePromises = [];
  let prefix = currentURL
    .toString()
    .substring(0, currentURL.toString().lastIndexOf(`/`));
  let pageNames = isEstagio
    ? ["modelo_pandemia", "etapa_i", "etapa_ii", "etapa_iii", "etapa_iv"]
    : ["apresentacao", "unidade1", "unidade2", "unidade3"];
  for (let i = 0; i < pageNames.length; i++) {
    pagePromises.push(
      fetch(`${prefix}/${pageNames[i]}.html`).then((response) => {
        return response.text();
      })
    );
  }
  return Promise.all(pagePromises);
}
async function extractVideoIDsFromHTML(pages) {
  let videos = [];
  pages.forEach((aPage, pageIndex) => {
    let doc = new DOMParser().parseFromString(aPage, "text/html");
    let thisPage = {
      page: doc.title.split(`-`)[0],
      videos: { vimeo: [], youtube: [], thinglink: [] },
    };
    let embedURL, videoID;
    doc
      .querySelectorAll(`.content-section .video iframe, .video-item`)
      .forEach((element) => {
        if (element.hasAttribute(`src`)) {
          embedURL = element.getAttribute(`src`);
        } else if (element.hasAttribute(`data-src`)) {
          embedURL = element.getAttribute(`data-src`);
        } else if (element.hasAttribute(`data-alt-url`)) {
          embedURL = element.getAttribute(`data-alt-url`);
        }
        if (embedURL?.includes("youtube")) {
          videoID = embedURL?.substr(embedURL.indexOf(`embed/`) + 6, 11);
          thisPage.videos.youtube.push(videoID);
        } else if (embedURL?.includes("thinglink")) {
          videoID = embedURL?.split("videocard/")[1];
          thisPage.videos.thinglink.push(videoID);
        } else if (embedURL?.includes("vimeo")) {
          videoID = embedURL?.split("video/")[1];
          thisPage.videos.vimeo.push(videoID);
        }
        if (
          element.hasAttribute(`data-videoid`) &&
          element.getAttribute(`data-videoid`) != videoID
        ) {
          thisPage.videos.youtube.push(element.getAttribute(`data-videoid`));
        }
        embedURL = "";
      });
    const hasNonEmptyArray = Object.values(thisPage.videos)
      .flat()
      .some((array) => array.length > 0);
    if (hasNonEmptyArray) videos.push(thisPage);
    if (pageIndex > 0) {
      let thisPageActivities = {
        page: doc.title.split(`-`)[0] + " - Autoatividades",
        videos: { vimeo: [], youtube: [], thinglink: [] },
      };
      doc.querySelectorAll(`.complementar .video iframe`).forEach((element) => {
        if (element.hasAttribute(`src`)) {
          embedURL = element.getAttribute(`src`);
        } else if (element.hasAttribute(`data-src`)) {
          embedURL = element.getAttribute(`data-src`);
        }
        if (embedURL?.includes("youtube")) {
          videoID = embedURL?.substr(embedURL.indexOf(`embed/`) + 6, 11);
          thisPageActivities.videos.youtube.push(videoID);
        } else if (embedURL?.includes("thinglink")) {
          videoID = embedURL?.split("videocard/")[1];
          thisPageActivities.videos.thinglink.push(videoID);
        } else if (embedURL?.includes("vimeo")) {
          videoID = embedURL?.split("video/")[1];
          thisPageActivities.videos.vimeo.push(videoID);
        }
      });
      const hasAtividade = Object.values(thisPageActivities.videos)
        .flat()
        .some((array) => array.length > 0);
      if (hasAtividade) videos.push(thisPageActivities);
    }
  });
  videos.sort((a, b) => (a.page < b.page ? 1 : -1));
  return videos;
}
async function appendVideosToPage(videos) {
  let contentSection = document.querySelector(".content-section");
  if (videos.length > 0) {
    videos.forEach((vPage) => {
      let pageTitle = `
    <div class="video-playlist-wrapper">  
    <div class="page-titulo">
      <h2>${vPage.page}</h2>
    </div>
    </div>`;
      let hasVideo = false;

      // vimeo
      if (vPage.videos.vimeo.length > 0) {
        let playlistWrapper = document.createElement(`div`);
        playlistWrapper.classList.add(`video-playlist-wrapper`);
        playlistWrapper.innerHTML = vPage.videos.vimeo
          .map(
            (videoID) =>
              `<div class="video">
      <div class="video-large">
        <iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://player.vimeo.com/video/${videoID}" allowfullscreen="true"></iframe>
      </div>
    </div>`
          )
          .join(` `);
        contentSection?.insertAdjacentElement(`afterend`, playlistWrapper);
        hasVideo = true;
      }

      // thinglink
      if (vPage.videos.thinglink.length > 0) {
        let playlistWrapper = document.createElement(`div`);
        playlistWrapper.classList.add(`video-playlist-wrapper`);
        playlistWrapper.innerHTML = vPage.videos.thinglink
          .map(
            (videoID) =>
              `<div class="video">
          <div class="video-large">
            <iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://www.thinglink.com/videocard/${videoID}" allowfullscreen="true"></iframe>
          </div>
        </div>`
          )
          .join(` `);
        contentSection?.insertAdjacentElement(`afterend`, playlistWrapper);
        hasVideo = true;
      }

      // youtube
      if (vPage.videos.youtube.length > 0) {
        let playlistWrapper = document.createElement(`div`);
        playlistWrapper.classList.add(`video-playlist-wrapper`);
        playlistWrapper.innerHTML = `  			
  			${
          vPage.videos.youtube.length > 1
            ? `
  			<div class="playlist v-22">
  				<div class="video">
  					<div class="video-large">
  						<iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://www.youtube.com/embed/${
                vPage.videos.youtube[0]
              }?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1" allowfullscreen="true"></iframe>
  					</div>
  				</div>

  				<div class="video-title">
  					<h2></h2>
  				</div>

  				<div class="playlist-nav">
  					<div class="nav-buttons">
  						<button onclick="loadPreviousVideo(this)">
  							<i class="material-icons">skip_previous</i>
  							<span>Anterior</span>
  						</button>
  						<button onclick="loadNextVideo(this)">
  							<span>Próximo</span>
  							<i class="material-icons">skip_next</i>
  						</button>
  					</div>

  					<button class="watched-filter" onclick="toggleWatchedFilter(this)">
  						<i class="material-icons watched-filter-toggle-icon-true">visibility</i>
  						<i class="material-icons watched-filter-toggle-icon-false">visibility_off</i>
  						<span>
  							<span class="filter-off">Ocultar</span>
  							<span class="filter-on">Exibir</span>
  							<span> assistidos</span>
  						</span>
  					</button>

  					<button class="watched-toggle" onclick="toggleWatchedState(this)">
  						<i class="material-icons watched-toggle-icon-false">radio_button_unchecked</i>
  						<i class="material-icons watched-toggle-icon-true">check_circle</i>
  						<span>Assistido</span>
  					</button>
  				</div>

  				<div class="itens-list">
  					${vPage.videos.youtube
              .map(
                (videoid) => `<div class="video-item ${
                  checkSet.has(videoid) ? `watched` : ``
                }" data-videoid="${videoid}" onclick="loadVideo(this)">
  								<img src="https://img.youtube.com/vi/${videoid}/0.jpg" draggable="false">
  								<i class="material-icons">play_circle_outline</i>
  							</div>`
              )
              .join(` `)}
  				</div>
  			</div>
  				`
            : `
  			<div class="video">
  				<div class="video-large">
  					<iframe title="Vídeo da Disciplina" width="1280" height="720" src="https://www.youtube.com/embed/${vPage.videos.youtube[0]}?rel=0&amp;showinfo=0&amp;disablekb=1&amp;modestbranding=1&amp;allowfullscreen=1" allowfullscreen="true"></iframe>
  				</div>
  			</div>
  			`
        }

  		`;
        contentSection?.insertAdjacentElement(`afterend`, playlistWrapper);
        hasVideo = true;
      }

      if (hasVideo) {
        contentSection?.insertAdjacentHTML(`afterend`, pageTitle);
      }
    });
    document.querySelectorAll(`.video-item:first-child`).forEach((e) => {
      e.classList.add(`selected`);
    });
  } else {
    contentSection?.insertAdjacentHTML(
      `afterend`,
      `<div class="content-text">
  			<h2>Ops!</h2>

  			<p>Sua trilha ainda não tem vídeos disponíveis 😕</p>

  			<p>
  				Assim que novos vídeos forem adicionados eles irão aparecer nesta
  				página.
  			</p>
  		</div>`
    );
  }
}
async function extractObjetosFromHTML(pages) {
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
    if (thisPage.objetos.length > 0) objetos.push(thisPage);
  });
  objetos.sort((a, b) => (a.page < b.page ? 1 : -1));
  return objetos;
}
async function appendObjetosToPage(objetos) {
  let contentSection = document.querySelector(".content-section");
  if (objetos.length > 0) {
    objetos.forEach((oPage) => {
      if (oPage.objetos.length > 0) {
        oPage.objetos.forEach((objeto) => {
          contentSection?.insertAdjacentHTML(
            `afterend`,
            `
						<div class="objeto">
							${objeto}
						</div>
					`
          );
        });
        contentSection?.insertAdjacentHTML(
          `afterend`,
          `
					<div class="page-titulo">
						<h2>${oPage.page}</h2>
					</div>
				`
        );
      }
    });
  } else {
    contentSection?.insertAdjacentHTML(
      `afterend`,
      `<div class="content-text">
			<h2>Ops!</h2>

			<p>Sua trilha ainda não possui Recursos Interativos disponíveis 😕</p>

			<p>
				Assim que novos forem adicionados, eles irão aparecer nesta
				página.
			</p>
		</div>`
    );
  }
}
function loadAdditionalFonts() {
  let fonts = [
    `https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap`,
    "https://use.typekit.net/tdl4wcy.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
  ];
  let putBefore = document.getElementsByTagName("link")[0];
  fonts.forEach((fontHref) => {
    let newLink = document.createElement("link");
    newLink.rel = `stylesheet`;
    newLink.href = fontHref;
    putBefore.parentNode?.insertBefore(newLink, putBefore);
  });
}
async function appendObjetoMenu() {
  let objs = document.querySelectorAll(`.objeto iframe`);
  if (objs)
    objs.forEach((obj) => {
      let avaliaHtml = ``;
      let objetoURL;
      if (obj.hasAttribute(`data-src`)) {
        objetoURL = new URL(obj.getAttribute(`data-src`));
      } else {
        objetoURL = new URL(obj.getAttribute(`src`));
      }
      if (objetoURL) {
        let objetoCodigoGio;
        if (objetoURL.searchParams.has(`codigo`)) {
          objetoCodigoGio = objetoURL.searchParams.get(`codigo`);
        } else {
          objetoCodigoGio = objetoURL.href.trim();
        }
        if (objetoCodigoGio) {
          let objAvaliado = getStorage(
            `avaliou-${currentDisciplina}-${objetoCodigoGio}`
          );
          if (objAvaliado === null) {
            avaliaHtml = `
							<div class="obj-avalia">
								<button class="obj-avalia-open" onclick="toggleObjMenu(this)">
									<i class="material-icons">star_outline</i>
									<span>&ensp;Avaliar</span>
								</button>

								<div class="obj-stars">						
									<button onclick="avaliouObj(this, '${objetoCodigoGio}', 5)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, '${objetoCodigoGio}', 4)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, '${objetoCodigoGio}', 3)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, '${objetoCodigoGio}', 2)">
										<i class="material-icons outline">star_outline</i>
										<i class="material-icons fill">star</i>
									</button>
									<button onclick="avaliouObj(this, '${objetoCodigoGio}', 1)">
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
								<a href="https://www.addtoany.com/add_to/facebook?linkurl=${objetoURL}&amp;linkname=" target="_blank"><img src="https://static.addtoany.com/buttons/facebook.svg"></a>

								<a href="https://www.addtoany.com/add_to/whatsapp?linkurl=${objetoURL}&amp;linkname=" target="_blank"><img src="https://static.addtoany.com/buttons/whatsapp.svg"></a>
							</div>
						</div>
						${
              document.fullscreenEnabled
                ? ` <button onclick="goBig(this)">
										<i class="material-icons">fullscreen</i>
									</button>`
                : ``
            }
						
					</div>
				</div>
			`;
      let parent = obj.parentElement;
      if (parent) {
        if (parent.classList.contains(`objeto`)) {
          parent.insertAdjacentHTML(`afterbegin`, menuHtml);
        } else {
          parent.parentElement?.insertAdjacentHTML(`afterbegin`, menuHtml);
        }
      }
    });
}
function toggleObjMenu(el) {
  el.parentElement?.classList.toggle(`open`);
}
function avaliouObj(origin, code, score) {
  let objAvalia = origin.parentElement?.parentElement;
  if (objAvalia) {
    objAvalia.classList.add(`avaliou`);
    window.setTimeout(() => {
      objAvalia?.parentElement?.removeChild(objAvalia);
    }, 1500);
  }
  setStorage(`avaliou-${currentDisciplina}-${code}`, `true`);
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
  el.nextElementSibling?.classList.add(`visible`);
  el.classList.add(`hidden`);
}
function goBig(el) {
  let wrapper = el.parentElement?.parentElement?.parentElement;
  if (wrapper) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (wrapper.classList.contains(`objeto`)) {
        wrapper.requestFullscreen();
      } else {
        wrapper.parentElement?.requestFullscreen();
      }
    }
  }
}
function appendWebchat() {
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
    firstScript.parentNode?.insertBefore(webchatScript, firstScript);
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
    } else {
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
    } else {
      docElements.forEach((docEl) => {
        docEl.addEventListener(`click`, popGerador);
      });
    }
  }
}
function popGerador() {
  document.body.insertAdjacentHTML(
    `beforeend`,
    `
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
            `
  );
}
function showPopper(element) {
  if (!element.hasAttribute(`locked`)) {
    document.querySelectorAll(`.has-popper`).forEach((el) => {
      el.classList.remove(`has-popper`);
      el.removeAttribute(`locked`);
      el.querySelector(".hint")?.removeAttribute("data-show");
      el.querySelector(".hint")?.removeAttribute("data-placement");
    });
  }
  element.classList.add(`has-popper`);
  let elementPosition = element.getBoundingClientRect();
  let hint = element.querySelector(".hint");
  hint.setAttribute("data-show", "");
  hint.setAttribute(
    `data-placement`,
    elementPosition.top < 370 ? "bottom" : "top"
  );
  let pageWidth = document.body.getBoundingClientRect().width;
  let hintXOffset = pageWidth - 280 - elementPosition.left - 48;
  if (hintXOffset < 0) {
    hint.style.transform = `translateX(${hintXOffset}px)`;
  }
}
function hidePopper(element) {
  if (document.activeElement != element && !element.hasAttribute("locked")) {
    element.classList.remove(`has-popper`);
    element.querySelector(".hint").removeAttribute("data-show");
    element.querySelector(".hint").removeAttribute("data-placement");
  }
}
function togglePopperLock(element) {
  if (element.hasAttribute("locked")) {
    element.removeAttribute(`locked`);
  } else {
    element.setAttribute(`locked`, ``);
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
  element.addEventListener(`click`, () => {
    togglePopperLock(element);
  });
}
function initPops() {
  let capsulas = document.querySelectorAll(".rex");
  if (capsulas.length > 0) {
    capsulas.forEach(async (el) => {
      let keywords = el.innerHTML.split(` `).join(`+`);
      let youtubeUrl = `https://www.youtube.com/results?search_query=${keywords}+aula`;
      let explain = ``;
      if (el.hasAttribute(`data-hint`)) {
        explain = el.getAttribute(`data-hint`).substring(0, 200);
      } else {
        let wikiResponse = await fetch(
          "https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&exchars=200&redirects=1&origin=*&titles=" +
            keywords
        );
        let wikiJson = await wikiResponse.json();
        let wikiPages = wikiJson.query.pages;
        explain = wikiPages[Object.keys(wikiPages)[0]].extract;
      }
      let hint = `
				<div class="hint">
					<div class="hint-wrapper">
						${
              explain != undefined && explain != ``
                ? `<div class="hint-section">
										<span class="hint-title">Sobre este termo:</span>
										<p>${explain}</p>
									</div>`
                : ""
            }
						<span class="hint-materiais">Fontes externas:</span>
						<div class="links">
							<a href="https://www.google.com/search?q=${keywords}" target="_blank">
								Buscar termo
								<i class="material-icons">search</i>
							</a>
							<a class="jcc" href="https://scholar.google.com/scholar?hl=pt&q=${keywords}" target="_blank">
								<i class="material-icons">school</i>
							</a>						
							<a href="${youtubeUrl}" target="_blank">
								Pesquisar no YouTube
								<i class="material-icons">smart_display</i>
							</a>
						</div>
						<div id="arrow" data-popper-arrow></div>
					</div>
				</div>
			`;
      el.insertAdjacentHTML("beforeend", hint);
      initPopperOn(el);
    });
  }
}
function removeSumarioItemPrefixes(itemSumario) {
  if (itemSumario.match(/^(UNIDADE|TÓPICO|Unidade|[0-9]|-|–).*/g)) {
    let brokenItemSelecionado = itemSumario.split(` `);
    brokenItemSelecionado.shift();
    brokenItemSelecionado = brokenItemSelecionado.join(` `);
    return removeSumarioItemPrefixes(brokenItemSelecionado);
  } else {
    return itemSumario;
  }
}
function isOnMicroscopiaExclusionList(item) {
  const list = [
    "17580",
    "17581",
    "17582",
    "17583",
    "17585",
    "17586",
    "17588",
    "17589",
    "17590",
    "17594",
    "17595",
    "17596",
    "17597",
  ];
  return list.includes(item);
}
async function buildMenu() {
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
    sidebar
      ?.querySelectorAll(
        `#main-menu-inicio, #main-menu-pandemia, #main-menu-presencial, #main-menu-apresentacao, #main-menu-etapa_i, #main-menu-u1, #main-menu-u2, #main-menu-u3`
      )
      .forEach((el) => {
        let redirectLink = el.getAttribute(`onclick`)?.split(`'`);
        redirectLink?.shift();
        existingLinks.push({
          id: el.id,
          nome: el.innerText.trim(),
          href: redirectLink ? redirectLink[0] + `.html` : "",
          selected: el.classList.contains(`selected`),
        });
      });
    let groupNav = `${existingLinks
      .map(
        (item) => `<a id="${item.id}" class="sidebar-item ${
          item.selected ? "selected" : ""
        }" href="${item.href}">
			<img src="../img/ico/menu/${iconMap[item.nome]}.svg" alt="">
			<span>${item.nome}</span>
			${item.selected ? `<div class="sidebar-progress"></div>` : ""}
		</a>`
      )
      .join(`\n`)}`;
    let groupMateriais = ``;
    const materiais = [
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
      {
        seletor: "#material-menu-laboratorio",
        icone: "lab_virtual",
        nome: "Laboratório Virtual",
        target: "",
      },
      {
        seletor: "#material-menu-audiolivro",
        icone: "audiolivro",
        nome: "Audiolivro",
        target: "",
      },
    ];
    let hasBiodigital = document.querySelector(materiais[0].seletor);
    if (
      hasBiodigital &&
      !isOnMicroscopiaExclusionList(currentDisciplina.split(`_`)[0])
    ) {
      groupMateriais += `
			<a id="material-menu-microscopia" href="https://221322w.ha.azioncdn.net/Arquivo/ID/15362/menu/" class="sidebar-item" target="_blank">
					<img src="../img/ico/menu/microscopia.svg">
					<span>Microscopia Digital</span>
				</a>
			`;
    }
    materiais.forEach((material) => {
      let element = document.querySelector(material.seletor);
      if (element) {
        groupMateriais += `
				<a id="${element.id}" href="${element.href}" class="sidebar-item" target="${material.target}">
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
				${
          groupMateriais.length > 0
            ? `<div class="sidebar-group">
								<div class="sidebar-title">Meus Materiais</div>
								${groupMateriais}
							</div>`
            : ""
        }
				<div class="sidebar-group access">
					<div class="sidebar-title">Acessibilidade</div>
				</div>
			</div>
		`;
    let acMenu = document.querySelector(`#accessibility-menu`);
    if (acMenu) {
      if (currentPage != "laboratorio.html") {
        acMenu
          .querySelector(`#accessibility-decrease`)
          ?.insertAdjacentHTML(`beforeend`, `Diminuir a fonte`);
        acMenu
          .querySelector(`#accessibility-reset`)
          ?.insertAdjacentHTML(`beforeend`, `Redefinir a fonte`);
        acMenu
          .querySelector(`#accessibility-increase`)
          ?.insertAdjacentHTML(`beforeend`, `Aumentar a fonte`);
      }
      sidebar?.querySelector(`.sidebar-group.access`)?.appendChild(acMenu);
    }
  } else {
  }
}
function updateFooter() {
  let rodape = document.querySelector(`.content-footer`);
  if (rodape && !rodape.classList.contains(`v22-1`)) {
    rodape.innerHTML = `
		<div class="footer-marca">
			<img src="../img/favicon.png" alt="" />
			<span class="footer-marca-texto"
				>UNIASSELVI © Todos os direitos reservados.</span
			>
		</div>
		<div class="footer-links">
			<a href="https://portal.uniasselvi.com.br/" target="_blank">
				<img src="../img/favicon.png" alt="" />
				Acesse o Portal UNIASSELVI</a
			>
			<a href="https://ava2.uniasselvi.com.br/">
				<img src="../img/texto_gio.svg" alt="" />

				Ir para o AVA</a
			>
		</div>
		`;
    rodape.classList.add(`v22-1`);
  }
}
let txt = "";
function md5cycle(x, k) {
  var a = x[0],
    b = x[1],
    c = x[2],
    d = x[3];
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);
  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}
function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}
function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}
function md51(s) {
  txt = "";
  var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878],
    i;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++)
    tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
  tail[i >> 2] |= 0x80 << (i % 4 << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}
function md5blk(s) {
  var md5blks = [],
    i;
  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}
var hex_chr = "0123456789abcdef".split("");
function rhex(n) {
  var s = "",
    j = 0;
  for (; j < 4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
  return s;
}
function hex(x) {
  for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
  return x.join("");
}
function md5(s) {
  return hex(md51(s));
}
function add32(a, b) {
  return (a + b) & 0xffffffff;
}
function idAtividades() {
  let ativs = document.querySelectorAll(`.exercicios-wrapper .um-item`);
  ativs.forEach((umItem) => {
    let firstEnum = umItem.querySelector(`.ex-enun`);
    if (firstEnum) {
      let enunMd = md5(firstEnum.innerHTML);
      umItem.setAttribute(`id`, `at-${enunMd}`);
    }
  });
}
function loadSavedAnswers() {
  let answers = getStorage(`at-${currentDisciplina}`);
  if (answers && answers.length > 0) {
    nAnswers = JSON.parse(answers);
    const atKeys = Object.keys(nAnswers);
    atKeys.forEach((key) => {
      let itemForThisKey = document.querySelector(`#${key}`);
      if (itemForThisKey) {
        itemForThisKey.querySelector(".ex-enviar")?.classList.remove("visible");
        let targetInput = itemForThisKey.querySelector(
          `.uma-alt:nth-child(${nAnswers[key].i + 1}) input`
        );
        if (targetInput) {
          targetInput.checked = true;
        }
        itemForThisKey.querySelectorAll(`input`).forEach((anInput) => {
          anInput.setAttribute(`disabled`, `true`);
        });
        if (nAnswers[key].c) {
          itemForThisKey
            .querySelector(".ex-fb-correto")
            ?.classList.add("visible");
        } else {
          itemForThisKey
            .querySelector(".ex-fb-incorreto")
            ?.classList.add("visible");
        }
      }
    });
  }
}
async function initPlaylists() {
  let oldPlaylistsHere = document.querySelectorAll(`.playlist:not(.v-22)`);
  oldPlaylistsHere.forEach((aPlaylistToUpgrade) => {
    upgradePlaylist(aPlaylistToUpgrade);
  });
  let playlistsOnThisPage = document.querySelectorAll(`.playlist.v-22`);
  playlistsOnThisPage.forEach(async (aPlaylistToLoad) => {
    let selectedVideoID = aPlaylistToLoad
      .querySelector(`.video-item.selected`)
      ?.getAttribute(`data-videoid`);
    if (selectedVideoID) {
      updateVideoTitle(aPlaylistToLoad, selectedVideoID);
    }
    aPlaylistToLoad
      .querySelectorAll(`.video-item`)
      .forEach((videoItem, index) => {
        let thisVideoID = videoItem.getAttribute(`data-videoid`);
        if (thisVideoID && checkSet.has(thisVideoID)) {
          videoItem.classList.add(`watched`);
          if (index == 0) {
            aPlaylistToLoad
              .querySelector(`.watched-toggle`)
              ?.classList.add(`true`);
          }
        }
      });
  });
}
function upgradePlaylist(oldPlaylist) {
  let playlistVideoElement = oldPlaylist.querySelector(`.video`);
  playlistVideoElement.insertAdjacentHTML(
    `afterend`,
    `
	<div class="video-title">
		<h2></h2>
	</div>

	<div class="playlist-nav">
		<div class="nav-buttons">
			<button onclick="loadPreviousVideo(this)">
				<i class="material-icons">skip_previous</i>
				<span>Anterior</span>
			</button>
			<button onclick="loadNextVideo(this)">
				<span>Próximo</span>
				<i class="material-icons">skip_next</i>
			</button>
		</div>

		<button class="watched-filter" onclick="toggleWatchedFilter(this)">
			<i class="material-icons watched-filter-toggle-icon-true">visibility</i>
			<i class="material-icons watched-filter-toggle-icon-false">visibility_off</i>
			<span>
				<span class="filter-off">Ocultar</span>
				<span class="filter-on">Exibir</span>
				<span> assistidos</span>
			</span>
		</button>

		<button class="watched-toggle" onclick="toggleWatchedState(this)">
			<i class="material-icons watched-toggle-icon-false">radio_button_unchecked</i>
			<i class="material-icons watched-toggle-icon-true">check_circle</i>
			<span>Assistido</span>
		</button>
	</div> 
	`
  );
  oldPlaylist.classList.add(`v-22`);
}
function initCheckSet() {
  let tryFetchCheckSet = window.localStorage.getItem(`checkset`);
  if (tryFetchCheckSet && tryFetchCheckSet.length > 0) {
    checkSet = new Set(JSON.parse(tryFetchCheckSet));
  } else {
    checkSet = new Set();
  }
}
function saveCheckSet() {
  window.localStorage.setItem(`checkset`, JSON.stringify([...checkSet]));
}
function initDicasDocsStatus() {
  let linksInThePage = document.querySelectorAll(".dica-leitura .content-link");
  linksInThePage.forEach((aLink) => {
    let linkText = aLink.querySelector("span").innerHTML;
    let linkHash = md5(linkText);
    aLink.setAttribute(`data-id`, linkHash);
    if (checkSet.has(linkHash)) {
      aLink.setAttribute(`data-viewed`, ``);
    }
    let buttonHtml = `
		<button 
			onclick="toggleLinkStatus(event, this)" 
		  	title="Marcar como visto"
		>
			<i class="material-icons true">check_circle</i>
			<i class="material-icons false">radio_button_unchecked</i>
		</button>
		`;
    aLink.insertAdjacentHTML(`beforeend`, buttonHtml);
  });
}
function isOnEnadeSimuladoList(name) {
  let nessasTrilhasTemSimulado = [
    `adg`,
    `apu`,
    `CTB`,
    `ecn`,
    `jor`,
    `bri`,
    `ses`,
    `teo`,
    `cme`,
    `gsa`,
    `gco`,
    `gcq`,
    `gpu`,
    `rhu`,
    `gfi`,
    `lod`,
    `cma`,
    `emd`,
    `pup`,
    `tmd`,
    `cgq`,
  ];
  return nessasTrilhasTemSimulado.indexOf(name) > -1;
}
function appendSimuladoEnade22_1() {
  if (
    (currentDisciplina?.includes(`ENADE`) ||
      currentDisciplina?.includes(`enade`)) &&
    isOnEnadeSimuladoList(currentDisciplina.split(`_`)[1])
  ) {
    let hoje = new Date();
    let dataLimite = new Date(2022, 5, 13);
    let timeDiff = hoje.valueOf() - dataLimite.valueOf();
    if (timeDiff < 0) {
      let cttsInThisPage = document.querySelectorAll(`.content-text`);
      cttsInThisPage[cttsInThisPage.length - 1].insertAdjacentHTML(
        `beforeend`,
        `
			<div class="dica-leitura">
				<img
					src="../img/ico/modelo_outline.svg"
					alt="Dica de Leitura"
				/>
				<h2>Simulado de Conhecimentos Gerais - 22/1</h2>

				<p>
					Este simulado foi elaborado para você, aluno
					da UNIASSELVI, buscando desenvolver
					habilidades e competências necessárias para
					sua formação profissional.
				</p>

				<p>
					Todas as questões são de conhecimentos
					gerais, por esta razão, indiferente do
					curso, solicitamos que leia as questões com
					calma, interprete-as e responda com
					tranquilidade e atenção a cada comando.
				</p>

				<p>
					Este simulado ficará disponível entre os
					dias <b>16/05/2022</b> e <b>12/06/2022</b>.
				</p>
				<a
					class="content-link flex-c"
					href="https://forms.office.com/r/fBguSfqmfx"
					target="_blank"
				>
					<i class="material-icons">description</i>
					<span>Responder ao Simulado</span>
				</a>
			</div>
			`
      );
    }
  }
}
function updateNavigationStatus(event) {
  if (document.visibilityState === `hidden`) {
    savePagePosition(currentDisciplina, currentPage);
  }
}
function savePagePosition(name, page) {
  if (currentPage != "inicio.html" && currentPage != "") {
    let pageName = `left_${name}_on`;
    let pageInfo = JSON.stringify({
      page: page,
      scrollHeight: document.documentElement.scrollTop,
      time: new Date().toLocaleDateString(),
    });
    localStorage.setItem(pageName, pageInfo);
  }
}
function checkForReturningAccess() {
  if (currentPage == `inicio.html` || currentPage == ``) {
    let pageInfo = localStorage.getItem(`left_${currentDisciplina}_on`);
    if (pageInfo && pageInfo.length > 0) {
      let returnInfo = JSON.parse(pageInfo);
      let gotoURL = `${returnInfo.page}?returning=${returnInfo.scrollHeight}`;
      let gotoLocation = pageToStringName(returnInfo.page);
      let returnDiv = `
				<div class="retorno">					
                    <div class="wrapper">
                        <button class="close-retorno" onclick="fechaRetorno()"><i class="material-icons">close</i></button>

						<a href="${gotoURL}">						
							${
                studentObj
                  ? `<p>Olá ${studentObj.primeiroNome}, deseja continuar de onde parou?</p>`
                  : "<p>Continuar de onde você parou:</p>"
              }
                            
                            <div class="onde-parou">
                                <p>${gotoLocation}</p>
                                <p class="parou-data">em ${returnInfo.time}</p>
                            </div>
                        </a>
                    </div>                    
                </div>
            `;
      document.body.insertAdjacentHTML("beforeend", returnDiv);
    }
  }
}
function pageToStringName(pageName) {
  let pagesMap = new Map()
    .set(`apresentacao.html`, `Apresentação`)
    .set(`unidade1.html`, `Unidade 1`)
    .set(`unidade2.html`, `Unidade 2`)
    .set(`unidade3.html`, `Unidade 3`)
    .set(`objetos.html`, `Recursos Interativos`)
    .set(`videos.html`, `Vídeos da Disciplina`);
  return pagesMap.has(pageName) ? pagesMap.get(pageName) : pageName;
}
function scrollIntoPosition() {
  if (currentURL.searchParams.has(`returning`)) {
    document.documentElement.scrollTop = parseInt(
      currentURL.searchParams.get(`returning`)
    );
  }
}
function fechaRetorno() {
  document.querySelector(".retorno").style.display = "none";
}
function cleanURL() {
  let cleanURL = new URL(currentURL.toString());
  cleanURL.searchParams.delete(`param`);
  window.history.replaceState(null, "", cleanURL.toString());
}
function pushAcademicoIntoDataLayer() {
  if (identificacao) {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push({
      event: "user_data",
      ...JSON.parse(atob(identificacao)),
    });
  }
}
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
function hideCaptivateFrames() {
  let frames = document.querySelectorAll(`.objeto iframe`).forEach((frame) => {
    let frameSrc =
      frame.getAttribute(`src`) ?? frame.getAttribute(`data-src`) ?? ``;
    if (frameSrc.indexOf(`objeto_aprendizagem.php`) > -1) {
      let frameParent = frame.parentElement;
      frameParent?.classList.add(`frame-hidden`);
      frameParent?.insertAdjacentHTML(
        `beforeend`,
        `<button
			onclick="this.parentElement.classList.toggle('frame-hidden')"
		>
			<span class="when-hidden">Exibir recurso </span>
			<span class="material-icons">expand_more</span>
		</button>`
      );
    }
  });
}

// implementa aviso sobre o laboratorio virtual
function initAvisoLaboratorio() {
  let labElement = document.getElementById("material-menu-laboratorio");
  if (labElement && currentPage == "apresentacao.html") {
    const modalHTML = `
          <a class="button-modal material-icons">
            science
          </a>
          <dialog class="modal">
            <div class="dialog-backshadow">
                <div class="dialog-content">
                    <p>
                        <b>Caro estudante!</b> <br />
                        <br />
                        Esta disciplina possui atividade prática
                        em Laboratório Virtual. As orientações
                        estão disponíveis no menu lateral
                        esquerdo, “<a href="laboratorio.html" class="humanas">Meus&nbsp;Materiais > Laboratório&nbsp;Virtual</a>”. Acesse e
                        saiba mais!
                    </p>
                </div>
            </div>
          </dialog>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const labModal = document.querySelector(".modal");

    // listener de DOMContentLoaded para o aviso do laboratorio virtual
    const handleDOMContentLoaded = () => {
      labModal.showModal();
      localStorage.setItem("modalShown", true);
    };

    if (!localStorage.getItem("modalShown")) {
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
    }

    const modalButton = document.querySelector(".button-modal");
    modalButton.addEventListener("click", () => {
      window.location.href = "laboratorio.html";
    });

    window.addEventListener("unload", () => {
      localStorage.removeItem("modalShown");
    });

    labModal.addEventListener("click", function (event) {
      if (
        event.target === labModal ||
        event.target.className === "dialog-backshadow"
      ) {
        labModal.close();
      }
    });
  }
}

//aviso de novo layout das trilhas na tela de início
function showNewLayoutModal() {
  if (currentPage === "inicio.html" || currentPage === "") {
    const modalNewLayout = `
      <dialog class="modal">
            <div class="dialog-backshadow">
                <div class="nl-dialog-content">
                  <button id="close-modal" title="Fechar">
                    <span class="material-icons">close</span>
                  </button>
                  <img src="../img/stars.svg" />
                  <h3 id="main-title">Olá, estudante!</h3>    
                  <p>
                    A trilha da UNIASSELVI está de cara nova!
                  </p>
                  <div id="c1" class="circle"></div>
                  <div id="c2" class="circle"></div>
                  <div id="c3" class="circle"></div>
                  <div id="c4" class="circle"></div>
                  <div id="c5" class="circle"></div>
                  <div id="c6" class="circle"></div>
                  <div id="c7" class="circle"></div>
                </div>
            </div>
          </dialog>
    `;

    // Verifica se o flag já está presente no localStorage
    if (!localStorage.getItem("newLayoutModalShown")) {
      document.body.insertAdjacentHTML("beforeend", modalNewLayout);

      const newLayoutModal = document.querySelector(".modal");

      newLayoutModal.showModal();

      localStorage.setItem("newLayoutModalShown", true);

      newLayoutModal.addEventListener("click", (event) => {
        if (
          event.target === newLayoutModal ||
          event.target.className === "dialog-backshadow"
        ) {
          newLayoutModal.close();
        }
      });

      const closeBtn = document.querySelector("#close-modal");
      closeBtn.addEventListener("click", () => {
        newLayoutModal.close();
      });
    }
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

function injectAnimationCt(resources) {
  resources.forEach(({ reference, isWrapped, polygonSrc, iconSrc }) => {
    if (reference !== null) {
      const animationCt = `
              <div class="animation-container">
                <img src="../img/animation/${polygonSrc}" class="polygons">
                <img src="../img/animation/${iconSrc}" class="animation-icon">
              </div>`;

      if (isWrapped) {
        //insere o container após o elemento
        reference.insertAdjacentHTML("afterend", animationCt);
      } else {
        const titleBigCt = document.createElement("div");
        titleBigCt.className = "title-big-ct";

        // Envelopa o elemento e a animationCt dentro da div titleBigCt
        reference.insertAdjacentElement("beforebegin", titleBigCt);
        titleBigCt.appendChild(reference);
        titleBigCt.insertAdjacentHTML("beforeend", animationCt);
      }
    }
  });
}

function createAnimationInPagesBg() {
  const bgVideos = document.querySelector(
    ".title-big.bgv .subheader.text-center"
  );
  const bgRecursos = document.querySelector(
    ".title-big.bgo .subheader.text-center"
  );
  const bgApresentacao = document.querySelector(".title-big.bg1");
  const bgUnidade1 = document.querySelector(".title-big.bg2");
  const bgUnidade2 = document.querySelector(".title-big.bg3");
  const bgUnidade3 = document.querySelector(".title-big.bg4");
  const bgLabVirtual = document.querySelector(".title-big.bg5");

  const resources = [
    {
      reference: bgApresentacao,
      isWrapped: false,
      polygonSrc: "polygons_rocket.svg",
      iconSrc: "rocket.svg",
    },
    {
      reference: bgUnidade1,
      isWrapped: false,
      polygonSrc: "polygons_livro.svg",
      iconSrc: "livro.svg",
    },
    {
      reference: bgUnidade2,
      isWrapped: false,
      polygonSrc: "polygons_diploma.svg",
      iconSrc: "diploma.svg",
    },
    {
      reference: bgUnidade3,
      isWrapped: false,
      polygonSrc: "polygons_capelo.svg",
      iconSrc: "capelo.svg",
    },
    {
      reference: bgVideos,
      isWrapped: true,
      polygonSrc: "polygons_videos.svg",
      iconSrc: "videos.svg",
    },
    {
      reference: bgRecursos,
      isWrapped: true,
      polygonSrc: "polygons_recursos.svg",
      iconSrc: "recursos.svg",
    },
    {
      reference: bgLabVirtual,
      isWrapped: false,
      polygonSrc: "polygons_lab.svg",
      iconSrc: "lab.svg",
    },
  ];

  injectAnimationCt(resources);
}

//adiciona o botão início na barra lateral das páginas que não possuem
function insertInicioOnSidebar() {
  const wrapperDiv = document.querySelector("#sidebar .wrapper");

  if (wrapperDiv) {
    const inicioHTMLContent = `
        <div class="sidebar-group">
          <div id="main-menu-inicio" class="sidebar-item" onclick="redirect('inicio')">
            <span>Início</span>
          </div>
        </div>
        `;

    const inicioBtnElement = wrapperDiv.querySelector(
      ".sidebar-group #main-menu-inicio"
    );

    if (!inicioBtnElement) {
      wrapperDiv.insertAdjacentHTML("afterbegin", inicioHTMLContent);
    }
  }
}

//corrije o redirecionamento das páginas de apresentação
//que possuem um redirecionamento para index.html no menu lateral
function fixApresentacaoRedirect() {
  const mainMenuApresentacao = document.getElementById(
    "main-menu-apresentacao"
  );

  if (mainMenuApresentacao) {
    const onclick = mainMenuApresentacao.getAttribute("onclick");
    if (onclick === "redirect('index')") {
      mainMenuApresentacao.setAttribute("onclick", "redirect('apresentacao')");
    }
  }
}

async function initPage() {
  insertInicioOnSidebar();
  fixApresentacaoRedirect();
  criaVlibrasNode();
  importaScriptVlibras();
  await identificaAcademico();
  redirectToTarget();
  loadAdditionalFonts();
  initCheckSet();
  await buildVideosPage();
  await buildObjetosPage();
  pushAcademicoIntoDataLayer();
  checkForReturningAccess();
  await buildMenu();
  hideMenuIfCookie();
  await getSimuladoGrade();
  await injectIndexTags();
  buildProgressBars();
  tabify();
  appendAvaliacaoStars();
  appendObjetoMenu();
  buildDocsLinks();
  // appendWebchat();
  initPops();
  initPlaylists();
  initDicasDocsStatus();
  updateFooter();
  // seminarioAddIns();
  appendSimuladoEnade22_1();
  appendVideoEnade();
  hideCaptivateFrames();
  scrollIntoPosition();
  cleanURL();
  initAvisoLaboratorio();
  addActiveToFirstRadioButton();
  createAnimationInPagesBg();
  showNewLayoutModal();
}
initPage();
window.addEventListener("scroll", updatePageLayoutOnScroll);
window.addEventListener("visibilitychange", updateNavigationStatus);
