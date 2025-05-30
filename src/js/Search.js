export default class Search {
    constructor(target) {
        this.target = target;
    }
    template() {
        return `검색(만드는중)`
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/search"){
            target.innerHTML = this.template();

            const $nav = document.getElementById("nav");
            const $navTagA = document.querySelector("#nav li:nth-of-type(3) a");
            const $navTagSvg = document.querySelector("#nav li:nth-of-type(3) a svg path");

            $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
            $navTagA.classList.add("a_on");
            $navTagSvg.classList.add("svg_on");
        }
    }
}