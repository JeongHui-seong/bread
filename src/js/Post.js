import DB from "./supabase.js"

export default class Post {
    constructor(target) {
        this.target = target;

        this.db = new DB();
    }
    template() {
        return `
        <div class="container" data-page="post">
        <textarea name="content" id="content" spellcheck = "false" placeholder="욕설, 비방 등 상대방을 불쾌하게 하는 게시물은 작성하지 말아주세요. "></textarea>
        <button class="btn_submit">글쓰기</button>
        </div>
        `
    }
    async writePost() {
        const $contentArea = document.getElementById("content");
        if ($contentArea.value == 0) {
            alert("내용을 입력해주세요");
        }
        else {
            const success = await this.db.insertPost($contentArea.value);
            if (success) {
                window.location.hash = "#/";
            } else {
                alert("글쓰기 실패");
            }
        }
    }
    setEventListener() {
        const $btnSubmit = document.querySelector(".btn_submit");
        $btnSubmit.addEventListener("click", async () => {
            this.writePost();
        });
    }
    render(target) {
        target.innerHTML = this.template();
        this.setEventListener();
    }
}