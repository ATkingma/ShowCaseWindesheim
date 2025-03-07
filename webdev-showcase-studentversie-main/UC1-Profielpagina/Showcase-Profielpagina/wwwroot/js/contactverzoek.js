﻿
const inputEmail = document.getElementById('email');
const inputSubject = document.getElementById('subject');
const inputFirstName = document.getElementById('firstname');
const inputLastName = document.getElementById('lastname');
const inputPhone = document.getElementById('phone');
const inputMessage = document.getElementById('message');
const response = await fetch('/api/recaptcha-sitekey');
const data = await response.json();

const sitekey = data.siteKey;

const validateEmail = () => {
    if (inputEmail.validity.typeMismatch) {
        inputEmail.setCustomValidity("Voer een geldig e-mailadres in!");
        inputEmail.reportValidity();
        return false; 
    } else if (inputEmail.value.length > 80) {
        inputEmail.setCustomValidity("Email moet niet langer dan 80 tekens zijn!");
        inputEmail.reportValidity();
        return false;
    } else {
        inputEmail.setCustomValidity("");
        return true;
    }
};

const validateSubject = () => {
    if (inputSubject.value.trim() === "") {
        inputSubject.setCustomValidity("Onderwerp is verplicht.");
        inputSubject.reportValidity();
        return false; 
    } else if (inputSubject.value.length > 200) {
        inputSubject.setCustomValidity("Onderwerp mag niet langer dan 200 tekens zijn.");
        inputSubject.reportValidity();
        return false;
    } else {
        inputSubject.setCustomValidity("");
        return true; 
    }
};

const validateFirstName = () => {
    const nameRegex = /^[A-Za-zÀ-ÿ]+$/; 
    if (inputFirstName.value.trim() === "") {
        inputFirstName.setCustomValidity("Voornaam is verplicht.");
        inputFirstName.reportValidity();
        return false;
    } else if (inputFirstName.value.length > 60) {
        inputFirstName.setCustomValidity("Voornaam mag niet langer dan 60 tekens zijn.");
        inputFirstName.reportValidity();
        return false;
    } else if (!nameRegex.test(inputFirstName.value)) {
        inputFirstName.setCustomValidity("Voornaam mag alleen letters bevatten.");
        inputFirstName.reportValidity();
        return false;
    } else {
        inputFirstName.setCustomValidity("");
        return true;
    }
};


const validateLastName = () => {
    const nameRegex = /^[A-Za-zÀ-ÿ]+$/; 
    if (inputLastName.value.trim() === "") {
        inputLastName.setCustomValidity("Achternaam is verplicht.");
        inputLastName.reportValidity();
        return false;
    } else if (inputLastName.value.length > 60) {
        inputLastName.setCustomValidity("Achternaam mag niet langer dan 60 tekens zijn.");
        inputLastName.reportValidity();
        return false;
    } else if (!nameRegex.test(inputLastName.value)) {
        inputLastName.setCustomValidity("Achternaam mag alleen letters bevatten.");
        inputLastName.reportValidity();
        return false;
    } else {
        inputLastName.setCustomValidity("");
        return true;
    }
};


const validatePhone = () => {
    const phoneRegex = /^(?:\+(\d{1,3}))?(\d{9,15})$/;
    if (!phoneRegex.test(inputPhone.value)) {
        inputPhone.setCustomValidity("Vul een geldig telefoonnummer in (bijvoorbeeld 0612345678 of +31612345678).");
        inputPhone.reportValidity();
        return false;
    } else {
        inputPhone.setCustomValidity("");
        return true;
    }
};

const validateMessage = () => {
    if (inputMessage.value.trim() === "") {
        inputMessage.setCustomValidity("Bericht is verplicht.");
        inputMessage.reportValidity();
        return false; 
    } else if (inputMessage.value.length > 600) {
        inputMessage.setCustomValidity("Bericht mag niet langer dan 600 tekens zijn.");
        inputMessage.reportValidity();
        return false; 
    } else {
        inputMessage.setCustomValidity("");
        return true; 
    }
};

const validateForm = () => {
    let isValid = true; 

    isValid = isValid && validateEmail();
    isValid = isValid && validateSubject();
    isValid = isValid && validateFirstName();
    isValid = isValid && validateLastName();
    isValid = isValid && validatePhone();
    isValid = isValid && validateMessage();
    return isValid;
};


inputEmail.addEventListener("blur", validateEmail);
inputEmail.addEventListener("input", validateEmail);

inputSubject.addEventListener("blur", validateSubject);
inputSubject.addEventListener("input", validateSubject);

inputFirstName.addEventListener("blur", validateFirstName);
inputFirstName.addEventListener("input", validateFirstName);

inputLastName.addEventListener("blur", validateLastName);
inputLastName.addEventListener("input", validateLastName);

inputPhone.addEventListener("blur", validatePhone);
inputPhone.addEventListener("input", validatePhone);

inputMessage.addEventListener("blur", validateMessage);
inputMessage.addEventListener("input", validateMessage);

const form = document.querySelector('.form-contactpagina');

import flashMessage from './flashMessage.js';
import loadingSpinner from './loadingSpinner.js';


form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        flashMessage("Er is iets misgegaan. Check de velden.", "error");
        return; // Prevent submission if form is invalid
    }

    const spinner = new loadingSpinner();
    spinner.start();

    grecaptcha.ready(function () {
        grecaptcha.execute(sitekey, {  action: 'submit' }).then(async function (token) {
            const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;

            const formData = new URLSearchParams();
            formData.append('email', form.email.value);
            formData.append('MailSubject', form.subject.value);
            formData.append('FirstName', form.firstname.value);
            formData.append('LastName', form.lastname.value);
            formData.append('Phone', form.phone.value);
            formData.append('Message', form.message.value);
            formData.append('gRecaptchaResponse', token);
            formData.append('__RequestVerificationToken', csrfToken);
            form.style.pointerEvents = "none";
            form.style.opacity = "0.25";

            try {
                const response = await fetch('/contact/index', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData
                });

                if (!response.ok) {
                    flashMessage("Er is een probleem met de server. Status: " + response.status);
                    spinner.stop();
                    throw new Error('Er is een probleem met de server. Status: ' + response.status);
                }

                const data = await response.text();

                if (data.includes("Er is iets misgegaan")) {
                    flashMessage("Er is iets misgegaan. Probeer het opnieuw.", "error");
                    spinner.stop();
                    throw new Error("De server heeft een foutmelding geretourneerd.");
                }

                flashMessage("Formulier succesvol ingediend!", "success");
                form.reset();
                spinner.stop();
            } catch (error) {
                console.error('Fout bij formulierinzending:', error);
                flashMessage("Er is iets misgegaan. Probeer het opnieuw.", "error");
                spinner.stop();
            } finally {
                form.style.pointerEvents = "auto";
                form.style.opacity = "1";
            }
        });
    });
});

