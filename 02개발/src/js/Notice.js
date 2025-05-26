export default class Notice {
    constructor(target) {
        this.target = target;
        this.render(target);
    }
    template() {
        return `알림`
    }
    render(target) {
        target.innerHTML = this.template();
    }
}