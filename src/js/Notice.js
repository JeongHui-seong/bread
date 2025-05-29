export default class Notice {
    constructor(target) {
        this.target = target;
    }
    template() {
        return `알림(만드는중)`
    }
    render(target) {
        const page = window.location.hash;
        if (page == "#/notice"){
            target.innerHTML = this.template();
        }
    }
}