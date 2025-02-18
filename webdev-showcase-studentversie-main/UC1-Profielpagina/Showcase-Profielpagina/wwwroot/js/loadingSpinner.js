export default class LoadingSpinner {
    constructor(type = "loader") {
        this.containerDiv = document.createElement("div");
        this.containerDiv.className = "loading-container";

        this.spinnerDiv = document.createElement("div");
        this.spinnerDiv.className = type;

        this.containerDiv.appendChild(this.spinnerDiv);

        this.containerDiv.style.pointerEvents = "none";
    }

    start() {
        document.body.appendChild(this.containerDiv);
    }

    stop() {
        if (this.containerDiv && this.containerDiv.parentNode) {
            this.containerDiv.remove();
        }
    }
}
