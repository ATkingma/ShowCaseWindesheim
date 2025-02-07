document.addEventListener("DOMContentLoaded", async function () {
    const darkModeToggle = document.getElementById("darkModeToggle");

    const body = document.body;
    let theme = await Theme();
    if (theme === "light") {
        body.classList.add("light-mode");
        darkModeToggle.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "Light Mode";
    }

    darkModeToggle.addEventListener("click", async function () {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            await Theme("dark");
            darkModeToggle.textContent = "Light Mode";
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            await Theme("light");
            darkModeToggle.textContent = "Dark Mode";
        }
    });

});

async function Theme(newTheme = null) {
    if (await GDPR.cookieStatus() === 'accept') {
        if (newTheme) {
            await GDPR.handleCookie("theme", newTheme);
        }
        return await GDPR.handleCookie("theme");
    }
    return "dark";
}
