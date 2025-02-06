document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");

    const body = document.body;

    if (Theme() === "light") {
        body.classList.add("light-mode");
        darkModeToggle.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "Light Mode";
    }

    darkModeToggle.addEventListener("click", function () {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            Theme("dark");
            darkModeToggle.textContent = "Light Mode";
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            Theme("light");
            darkModeToggle.textContent = "Dark Mode";
        }
    });

});
function Theme(newTheme) {
    if (GDPR.cookieStatus() === 'accept') {
        if (newTheme) {
            localStorage.setItem("theme", newTheme);
        }
        return localStorage.getItem("theme")
    }
}
