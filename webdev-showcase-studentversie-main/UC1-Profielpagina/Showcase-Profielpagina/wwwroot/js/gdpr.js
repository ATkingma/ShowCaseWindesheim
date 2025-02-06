class GDPR {
    constructor() {
        if (GDPR.cookieStatus() === 'accept') {
            this.hideGDPR();
            return;
        } 


        this.showStatus();
        this.showContent();
        this.bindEvents();

        this.showGDPR();
        
    }

    bindEvents() {
        const buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        const buttonReject = document.querySelector('.gdpr-consent__button--reject');

        if (buttonAccept) {
            buttonAccept.addEventListener('click', () => {
                GDPR.cookieStatus('accept');
                this.showStatus();
                this.showContent();
                this.hideGDPR();
            });
        }

        if (buttonReject) {
            buttonReject.addEventListener('click', () => {
                GDPR.cookieStatus('reject');
                this.showStatus();
                this.showContent();
                this.hideGDPR();
            });
        }
    }

    showContent() {
        const status = GDPR.cookieStatus();
        if (status === 'accept') {
            console.log("Cookies accepted: Content can be personalized.");
        } else if (status === 'reject') {
            console.log("Cookies rejected: Content remains generic.");
        } else {
            console.log("No cookie choice made yet.");
        }
    }

    showStatus() {
        console.log(GDPR.cookieStatus() === null ? 'Niet gekozen' : GDPR.cookieStatus());
    }


    hideGDPR() {
        const gdprSection = document.querySelector('.gdpr-consent');
        if (gdprSection) {
            gdprSection.classList.add('hide');
            gdprSection.classList.remove('show');
        }
    }

    showGDPR() {
        const gdprSection = document.querySelector('.gdpr-consent');
        if (gdprSection) {
            gdprSection.classList.remove('hide');
            gdprSection.classList.add('show');
        }
    }

    static cookieStatus(status) {
        if (status) {
            localStorage.setItem("gdpr-consent-choice", status);
        }
        return localStorage.getItem("gdpr-consent-choice");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gdpr = new GDPR();
});
