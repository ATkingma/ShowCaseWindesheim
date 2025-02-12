async function loadRecaptcha() {
    try {
        const response = await fetch('/api/recaptcha-sitekey');
        const data = await response.json();

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${data.siteKey}`;

        script.onload = function () {
            grecaptcha.ready(function () {
                console.log("reCAPTCHA is ready!");
            });
        };

        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading reCAPTCHA script:', error);
    }
}

loadRecaptcha();
