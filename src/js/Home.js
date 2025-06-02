import DB from "./supabase.js";

export default class Home {
    constructor(target) {
        this.target = target;
        this.db = new DB();
        this.posts = [];
        const page = window.location.hash;
        let renderTimeout = null;

        if (page == "#/"){
            this.db.realtimeFetchLikes(async () => {
                clearTimeout(renderTimeout);
                renderTimeout = setTimeout(() => this.render(this.target), 100);
                // console.log("렌더링 ok")
            });
            this.db.realtimeFetchComments(async () => {
                clearTimeout(renderTimeout);
                renderTimeout = setTimeout(() => this.render(this.target), 100);
                // console.log("렌더링 ok")
            });
        }
    }

    async fetchPostData() {
        const postData = await this.db.fetchContent({});

        if (postData && postData.length > 0) {
            const userkey = sessionStorage.getItem("userkey");

            this.posts = await Promise.all(postData.map((async (post) => {
                const likeData = await this.db.fetchLikes(post.post_id) || [];
                const userLiked = likeData.some(like => like.user_key == userkey);
                const commentData = await this.db.fetchComment(post.post_id) || [];

                // console.log({ ...post, like_count: likeData.length , userLiked, likeData, comment_count : commentData.length})

                return { ...post, like_count: likeData.length , userLiked, likeData, comment_count : commentData.length};
            })));
        } else {
            console.log("데이터 없음");
        }
    }

    template() {
        return `<div class="container" data-page = "Home">
        <div class="post_wrap">
        <ul>
        ${this.posts.length == 0 ? "<li class = 'post_list'>불러올 글이 없습니다. 첫 게시물을 써보시겠습니까?</li>" :
                this.posts.map(post =>
                    `
                <li class="post_list" data-post-id=${post.post_id}>
                    <div class="top_wrap">
                        <a href="#/mypage/${post.user_key}" class = "id">${post.users.user_name}</a>
                            <p class = "date">
                            ${post.post_created.substring(0, 4)}년 
                            ${post.post_created.substring(5, 7)}월
                            ${post.post_created.substring(8, 10)}일 
                            ${Number(post.post_created.substring(11, 13)) + 9}:${post.post_created.substring(14, 16)}
                            </p>
                    </div>
                    <a href="#/content/${post.post_id}">
                        <div class="content_wrap">
                            <p class="content">${post.post_content.replace(/\n/g, "<br>")}</p>
                        </div>
                    </a>
                    <div class="bottom_wrap">
                        <button class="like_wrap" data-likeClicked="${post.userLiked ? "true" : "false"}">
                            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                            <path d="M67.607,13.462c-7.009,0-13.433,3.238-17.607,8.674c-4.174-5.437-10.598-8.674-17.61-8.674
                            c-12.266,0-22.283,10.013-22.33,22.32c-0.046,13.245,6.359,21.054,11.507,27.331l1.104,1.349
                            c6.095,7.515,24.992,21.013,25.792,21.584c0.458,0.328,1,0.492,1.538,0.492c0.539,0,1.08-0.165,1.539-0.492
                            c0.8-0.571,19.697-14.069,25.792-21.584l1.103-1.349c5.147-6.277,11.553-14.086,11.507-27.331
                            C89.894,23.475,79.876,13.462,67.607,13.462z"/>
                            </svg>
                            <p>${post.like_count}</p>
                        </button>
                        <button class="reply_wrap">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.968 18.769C15.495 18.107 19 14.434 19 9.938a8.49 8.49 0 0 0-.216-1.912C20.718 9.178 22 11.188 22 13.475a6.1 6.1 0 0 1-1.113 3.506c.06.949.396 1.781 1.01 2.497a.43.43 0 0 1-.36.71c-1.367-.111-2.485-.426-3.354-.945A7.434 7.434 0 0 1 15 19.95a7.36 7.36 0 0 1-4.032-1.181z" fill="#000000"/>
                            <path d="M7.625 16.657c.6.142 1.228.218 1.875.218 4.142 0 7.5-3.106 7.5-6.938C17 6.107 13.642 3 9.5 3 5.358 3 2 6.106 2 9.938c0 1.946.866 3.705 2.262 4.965a4.406 4.406 0 0 1-1.045 2.29.46.46 0 0 0 .386.76c1.7-.138 3.041-.57 4.022-1.296z" fill="#000000"/>
                            </svg>
                            <p>${post.comment_count}</p>
                        </button>
                    </div>
                </li>
                `
                ).join('')}
            </ul>
            </div>
            </div>`
    }

    clickLike(e) {
        const $likeIcon = e.querySelector("svg");
        let dataPostID = e.closest(".post_list").getAttribute("data-post-id");
        let userKey = sessionStorage.getItem("userkey");    

        if (e.getAttribute("data-likeClicked") == "true"){
            $likeIcon.classList.add("like_active");
        }
        
        e.removeEventListener("click", this.handleLikeClick);
        e.addEventListener("click", this.handleLikeClick.bind(this, e, $likeIcon, dataPostID, userKey));
    }

    handleLikeClick(e, $likeIcon, dataPostID, userKey){
        const isLiked = e.getAttribute("data-likeClicked") == "true";
        e.setAttribute("data-likeClicked", isLiked ? "false" : "true");

        if(!isLiked){
            $likeIcon.classList.add("like_active");
            this.db.insertLikes(dataPostID, userKey);
        } else{
            $likeIcon.classList.remove("like_active");
            this.db.deleteLikes(dataPostID, userKey);
        }

        const post = this.posts.find(p => p.post_id == dataPostID);
        if (post) {
            post.like_count += isLiked ? -1 : 1;
            e.querySelector("p").textContent = post.like_count;
        }
    }

    setEventListener() {
        const $likeWrap = document.querySelectorAll(".like_wrap");
        $likeWrap.forEach((e) => {
            this.clickLike(e);
        });
    }

    async render(target) {
        const page = window.location.hash;
        if (page == "#/"){
            if (sessionStorage.getItem("username")) {
                await this.fetchPostData();
            } else {
                return;
            }
            target.innerHTML = this.template();
            this.setEventListener();
            
            const $nav = document.getElementById("nav");
            const $navTagA = document.querySelector("#nav li:nth-of-type(2) a");
            const $navTagSvg = document.querySelector("#nav li:nth-of-type(2) a svg path");

            $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
            $navTagA.classList.add("a_on");
            $navTagSvg.classList.add("svg_on");
        }
    }
}