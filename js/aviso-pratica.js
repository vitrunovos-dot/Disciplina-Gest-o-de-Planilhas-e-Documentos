function listerAvisoPraticaButtons() {
  const buttons = document.querySelectorAll(".aviso-pratica-botao");
  if (buttons && buttons.length > 0) {
    buttons.forEach((button) => {
      button.addEventListener("click", handleClickAvisoPraticaButton);
    });
  }
}

function handleClickAvisoPraticaButton(e) {
  const target = e.target;
  const targetId = target.dataset.id;
  const content = document.querySelector(
    `.aviso-pratica-conteudo[data-id='${targetId}']`
  );
  clearAvisoPraticaSelection();
  switch (targetId) {
    case "calouro":
      target.dataset.active = "true";
      content.dataset.active = "true";
      break;
    case "veterano":
      target.dataset.active = "true";
      content.dataset.active = "true";
      break;
  }
}

function clearAvisoPraticaSelection() {
  const buttons = document.querySelectorAll(".aviso-pratica-botao");
  const contents = document.querySelectorAll(".aviso-pratica-conteudo");
  if (buttons && buttons.length > 0) {
    buttons.forEach((button) => {
      button.dataset.active = "false";
    });
  }
  if (contents && contents.length > 0) {
    contents.forEach((content) => {
      content.dataset.active = "false";
    });
  }
}

window.addEventListener("load", listerAvisoPraticaButtons);
