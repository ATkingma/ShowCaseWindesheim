document.addEventListener("DOMContentLoaded", async () => {
    try {
        const cookieStatus = await GDPR.cookieStatus();

        if (cookieStatus !== "accept") {
            alert("Je hebt cookies niet geaccepteerd. Sommige functies werken mogelijk niet.");
            const form = document.querySelector(".form-contactpagina");
            form.style.pointerEvents = "none";
            form.style.opacity = "0.25";
            return;
        }
    }
    catch (error) {
        console.error("Fout bij het controleren van cookie-toestemming:", error);
    }
});