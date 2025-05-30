export default class Notice {
    constructor(target) {
        this.target = target;
    }
    template() {
        return `알림(만드는중)`
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/notice"){
            target.innerHTML = this.template();
                        
            const $nav = document.getElementById("nav");
            const $navTagA = document.querySelector("#nav li:nth-of-type(4) a");
            const $navTagSvg = document.querySelector("#nav li:nth-of-type(4) a svg path");
            
            $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
            $navTagA.classList.add("a_on");
            $navTagSvg.classList.add("svg_on");
        }
    }
}