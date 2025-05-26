import Home from "./Home.js";
import Login from "./Login.js";
import Notice from "./Notice.js";
import Post from "./Post.js";
import Search from "./Search.js";
import Signup from "./Signup.js";

//////////////////APP/////////////////////////

const $app = document.getElementById("app");
const template = `
<header id="header">
    <nav id="nav">
        <ul>
            <li><a href="#/">로고</a></li>
            <li><a href="#/"><img src="./src/img/svg/homeicon.svg" alt="homeicon">홈</a></li>
            <li><a href="#/search"><img src="./src/img/svg/searchicon.svg" alt="searchicon">검색</a></li>
            <li><a href="#/notice"><img src="./src/img/svg/hearticon.svg" alt="hearticon">알림</a></li>
            <li><a href="#/post"><img src="./src/img/svg/plusicon.svg" alt="plusicon">글쓰기</a></li>
        </ul>
    </nav>
    <ul class = "user_log">
        <li class = "go_mypage logout"><a href="#/">${localStorage.getItem("username")}</a></li>
        <li class = "go_logout logout"><a href="#/login">로그아웃</a></li>
        <li class = "go_login login"><a href="#/login">로그인</a></li>
    </ul>
</header>
<main id="main"></main>
<footer id = "footer">

</footer>
`
$app.innerHTML = template;

class Router {
    constructor() {
        this.target = document.getElementById("main");

        this.home = new Home(this.target);
        this.search = new Search(this.target);
        this.notice = new Notice(this.target);
        this.post = new Post(this.target);
        this.login = new Login(this.target);
        this.signup = new Signup(this.target);

        this.state();
        this.setState();
    }

    state() {
        this.routes = [
            { fragment: "#/", component: () => this.home.render(this.target) },
            { fragment: "#/search", component: () => this.search.render(this.target) },
            { fragment: "#/notice", component: () => this.notice.render(this.target) },
            { fragment: "#/post", component: () => this.post.render(this.target) },
            { fragment: "#/login", component: () => this.login.render(this.target) },
            { fragment: "#/signup", component: () => this.signup.render(this.target) }
        ];
    }

    setEventListener(){
        const $goLogout = document.querySelector(".go_logout");
        $goLogout.addEventListener("click", this.logoutUser.bind(this));
    }

    logoutUser() {
        const $userName = document.querySelector(".go_mypage a");
        localStorage.removeItem("username");
        $userName.textContent = '';
        window.location.hash = "#/login";
    }

    updateUserLogUI() {
        const $logout = document.querySelectorAll(".logout");
        const $login = document.querySelector(".login");
        const $userName = document.querySelector(".go_mypage a");
        if (localStorage.getItem("username")) {
            $logout.forEach((e) => e.classList.add("log_active"));
            $login.classList.remove("log_active");
            $userName.textContent = localStorage.getItem("username");
        } else {
            $logout.forEach((e) => e.classList.remove("log_active"));
            $login.classList.add("log_active");
        }
    }

    loadCSS(h) {
        if (!document.querySelector(`link[href="./src/css/reset.css"]`)) {
            const resetCSS = document.createElement("link");
            resetCSS.rel = "stylesheet";
            resetCSS.href = `./src/css/reset.css`;
            document.head.appendChild(resetCSS);
        }
        if (!h) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `./src/css/home.css`;
            document.head.appendChild(link);
            return;
        };
        if (!document.querySelector(`link[href="./src/css/${h}.css"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `./src/css/${h}.css`;
            document.head.appendChild(link);
        }
    }

    removeCSS() {
        const existingCSS = document.querySelectorAll("link");
        existingCSS.forEach(css => {
            if (css.href.includes("reset.css")) return;
            if (css.href.includes("/src/css")){
                css.parentNode.removeChild(css);
            }
        });
    }

    render() {
        let currentHash = window.location.hash || "#/";
        if (!localStorage.getItem("username") && currentHash !== "#/signup") {
            currentHash = "#/login";
        }
        this.target.innerHTML = '<img src="./src/img/svg/loadingicon.svg" alt="loadingicon">';
        const found = this.routes.find(route => route.fragment == currentHash);
        if (found) {
            found.component();
            this.removeCSS();
            this.loadCSS(found.fragment.substring(2));
        }
        this.updateUserLogUI();
        this.setEventListener();
    }

    setState() {
        this.render();
        window.addEventListener("hashchange", () => this.render());
    }
}

const router = new Router();