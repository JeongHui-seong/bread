import DB from "./supabase.js";

export default class Search {
    constructor(target) {
        this.target = target;
        this.db = new DB();
        this.searched = [];
    }
    debounce(func, delay){
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    setEventListener(){
        const $inpSearch = document.getElementById("inp_search");
        $inpSearch.addEventListener("input", this.debounce(async (e)=>{
            const value = e.target.value.trim();
            this.currentValue = value;
            if (value.length > 0){
                this.searched = await this.db.searchUser({userName : value, userID : value});
            } else {
                this.searched = [];
            }

            this.resultChange();
        },200));
    }
    resultChange(){
        const $ul = document.querySelector(".ul_searched");

        if (!this.searched || this.searched.length == 0){
            $ul.innerHTML = `<li class="searched_list">해당하는 유저를 찾을 수 없습니다.</li>`;
            return;
        }

        $ul.innerHTML = this.searched.map(data => `
            <li class="searched_list">
                <a href="#/mypage/${data.user_key}">
                    <p class="name">${data.user_name}</p>
                    <p class="id">${data.user_id}</p>
                </a>
            </li>
            `).join('');
    }
    template() {
        return `
        <div class="container">
                <input type="text" id="inp_search" placeholder="아이디 또는 이름을 검색해주세요." value = "${this.currentValue || ''}">
            <div class="searched_box">
                <ul class="ul_searched">
                    ${this.searched.length == 0 ? `<li class="searched_list">해당하는 유저를 찾을 수 없습니다.</li>` :
                        this.searched.map(data => 
                        `<li class="searched_list">
                            <a href="#/mypage/${data.user_key}">
                                <p class="name">${data.user_name}</p>
                                <p class="id">${data.user_id}</p>
                            </a>
                        </li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        `
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/search"){
            this.searched = [];
            this.currentValue = '';
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