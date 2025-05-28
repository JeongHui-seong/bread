export default class Search {
    constructor(target) {
        this.target = target;
        this.render(target);
    }
    template() {
        return `검색(만드는중)`
    }
    render(target) {
        target.innerHTML = this.template();
    }
}