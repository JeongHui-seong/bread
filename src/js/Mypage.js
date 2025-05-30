import DB from "./supabase.js";

export default class Mypage{
  constructor(target){
    this.target = target;
    this.db = new DB();
  }
  async fetchContentData() {
    const userKey = window.location.hash.split("/")[2];
    const page = window.location.hash.split("/")[1];
    const contentData = await this.db.fetchContent({userKey : userKey});

    if (page == "mypage" && contentData && contentData.length > 0) {
      this.data = await Promise.all(contentData.map((async (data) => {
        const likeData = await this.db.fetchLikes(data.post_id) || [];
        const userLiked = likeData.some(like => like.user_key == userKey);
        const commentData = await this.db.fetchComment(data.post_id) || [];
        console.log({ ...data, like_count: likeData.length , userLiked, likeData, commentData})

        return { ...data, like_count: likeData.length, userLiked, likeData, commentData };
      })));
    } else {
            console.log("데이터 없음");
    }
    }
  template(){
    return `<p>${this.data[0].users.user_name}님의 페이지</p>`
  }
  async render(target){
    const page = window.location.hash.split("/")[1];
    const postID = window.location.hash.split("/")[2];
    if (page == "mypage") {
      // this.db.realtimeFetchLikes(async () => {
      //   await this.render(this.target);
      // }, postID);
      // this.db.realtimeFetchComments(async () => {
      //   await this.render(this.target);
      // }, postID);
      await this.fetchContentData();
      target.innerHTML = this.template();
      // this.setEventListener();

      const $nav = document.getElementById("nav");
      $nav.querySelectorAll("*").forEach(el => el.removeAttribute("class"));
  }}
}