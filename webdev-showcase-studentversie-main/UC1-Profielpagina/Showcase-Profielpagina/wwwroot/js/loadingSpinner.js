export default class LoadingSpinner {
    constructor(type = "loader") {
        // Create spinner container
        this.containerDiv = document.createElement("div");
        this.containerDiv.className = "loading-container";

        // Create spinner
        this.spinnerDiv = document.createElement("div");
        this.spinnerDiv.className = type;

        // Append spinner to container
        this.containerDiv.appendChild(this.spinnerDiv);

        // Allow clicks to pass through
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
