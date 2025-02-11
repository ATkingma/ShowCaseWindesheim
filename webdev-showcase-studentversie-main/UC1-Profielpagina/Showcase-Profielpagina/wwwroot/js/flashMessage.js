export default function flashMessage(message, type = "success") {
    let flashDiv = document.createElement("div");
    flashDiv.textContent = message;
    flashDiv.className = `flash-message ${type}`;

    document.body.appendChild(flashDiv);

    setTimeout(() => {
        flashDiv.classList.add('show');
    }, 0);

    setTimeout(() => {
        flashDiv.remove();
    }, 3000);
}