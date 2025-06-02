import DB from "./supabase.js";

export default class Search {
    constructor(target) {
        this.target = target;
        this.db = new DB();
    }
    debounce(func, delay){
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    setEventListener(){
        const inpSearch = document.getElementById("inp_search");
        inpSearch.addEventListener("input", this.debounce((e)=>{
            console.log(e.target.value.trim())
        },300));
    }
    template() {
        return `
        <div class="container">
                <input type="text" id="inp_search" placeholder="아이디 또는 이름을 검색해주세요.">
            <div class="searched_box">
                <ul>
                    <li class="searched_list">
                        <a href="#/mypage/">
                            <p class="name">이름</p>
                            <p class="id">아이디</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        `
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/search"){
            target.innerHTML = this.template();
            this.setEventListener();

            const $nav = document.getElementById("nav");
            const $navTagA = document.querySelector("#nav li:nth-of-type(3) a");
            const $navTagSvg = document.querySelector("#nav li:nth-of-type(3) a svg path");

            $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
            $navTagA.classList.add("a_on");
            $navTagSvg.classList.add("svg_on");
        }
    }
}