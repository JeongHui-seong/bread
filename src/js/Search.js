export default class Search {
    constructor(target) {
        this.target = target;
    }
    template() {
        return `검색(만드는중)`
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/search"){
            target.innerHTML = this.template();
        }
    }
}