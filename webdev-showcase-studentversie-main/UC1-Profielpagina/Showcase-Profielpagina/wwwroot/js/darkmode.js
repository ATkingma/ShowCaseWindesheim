document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        darkModeToggle.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode");
        darkModeToggle.textContent = "Light Mode";
    }

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            darkModeToggle.textContent = "Dark Mode";
        } else {
            localStorage.setItem("theme", "dark");
            darkModeToggle.textContent = "Light Mode";
        }
    });
});
