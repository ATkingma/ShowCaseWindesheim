class GDPR {
    constructor() {
        this.init();
    }

    async init() {
        const status = await GDPR.cookieStatus(); // Wacht op correcte waarde

        if (status === 'accept' || status === 'reject') {
            this.hideGDPR();
            return;
        }

        this.showGDPR();
        this.bindEvents();
        this.showStatus();
        this.showContent();
    }

    bindEvents() {
        const buttonAccept = document.querySelector('.gdpr-consent__button--accept');
        const buttonReject = document.querySelector('.gdpr-consent__button--reject');

        if (buttonAccept) {
            buttonAccept.addEventListener('click', async () => {
                await GDPR.cookieStatus('accept');
                this.updateUI();
            });
        }

        if (buttonReject) {
            buttonReject.addEventListener('click', async () => {
                await GDPR.cookieStatus('reject');
                this.updateUI();
            });
        }
    }

    async updateUI() {
        this.showStatus();
        this.showContent();
        this.hideGDPR();
    }

    async showContent() {
        const status = await GDPR.cookieStatus();
        if (status === 'accept') {
            console.log("Cookies accepted: Content can be personalized.");
        } else if (status === 'reject') {
            console.log("Cookies rejected: Content remains generic.");
        } else {
            console.log("No cookie choice made yet.");
        }
    }

    async showStatus() {
        const status = await GDPR.cookieStatus();
        console.log(status === null ? 'Niet gekozen' : status);
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

    static async cookieStatus(status = null) {
        if (status !== null) {
            await GDPR.handleCookie('gdpr-consent-choice', status);
        }
        return await GDPR.handleCookie('gdpr-consent-choice');
    }

    static async handleCookie(name, value = null, days = 365) {
        if (value !== null) {
            document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${new Date(Date.now() + days * 86400000).toUTCString()}; path=/; Secure; SameSite=Strict`;

            await fetch(`/Cookie/SetCookie?name=${encodeURIComponent(name)}&value=${encodeURIComponent(value)}&days=${days}`, {
                method: 'GET',
                credentials: 'same-origin' 
            });
        } else {
            const cookies = document.cookie.split('; ').map(cookie => cookie.split('='));
            for (let [key, val] of cookies) {
                if (key === encodeURIComponent(name)) return decodeURIComponent(val);
            }

            try {
                const response = await fetch(`/Cookie/GetCookie?name=${encodeURIComponent(name)}`, {
                    credentials: 'same-origin' 
                });

                if (response.ok) {
                    return await response.text(); 
                }
            } catch (error) {
                console.error("Error fetching cookie:", error);
            }

            return null; 
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new GDPR();
});
