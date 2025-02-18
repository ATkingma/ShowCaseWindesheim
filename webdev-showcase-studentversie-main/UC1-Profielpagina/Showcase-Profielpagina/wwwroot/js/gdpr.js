class GDPR {
    constructor() {
        this.init();
    }

    async init() {
        const status = await GDPR.cookieStatus();

        if (status === 'accept' || status === 'reject') {
            this.hideGDPR();
            return;
        }

        this.showGDPR();
        this.bindEvents();
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
        this.hideGDPR();
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

            const response = await fetch(`/Cookie/SetCookie?name=${encodeURIComponent(name)}&value=${encodeURIComponent(value)}&days=${days}`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    value: value,
                    days: days
                })
            });

            if (response.ok) {
                console.log("Cookie set successfully on the server.");
            } else {
                console.error("Error setting cookie on the server.");
            }
        } else {
            const cookies = document.cookie.split('; ').map(cookie => cookie.split('='));
            for (let [key, val] of cookies) {
                if (key === encodeURIComponent(name)) return decodeURIComponent(val);
            }

            try {
                const response = await fetch(`/Cookie/GetCookie?name=${encodeURIComponent(name)}`, {
                    method: 'GET',
                    credentials: 'same-origin',
                });

                if (response.status === 200) {
                    const cookieValue = await response.text();
                    if (cookieValue) {
                        return cookieValue;
                    } else {
                        console.warn("Cookie value is empty.");
                        return null;
                    }
                } else if (response.status === 404) {
                    console.log("Cookie not found on the server. This is expected if it hasn't been set yet.");
                    return null;
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
