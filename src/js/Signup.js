import DB from "./supabase.js";

export default class Signup {
    IDValid;
    PWValid;
    PWCheckValid;
    NameValid;
    PNValid;

    constructor(target) {
        this.IDValid = false;
        this.PWValid = false;
        this.PWCheckValid = false;
        this.NameValid = false;
        this.PNValid = false;
        this.target = target;
        this.render(target);

        this.db = new DB();
        this.userInfo;
    }

    template() {
        return `
        <div class="container">
            <h3 class="title">회원가입</h3>
            <div class="id_container wrap">
                <label for="id">아이디 (영문, 숫자 포함 6글자 이상)</label>
                <input type="text" id="id">
                <button id="check_id">중복확인</button>
            </div>
            <div class="wrap">
                <label for="password">비밀번호 (영문, 숫자 포함 6글자 이상)</label>
                <input type="password" id="password">
            </div>
            <div class="wrap">
                <label for="check_password">비밀번호 재확인</label>
                <input type="password" id="check_password">
            </div>
            <div class="wrap">
                <label for="name">이름</label>
                <input type="text" id="name">
            </div>
            <div class="wrap">
                <label for="phonenumber">전화번호 (숫자만 입력)</label>
                <input type="text" id="phonenumber">
            </div>
            <button id="btn_signup">회원가입하기</button>
        </div>`
    }

    conAddWrong(input) {
        const label = input.closest("div").querySelector("label");
        input.classList.add("inp_wrong");
        label.classList.add("label_wrong");
    }

    conRemoveAll(input) {
        const label = input.closest("div").querySelector("label");
        input.classList.remove("inp_correct", "inp_wrong");
        label.classList.remove("label_correct", "label_wrong");
    }

    conAWRC(input) {
        const label = input.closest("div").querySelector("label");
        input.classList.add("inp_wrong");
        label.classList.add("label_wrong");
        input.classList.remove("inp_correct");
        label.classList.remove("label_correct");
    }

    conACRW(input) {
        const label = input.closest("div").querySelector("label");
        input.classList.add("inp_correct");
        label.classList.add("label_correct");
        input.classList.remove("inp_wrong");
        label.classList.remove("label_wrong");
    }

    setEventListener() {
        const $signupInpID = document.getElementById("id");
        const $signupInpPW = document.getElementById("password");
        const $signupBtnCheckID = document.getElementById("check_id");
        const $signupInp = document.querySelectorAll(".wrap input");
        const $signupBtn = document.getElementById("btn_signup");
        const $signupInpCheckPW = document.getElementById("check_password");
        const $signupInpName = document.getElementById("name");
        const $signupInpPN = document.getElementById("phonenumber");

        $signupInpID.addEventListener("focus", (e) => this.validateInput(e.target, true));
        $signupInpID.addEventListener("blur", (e) => this.validateInput(e.target));
        $signupInpID.addEventListener("input", (e) => this.validateInput(e.target, true));
        $signupInpPW.addEventListener("focus", (e) => this.PWValid = this.validateInput(e.target, true));
        $signupInpPW.addEventListener("blur", (e) => this.PWValid = this.validateInput(e.target));
        $signupInpPW.addEventListener("input", (e) => this.PWValid = this.validateInput(e.target, true));

        $signupInpCheckPW.addEventListener("input", (e) => this.PWCheckValid = this.validateInput(e.target, true));
        $signupInpCheckPW.addEventListener("focus", (e) => this.PWCheckValid = this.validateInput(e.target, true));
        $signupInpCheckPW.addEventListener("blur", (e) => this.PWCheckValid = this.validateInput(e.target));

        $signupInpName.addEventListener("input", (e) => this.NameValid = this.validateInput(e.target, true));
        $signupInpName.addEventListener("focus", (e) => this.NameValid = this.validateInput(e.target, true));
        $signupInpName.addEventListener("blur", (e) => this.NameValid = this.validateInput(e.target));

        $signupInpPN.addEventListener("input", (e) => this.PNValid = this.validateInput(e.target, true));
        $signupInpPN.addEventListener("focus", (e) => this.PNValid = this.validateInput(e.target, true));
        $signupInpPN.addEventListener("blur", (e) => this.PNValid = this.validateInput(e.target));

        $signupInp.forEach(e => e.addEventListener("input", () => {
            this.signupCheckLabel(e);
            this.checkSignupBtn();
        }));
        $signupBtnCheckID.addEventListener("click", () => this.IDValid = this.signupCheckID());
        $signupInpID.addEventListener("input", this.signupFillID);
        $signupBtn.addEventListener("click", () => {
            this.db.InsertUser($signupInpID.value, $signupInpPW.value, $signupInpName.value, $signupInpPN.value);
            alert("회원가입 성공");
            window.location.hash = "#/login";
            this.IDValid = false;
            this.NameValid = false;
            this.PNValid = false;
            this.PWCheckValid = false;
            this.PWValid = false;
        });
    }

    signupFillID() {
        const $signupBtnCheckID = document.getElementById("check_id");
        const $signupInpID = document.getElementById("id");
        const idpwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (idpwRegex.test($signupInpID.value)) {
            $signupBtnCheckID.classList.add("fill_id");
            $signupBtnCheckID.disabled = false;
        } else {
            $signupBtnCheckID.classList.remove("fill_id");
            $signupBtnCheckID.disabled = true;
        }
    };

    signupCheckLabel(element) {
        if (element.value.trim() !== "") {
            element.closest("div").querySelector("label").classList.add("value_fill");
        } else {
            element.closest("div").querySelector("label").classList.remove("value_fill");
        }
    };

    async signupCheckID() {
        const $signupInpID = document.getElementById("id");
        this.IDValid = await this.db.DBIDCheck($signupInpID.value);
        if (!this.IDValid) {
            $signupInpID.value = '';
            this.signupFillID;
            this.signupCheckLabel($signupInpID);
            return false;
        } else {
            return true;
        }
    };

    checkSignupBtn() {
        // console.log(this.IDValid, this.PWValid, this.PWCheckValid, this.NameValid, this.PNValid)
        const $signupBtn = document.getElementById("btn_signup");
        if (this.IDValid && this.PWValid && this.PWCheckValid && this.NameValid && this.PNValid) {
            $signupBtn.classList.add("fill_id");
        } else {
            $signupBtn.classList.remove("fill_id");
        }
    };

    validateInput(input, isFocus = false) {
        const idpwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const pnRegex = /^\d{11,}$/;
        const $signupInpPW = document.getElementById("password");
        let isValid;

        if (input.id == "id") isValid = idpwRegex.test(input.value.trim());
        if (input.id == "password") isValid = idpwRegex.test(input.value.trim());
        if (input.id == "check_password") isValid = input.value.trim() == $signupInpPW.value;
        if (input.id == "name") isValid = input.value.trim().length > 1;
        if (input.id == "phonenumber") isValid = pnRegex.test(input.value.trim());

        return this.updateInputUI(input, isFocus, isValid);
    }

    updateInputUI(input, isFocus, isValid) {
        if (isFocus && input.value.trim() == "") {
            this.conAddWrong(input);
            return false
        } else {
            if (input.value.trim() == '') {
                this.conRemoveAll(input);
                return false;
            } else if (!isValid) {
                this.conAWRC(input);
                return false;
            } else {
                this.conACRW(input);
                return true;
            }
        }
    }

    render(target) {
        target.innerHTML = this.template();
        this.setEventListener();
    }
}