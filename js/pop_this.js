/*
 * ----- popper -----
 */

let popperInstance = null;

function createPopper(parent, hint) {
	popperInstance = Popper.createPopper(parent, hint, {
		placement: "top",
		modifiers: [
			{
				name: "preventOverflow",
				options: {
					padding: 10,
				},
			},
		],
	});
}

function destroyPopper() {
	if (popperInstance) {
		popperInstance.destroy();
		popperInstance = null;
	}
}

function showPopper(element) {
	let hint = element.querySelector(".hint");
	hint.setAttribute("data-show", "");
	createPopper(element, hint);
}

function hidePopper(element) {
	element.querySelector(".hint").removeAttribute("data-show");
	destroyPopper();
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
	document.querySelectorAll(".capsula-pop").forEach((el) => {
		let youtubeUrl = `https://www.youtube.com/results?search_query=${el.innerHTML
			.split(` `)
			.join(`+`)}+aula`;

		let hint = `
            <div class="hint">
                <p>${el.getAttribute("data-hint")}</p>

                <p>
                    <a  href="${el.getAttribute("data-link")}" 
                        target="_blank">
                            Ler Mais
                    </a>
                </p>
                                
                <p>
                    <a  href="${youtubeUrl}" 
                        target="_blank">YouTube</a>
                </p>

                <div id="arrow" data-popper-arrow></div>
            </div>
        `;

		el.removeAttribute("data-hint");
		el.removeAttribute("data-link");

		el.insertAdjacentHTML("beforeend", hint);

		initPopperOn(el);
	});
}

window.addEventListener("load", initPops);
