import DB from "./supabase.js";

export default class Notice {
    constructor(target) {
        this.target = target;
        this.db = new DB();
        this.renderTimeout = null;
        this.data = [];
        this.checkNotice = false;
    }
    async fetchMyNotice(){
        const userKey = sessionStorage.getItem("userkey");
        const myPost = await this.db.fetchContent({userKey : userKey});
        this.data = await Promise.all(myPost.map(async(post) => {
            const getLike = await this.db.fetchLikes({postID : post.post_id}) || [];
            const getComment = await this.db.fetchComment(post.post_id) || [];
            // console.log({...post, getLike, getComment});
            return {...post, getLike, getComment};
        }));
        // console.log(this.data)
    }
    template() {
        const userKey = sessionStorage.getItem("userkey");
        const divNotice = this.data.flatMap(data => {
            const likeData = data.getLike.filter(like => like.user_key !== userKey)
                .map(like =>({
                type : "like",
                created : like.like_created,
                postID : like.post_id,
                userName : like.users.user_name
            }));
            const commentData = data.getComment.filter(comment => comment.user_key !== userKey)
                .map(comment =>({
                type : "comment",
                content : comment.comm_content,
                created : comment.comm_created,
                userName : comment.users.user_name,
                postID : comment.post_id
            }));
            return [...likeData, ...commentData];
        });
        const sorted = divNotice.sort((a,b) => new Date(b.created) - new Date(a.created));
        return `
        <div class="container">
            <ul>
                ${sorted.map(data => {
                    console.log(data)
                    if (data.type == "like") {
                        return `<a href="#/content/${data.postID}">
                            <li class="notice_list">
                                <div class="top_wrap">
                                    <p class="notice"><strong>${data.userName}</strong>님이 게시글에 좋아요를 남겼습니다.</p>
                                        <p class="date">
                                            ${data.created.substring(0, 4)}년 
                                            ${data.created.substring(5, 7)}월
                                            ${data.created.substring(8, 10)}일 
                                            ${Number(data.created.substring(11, 13)) + 9}:${data.created.substring(14, 16)}
                                        </p>
                                </div>
                            </li>
                        </a>`
                    } else if (data.type == "comment") {
                        return `<a href="#/content/${data.postID}">
                            <li class="notice_list">
                                <div class="top_wrap">
                                    <p class="notice"><strong>${data.userName}</strong>님이 게시글에 댓글을 작성하셨습니다.</p>
                                        <p class="date">
                                            ${data.created.substring(0, 4)}년 
                                            ${data.created.substring(5, 7)}월
                                            ${data.created.substring(8, 10)}일 
                                            ${Number(data.created.substring(11, 13)) + 9}:${data.created.substring(14, 16)}
                                        </p>
                                </div>
                                <div class="bottom_wrap">
                                    <p class="comment">${data.content.replace(/\n/g, "<br>")}</p>
                                </div>
                            </li>
                        </a>`
                    }
                }).join('')}
            </ul>
        </div>
        `
    }
    async render(target) {
        const page = window.location.hash;
        if (page == "#/notice"){
            this.db.realtimeFetchLikes(async () => {
                clearTimeout(this.renderTimeout);
                this.renderTimeout = setTimeout(() => this.render(this.target), 100);
            });
            this.db.realtimeFetchComments(async () => {
                clearTimeout(this.renderTimeout);
                this.renderTimeout = setTimeout(() => this.render(this.target), 100);
            });
            await this.fetchMyNotice();
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