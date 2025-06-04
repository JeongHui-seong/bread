import DB from "./supabase.js";

export default class Content {
    constructor(target) {
        this.target = target;
        this.db = new DB();
        this.data = [];
        this.renderTimeout = null;
    }
    async fetchContentData() {
        const postID = window.location.hash.split("/")[2];
        const page = window.location.hash.split("/")[1];
        const contentData = await this.db.fetchContent({postID : postID});

        if (page == "content" && contentData && contentData.length > 0) {
            const userkey = sessionStorage.getItem("userkey");

            this.data = await Promise.all(contentData.map((async (post) => {
                const likeData = await this.db.fetchLikes(postID) || [];
                const userLiked = likeData.some(like => like.user_key == userkey);
                const commentData = await this.db.fetchComment(postID) || [];
                // console.log({ ...post, like_count: likeData.length , userLiked, likeData})

                return { ...post, like_count: likeData.length, userLiked, likeData, commentData };
            })));
        } else {
            console.log("데이터 없음");
        }
    }
    template() {
        return `
        <div class="alert_box">
            <p>정말 삭제하시겠습니까?</p>
            <div class="btn_box">
                <button class="btn_cancel">아니오</button>
                <button class="btn_ok">예</button>
            </div>
        </div>
        <div class="container" data-page="content">
            <div class="post_wrap" data-post-id = "${this.data[0].post_id}">
                <div class="content_box">
                    <div class="top_wrap">
                        <div class="left_wrap">
                            <a href="#/mypage/${this.data[0].user_key}" class="id">${this.data[0].users.user_name}</a>
                            <p class="date">
                                ${this.data[0].post_created.substring(0, 4)}년 
                                ${this.data[0].post_created.substring(5, 7)}월
                                ${this.data[0].post_created.substring(8, 10)}일 
                                ${Number(this.data[0].post_created.substring(11, 13)) + 9}:${this.data[0].post_created.substring(14, 16)}
                            </p>
                        </div>
                        <div class="right_wrap">
                            <button class="threedot">
                                <svg class="threedot" fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Glyph" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"/><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"/><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"/></svg>
                            </button>
                            <div class="popup">
                                <button class="btn_delete">삭제하기</button>
                            </div>
                        </div>
                    </div>
                    <div class="content_wrap">
                        <p class="content">${this.data[0].post_content.replace(/@[\w가-힣]+/g, match => `<strong>${match}</strong>`).replace(/\n/g, "<br>")}</p>
                    </div>
                    <div class="bottom_wrap">
                        <button class="like_wrap" data-likeClicked="${this.data[0].userLiked ? " true" : "false"}">
                            <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px"
                                viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
                                <path d="M67.607,13.462c-7.009,0-13.433,3.238-17.607,8.674c-4.174-5.437-10.598-8.674-17.61-8.674
                c-12.266,0-22.283,10.013-22.33,22.32c-0.046,13.245,6.359,21.054,11.507,27.331l1.104,1.349
                c6.095,7.515,24.992,21.013,25.792,21.584c0.458,0.328,1,0.492,1.538,0.492c0.539,0,1.08-0.165,1.539-0.492
                c0.8-0.571,19.697-14.069,25.792-21.584l1.103-1.349c5.147-6.277,11.553-14.086,11.507-27.331
                C89.894,23.475,79.876,13.462,67.607,13.462z" />
                            </svg>
                            <p>${this.data[0].like_count}</p>
                        </button>
                        <button class="reply_wrap">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.968 18.769C15.495 18.107 19 14.434 19 9.938a8.49 8.49 0 0 0-.216-1.912C20.718 9.178 22 11.188 22 13.475a6.1 6.1 0 0 1-1.113 3.506c.06.949.396 1.781 1.01 2.497a.43.43 0 0 1-.36.71c-1.367-.111-2.485-.426-3.354-.945A7.434 7.434 0 0 1 15 19.95a7.36 7.36 0 0 1-4.032-1.181z"
                                    fill="#000000" />
                                <path
                                    d="M7.625 16.657c.6.142 1.228.218 1.875.218 4.142 0 7.5-3.106 7.5-6.938C17 6.107 13.642 3 9.5 3 5.358 3 2 6.106 2 9.938c0 1.946.866 3.705 2.262 4.965a4.406 4.406 0 0 1-1.045 2.29.46.46 0 0 0 .386.76c1.7-.138 3.041-.57 4.022-1.296z"
                                    fill="#000000" />
                            </svg>
                            <p>${this.data[0].commentData.length}</p>
                        </button>
                    </div>
                </div>
                <div class="comment_box">
                    <div class="parent_wrap">
                        <textarea name="parent_comment" id="parent_comment" class="comment_area" spellcheck="false" placeholder="댓글을 입력해주세요"></textarea>
                        <button class="parent_submit">
                            <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" fill-rule="evenodd" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" clip-rule="evenodd"/></svg>
                        </button>
                    </div>
                    <div class="comment_wrap">
                        <p>댓글 ${this.data[0].commentData.length}</p>
                        <ul>
                        ${this.data[0].commentData.length == 0 ? "<li class = 'comment_list'>댓글이 없습니다. 첫 댓글을 작성해주세요!</li>" :
                this.data[0].commentData.filter(parent => parent.comm_parentid === null).map(parent =>
                    `<li class="comment_list parent" data-comment-id = ${parent.comm_id}>
                                <div class="top_wrap">
                                    <div class="left_wrap">
                                        <a href="#/mypage/${parent.user_key}"class="id">${parent.users.user_name}</a>
                                        <p class="date">
                                            ${parent.comm_created.substring(0, 4)}년 
                                            ${parent.comm_created.substring(5, 7)}월
                                            ${parent.comm_created.substring(8, 10)}일 
                                            ${Number(parent.comm_created.substring(11, 13)) + 9}:${parent.comm_created.substring(14, 16)}
                                        </p>
                                        ${sessionStorage.getItem("userkey") == parent.user_key ? '<div class = "identifier mycomment">내댓글</div>' : parent.user_key == this.data[0].user_key ? '<div class = "identifier writer">작성자</div>' : ""}
                                    </div>
                                    <div class="right_wrap">
                                        <button class="threedot">
                                            <svg class="threedot" fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Glyph" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"/><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"/><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"/></svg>
                                        </button>
                                        <div class="popup">
                                            <button class="btn_delete">삭제하기</button>
                                        </div>
                                    </div>
                                </div>
                                <p class="content">${parent.comm_content.replace(/@[\w가-힣]+/g, match => `<strong>${match}</strong>`).replace(/\n/g, "<br>")}</p>
                                <button class="open_comment">댓글 남기기</button>
                                <div class="recomm_wrap">
                                    <textarea name="recomm_comment" id="recomm_comment" class="comment_area" spellcheck="false" placeholder="댓글을 입력해주세요"></textarea>
                                    <button class="recomm_submit">
                                        <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" fill-rule="evenodd" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" clip-rule="evenodd"/></svg>
                                    </button>
                                </div>
                                <ul class="child_comment_list">
                                    ${this.data[0].commentData.filter(child => child.comm_parentid === parent.comm_id)
                                        .sort((a,b) => new Date(a.comm_created.split('.')[0]) - new Date(b.comm_created.split('.')[0]))
                                        .map(child =>
                                        `
                                        <li class="comment_list" data-comment-id = ${child.comm_id}>
                                            <div class="top_wrap">
                                                <div class="left_wrap">
                                                    <a href="#/mypage/${child.user_key}" class="id">${child.users.user_name}</a>
                                                    <p class="date">
                                                        ${child.comm_created.substring(0, 4)}년 
                                                        ${child.comm_created.substring(5, 7)}월
                                                        ${child.comm_created.substring(8, 10)}일 
                                                        ${Number(child.comm_created.substring(11, 13)) + 9}:${child.comm_created.substring(14, 16)}
                                                    </p>
                                                    ${sessionStorage.getItem("userkey") == child.user_key ? '<div class = "identifier mycomment">내댓글</div>' : child.user_key == this.data[0].user_key ? '<div class = "identifier writer">작성자</div>' : ""}
                                                </div>
                                                <div class="right_wrap">
                                                    <button class="threedot">
                                                    <svg class="threedot" fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Glyph" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z" id="XMLID_287_"/><path d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z" id="XMLID_289_"/><path d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z" id="XMLID_291_"/></svg>
                                                    </button>
                                                    <div class="popup">
                                                        <button class="btn_delete">삭제하기</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="content">${child.comm_content.replace(/@[\w가-힣]+/g, match => `<strong>${match}</strong>`).replace(/\n/g, "<br>")}</p>
                                            <button class="open_comment">댓글 남기기</button>
                                            <div class="recomm_wrap">
                                                <textarea name="recomm_comment" id="recomm_comment" class="comment_area" spellcheck="false" placeholder="댓글을 입력해주세요"></textarea>
                                                <button class="recomm_submit">
                                                    <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#000000" fill-rule="evenodd" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" clip-rule="evenodd"/></svg>
                                                </button>
                                            </div>
                                        </li>`
                    ).join('')}
                                </ul>
                            </li>`
                ).join('')
            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>`
    }
    textareaHeight(pc) {
        pc.style.height = "60px";
        pc.style.height = pc.scrollHeight + "px";
    }
    clickLike(e) {
        const $likeIcon = e.querySelector("svg");
        const postID = window.location.hash.split("/")[2];
        let userKey = sessionStorage.getItem("userkey");
        let likeClicked = this.data[0].likeData.some(element => element.user_key === userKey);

        e.setAttribute("data-likeClicked", likeClicked ? "true" : "false");

        if (e.getAttribute("data-likeClicked") === "true") {
            $likeIcon.classList.add("like_active");
        } else {
            $likeIcon.classList.remove("like_active");
        }

        e.removeEventListener("click", this.handleLikeClick);
        e.addEventListener("click", this.handleLikeClick.bind(this, e, $likeIcon, postID, userKey));
    }
    async handleLikeClick(e, $likeIcon, dataPostID, userKey) {
        let fetchLikeClicked = this.data[0].likeData.some(element => element.user_key === userKey);

        if (!fetchLikeClicked) {
            $likeIcon.classList.add("like_active");
            await this.db.insertLikes(dataPostID, userKey);
            this.data[0].likeData.push({ user_key: userKey });
            this.data[0].like_count += 1;
        } else {
            $likeIcon.classList.remove("like_active");
            await this.db.deleteLikes(dataPostID, userKey);
            this.data[0].likeData = this.data[0].likeData.filter(el => el.user_key !== userKey);
            this.data[0].like_count -= 1;
        }

        e.querySelector("p").textContent = this.data[0].like_count;
    }
    recommSubmit(e, userKey, postID) {
        const parentCommList = e.closest(".parent");
        const parentCommID = parentCommList.getAttribute("data-comment-id");
        const thisCommList = e.closest(".comment_list");
        const recommWrap = thisCommList.querySelector(".recomm_wrap");
        const recommTextarea = recommWrap.querySelector("#recomm_comment");

        if (recommTextarea.value.trim() == "") {
            alert("글을 입력해주세요");
        } else {
            this.db.insertComment(recommTextarea.value, userKey, postID, parentCommID);
            recommTextarea.value = "";
            recommWrap.classList.remove("recomm_on");
        }
    }
    handlePopup($wrap){
        const $Popup = $wrap.querySelector(".popup");
        
        $Popup.classList.toggle("popup_active");
    }
    setEventListener() {
        const commArea = document.querySelectorAll(".comment_area");
        const parentComment = document.getElementById("parent_comment");
        const btnParentCommentSubmit = document.querySelector(".parent_submit");
        const userKey = sessionStorage.getItem("userkey");
        const postID = window.location.hash.split("/")[2];
        const $likeWrap = document.querySelector(".like_wrap");
        const $btnOpenComm = document.querySelectorAll(".open_comment");
        const $btnRecommSubmit = document.querySelectorAll(".recomm_submit");
        const $threeDot = document.querySelectorAll(".threedot");
        const $contentThreedotWrap = document.querySelector(".content_box .top_wrap .right_wrap");
        const $commThreedotWrap = document.querySelectorAll(".comment_wrap .top_wrap .right_wrap");
        const $alertBox = document.querySelector(".alert_box");
        const $alertBtnCancel = document.querySelector(".alert_box .btn_box .btn_cancel");
        const $alertBtnOK = document.querySelector(".alert_box .btn_box .btn_ok");
        const userComments = this.data[0].commentData.filter(data => data.user_key == userKey);
        const $popups = document.querySelectorAll(".popup");
        let commentID = '';
        
        if (userKey == this.data[0].user_key) {
            $contentThreedotWrap.classList.add("threedot_active");
        } else {
            $contentThreedotWrap.classList.remove("threedot_active");
        }

        $commThreedotWrap.forEach($wrap => {
            const commentID = $wrap.closest(".comment_list").getAttribute("data-comment-id");
            const Mine = userComments.some(comment => comment.comm_id == commentID);
            
            if (Mine) {
                $wrap.classList.add("threedot_active");
            } else {
                $wrap.classList.remove("threedot_active");
            }
        });

        this.clickLike($likeWrap);

        $threeDot.forEach(e => 
            e.addEventListener("click", (e) => {
                e.stopPropagation();
                if(e.target.closest(".comment_list")){
                    commentID = e.target.closest(".comment_list").getAttribute("data-comment-id");
                    this.handlePopup(e.target.closest(".right_wrap"));
                } else{
                    this.handlePopup(e.target.closest(".content_box").querySelector(".right_wrap"));
                }
            }));

        document.addEventListener("click", (e) => {
            $popups.forEach(popup => {
                if (!popup.contains(e.target) && !$alertBox.contains(e.target)){
                    popup.classList.remove("popup_active");
                }
            });
            if (!$alertBox.contains(e.target)){
                $alertBox.classList.remove("alert_active");
            }
        });

        commArea.forEach((e) => {
            e.addEventListener("input", () => {
                this.textareaHeight(e);
            });
        });

        btnParentCommentSubmit.addEventListener("click", () => {
            if (parentComment.value.trim() == "") {
                alert("글을 입력해주세요");
            } else {
                this.db.insertComment(parentComment.value, userKey, postID);
                parentComment.value = "";
            }
        });

        $btnOpenComm.forEach((e) => {
            e.addEventListener("click", () => {
                const parentCommList = e.closest(".comment_list");
                const parentCommID = parentCommList.querySelector(".top_wrap .id");
                const recommWrap = parentCommList.querySelector(".recomm_wrap");
                const recommWrapTextarea = recommWrap.querySelector(".comment_area");
                recommWrap.classList.toggle("recomm_on");
                recommWrapTextarea.value = `@${parentCommID.textContent} `;
            });
        });

        $btnRecommSubmit.forEach((e) => {
            e.addEventListener("click", () => {
                this.recommSubmit(e, userKey, postID);
            });
        });

        $popups.forEach(popup => popup.addEventListener("click", (e) => {
            e.stopPropagation();
            $alertBox.classList.add("alert_active");
        }));

        $alertBtnCancel.addEventListener("click", (e) => {
            e.stopPropagation();
            $alertBox.classList.remove("alert_active");
        });

        $alertBtnOK.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (commentID == '') {
                await this.db.deletePost({postID : postID});
                window.location.hash = "#/";
            } else {
                await this.db.deleteComment({commentID : commentID});
            }
            $alertBox.classList.remove("alert_active");
        });
    }
    async render(target) {
        const page = window.location.hash.split("/")[1];
        if (page == "content") {
            this.db.realtimeFetchLikes(async () => {
                clearTimeout(this.renderTimeout);
                this.renderTimeout = setTimeout(() => this.render(this.target), 100);
                console.log("렌더링 ok")
            });
            this.db.realtimeFetchComments(async () => {
                clearTimeout(this.renderTimeout);
                this.renderTimeout = setTimeout(() => this.render(this.target), 100);
                console.log("렌더링 ok")
            });
            await this.fetchContentData();
            target.innerHTML = this.template();
            this.setEventListener();

            const $nav = document.getElementById("nav");
            $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
        }
    }
}