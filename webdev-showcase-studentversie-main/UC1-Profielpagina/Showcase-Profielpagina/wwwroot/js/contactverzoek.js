
const inputEmail = document.getElementById('email');
const inputSubject = document.getElementById('subject');
const inputFirstName = document.getElementById('firstname');
const inputLastName = document.getElementById('lastname');
const inputPhone = document.getElementById('phone');
const inputMessage = document.getElementById('message');

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
    if (inputFirstName.value.trim() === "") {
        inputFirstName.setCustomValidity("Voornaam is verplicht.");
        inputFirstName.reportValidity();
        return false; 
    } else if (inputFirstName.value.length > 60) {
        inputFirstName.setCustomValidity("Voornaam mag niet langer dan 60 tekens zijn.");
        inputFirstName.reportValidity();
        return false; 
    } else {
        inputFirstName.setCustomValidity("");
        return true; 
    }
};

const validateLastName = () => {
    if (inputLastName.value.trim() === "") {
        inputLastName.setCustomValidity("Achternaam is verplicht.");
        inputLastName.reportValidity();
        return false; 
    } else if (inputLastName.value.length > 60) {
        inputLastName.setCustomValidity("Achternaam mag niet langer dan 60 tekens zijn.");
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

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        //hier dan die feedback rommel
        return; // Prevent submission if form is invalid
    }

    const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;

    const formData = new URLSearchParams();
    formData.append('email', form.email.value);
    formData.append('MailSubject', form.subject.value); 
    formData.append('FirstName', form.firstname.value);  
    formData.append('LastName', form.lastname.value);   
    formData.append('Phone', form.phone.value);         
    formData.append('Message', form.message.value); 
    formData.append('__RequestVerificationToken', csrfToken);

    await fetch('/contact/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response);
            }
            return response.text();
        })
        .then(data => {
            console.log('Formulier succesvol ingediend:');
            form.reset(); 
        })
        .catch(error => {
            console.error('Er was een probleem met de formulierinzending:', error);
            alert(error.message);
        });
});
