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
            <li><a href="#/">
            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3s-6.186 5.34-9.643 8.232c-.203.184-.357.452-.357.768 0 .553.447 1 1 1h2v7c0 .553.447 1 1 1h3c.553 0 1-.448 1-1v-4h4v4c0 .552.447 1 1 1h3c.553 0 1-.447 1-1v-7h2c.553 0 1-.447 1-1 0-.316-.154-.584-.383-.768-3.433-2.892-9.617-8.232-9.617-8.232z"/>
            </svg>
            홈</a></li>
            <li><a href="#/search">
            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill="#000000" fill-rule="evenodd" d="M9.33095244,9.33095244 C10.5370132,8.12489168 10.5370132,6.16948083 9.33095244,4.96342007 C8.12489168,3.75735931 6.16948083,3.75735931 4.96342007,4.96342007 C3.75735931,6.16948083 3.75735931,8.12489168 4.96342007,9.33095244 C6.16948083,10.5370132 8.12489168,10.5370132 9.33095244,9.33095244 Z M9.98606911,11.4419132 C7.98755133,12.7659816 5.26838878,12.5476094 3.50757595,10.7867966 C1.49747468,8.7766953 1.49747468,5.51767722 3.50757595,3.50757595 C5.51767722,1.49747468 8.7766953,1.49747468 10.7867966,3.50757595 C12.5476094,5.26838878 12.7659816,7.98755133 11.4419132,9.98606911 L13.6984848,12.2426407 C14.1005051,12.6446609 14.1005051,13.2964646 13.6984848,13.6984848 C13.2964646,14.1005051 12.6446609,14.1005051 12.2426407,13.6984848 L9.98606911,11.4419132 L9.98606911,11.4419132 Z"/>
            </svg>
            검색</a></li>
            <li><a href="#/notice">
            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
            <path d="M67.607,13.462c-7.009,0-13.433,3.238-17.607,8.674c-4.174-5.437-10.598-8.674-17.61-8.674
                c-12.266,0-22.283,10.013-22.33,22.32c-0.046,13.245,6.359,21.054,11.507,27.331l1.104,1.349
                c6.095,7.515,24.992,21.013,25.792,21.584c0.458,0.328,1,0.492,1.538,0.492c0.539,0,1.08-0.165,1.539-0.492
                c0.8-0.571,19.697-14.069,25.792-21.584l1.103-1.349c5.147-6.277,11.553-14.086,11.507-27.331
                C89.894,23.475,79.876,13.462,67.607,13.462z"/>
            </svg>
            알림</a></li>
            <li><a href="#/post">
            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10h-4v-4c0-1.104-.896-2-2-2s-2 .896-2 2l.071 4h-4.071c-1.104 0-2 .896-2 2s.896 2 2 2l4.071-.071-.071 4.071c0 1.104.896 2 2 2s2-.896 2-2v-4.071l4 .071c1.104 0 2-.896 2-2s-.896-2-2-2z"/>
            </svg>
            글쓰기</a></li>
        </ul>
    </nav>
    <ul class = "user_log">
        <li class = "go_mypage logout"><a href="#/">${sessionStorage.getItem("username")}</a></li>
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
        sessionStorage.removeItem("username");
        $userName.textContent = '';
        window.location.hash = "#/login";
    }

    updateUserLogUI() {
        const $logout = document.querySelectorAll(".logout");
        const $login = document.querySelector(".login");
        const $userName = document.querySelector(".go_mypage a");
        if (sessionStorage.getItem("username")) {
            $logout.forEach((e) => e.classList.add("log_active"));
            $login.classList.remove("log_active");
            $userName.textContent = sessionStorage.getItem("username");
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
        if (!sessionStorage.getItem("username") && currentHash !== "#/signup") {
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