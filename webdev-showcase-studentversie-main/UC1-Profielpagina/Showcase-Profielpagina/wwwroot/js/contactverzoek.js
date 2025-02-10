    const inputEmail = document.getElementById('email');


    const validateEmail = () => {
        if (inputEmail.validity.typeMismatch) {
            inputEmail.setCustomValidity("Voer een geldig e-mailadres in!");
            inputEmail.reportValidity();
        } else if (inputEmail.value.length > 80) {
            inputEmail.setCustomValidity("Email moet niet langer dan 80 tekens zijn!");
        } else {
            inputEmail.setCustomValidity("");
        }
    }

    const validateForm = () => {
        validateEmail();
    }

    inputEmail.addEventListener("blur", validateEmail);
    inputEmail.addEventListener("input", validateEmail);

    const form = document.querySelector('.form-contactpagina');



    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validateForm();
        const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;

        const formData = new URLSearchParams();

        formData.append('email', form.email.value);

        formData.append('__RequestVerificationToken', csrfToken); 

        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData 
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netwerkrespons was niet ok');
                }
                return response.text();
            })
            .then(data => {
                //goeed

                console.log('Formulier succesvol ingediend:', data);
            })
            .catch(error => {
                console.error('Er was een probleem met de formulierinzending:', error);

                alert(error.message);
            });
    });