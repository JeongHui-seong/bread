import DB from "./supabase.js";

export default class Home {
    constructor(target) {
        this.target = target;
        this.db = new DB();
        this.posts = [];
        this.likes = [];
    }
    
    async fetchPostData(){
        let postData = await this.db.fetchPosts();

        if (postData && postData.length > 0){
            this.posts = postData;
        } else {
            console.log("데이터 없음");
        }
    }

    async fetchLikes(){
        let likeData = await this.db.fetchLikes("a52023e4-7111-4262-94c3-2e7ace510fef");
        this.likes = likeData;
        console.log(this.likes);
    }

    template() {
        return `<div class="container">
    <div class="post_wrap">
        <ul>
            ${this.posts.length == 0 ? "<li class = 'post_list'>불러올 글이 없습니다. 첫 게시물을 써보시겠습니까?</li>" :
                this.posts.map(post=>
                `
            <li class="post_list" data-post-id=${post.post_id}>
                <div class="top_wrap">
                    <button class = "id">${post.users.user_name}</button>
                    <p class = "date">
                    ${post.post_created.substring(0,4)}년 
                    ${post.post_created.substring(5,7)}월
                    ${post.post_created.substring(8,10)}일 
                    ${Number(post.post_created.substring(11,13))+9}:${post.post_created.substring(14,16)}
                    </p>
                </div>
                <div class="content_wrap">
                    <p class="content">${post.post_content.replace(/\n/g,"<br>")}</p>
                </div>
                <div class="bottom_wrap">
                    <button class="like_wrap"><img src="./src/img/svg/hearticon.svg" alt="hearticon"><p>0</p></button>
                    <button class="reply_wrap"><img src="./src/img/svg/replyicon.svg" alt="replyicon"><p>0</p></button>
                </div>
            </li>
                `
            ).join('')}
        </ul>
    </div>
</div>`
    }

    async render(target) {
        if (localStorage.getItem("username")){
            await this.fetchPostData();
            await this.fetchLikes();
        } else{
            return;
        }
        target.innerHTML = this.template();
    }
}