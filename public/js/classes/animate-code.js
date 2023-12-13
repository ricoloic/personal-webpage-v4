/**
 * AnimateCode class for animating the display of code in an HTML element.
 */
class AnimateCode {
    /**
     * Default options for AnimateCode.
     * @type {Object}
     * @property {number} intervalDurationMs - The duration of each animation interval in milliseconds.
     * @property {Function} highlightFn - A function for highlighting the displayed code.
     */
    static options = {
        intervalDurationMs: 100,
        highlightFn: (str) => str,
        forHtml: false,
        onended: () => null,
    };

    /**
     * Constructor for AnimateCode class.
     * @param {HTMLElement} element - The HTML element where the code will be displayed.
     * @param {string} code - The code to be animated.
     * @param {Object} options - Options for customizing the animation (optional).
     */
    constructor(element, code, options) {
        this.code = code;
        this.element = element;

        this.options = { ...AnimateCode.options, ...(options || {}) };

        this.displayedCode = "";
        this.index = 0;
        this.offsetAddedString = "";
        this.started = false;

        this.interval = undefined;
    }

    /**
     * Set the duration of each animation interval.
     * @param {number} duration - The duration of each animation interval in milliseconds.
     */
    setIntervalDurationMs(duration) {
        this.options.intervalDurationMs = duration;

        const previouslyStarted = this.started;
        this.stopAnimation();
        if (previouslyStarted) this.startAnimation();
    }

    /**
     * Reset the animation to its initial state.
     */
    resetAnimation() {
        this.stopAnimation();

        this.element.innerHTML = "";
        this.displayedCode = "";
        this.index = 0;
        this.offsetAddedString = "";
    }

    /**
     * Restart the animation from the beginning.
     */
    restartAnimation() {
        const previouslyStarted = this.started;
        this.resetAnimation();
        if (previouslyStarted) this.startAnimation();
    }

    /**
     * Start the code animation if it hasn't already started.
     */
    startAnimation() {
        if (!this.started && this.displayedCode.length < this.code.length) {
            this.started = true;
            this._animate();
        }
    }

    /**
     * Stop the code animation.
     */
    stopAnimation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            this.started = false;
        }
    }

    /**
     * Internal method for handling the animation logic.
     * @private
     */
    _animate() {
        this.interval = setInterval(() => {
            if (this.options.forHtml) {
                if (this.code[this.index] === "<") {
                    let whiteSpacesCount = 0;
                    this.offsetAddedString += "<";
                    while (this.code[this.index + whiteSpacesCount] !== ">") {
                        whiteSpacesCount++;
                        this.offsetAddedString +=
                            this.code[this.index + whiteSpacesCount];
                    }

                    this.index += whiteSpacesCount + 1;
                } else {
                    this.offsetAddedString = "";
                }
            }

            this.displayedCode +=
                this.offsetAddedString + (this.code[this.index++] || "");
            this.element.innerHTML = this.options.highlightFn(
                this.displayedCode
            );

            if (this.displayedCode.length >= this.code.length) {
                this.stopAnimation();
                this.options.onended();
                return;
            }

            if (this.code[this.index] + this.code[this.index + 1] === "  ") {
                let whiteSpacesCount = 0;
                while (this.code[this.index + whiteSpacesCount] === " ")
                    whiteSpacesCount++;

                this.index += whiteSpacesCount;
                this.offsetAddedString = " ".repeat(whiteSpacesCount);
            } else {
                this.offsetAddedString = "";
            }
        }, this.options.intervalDurationMs);
    }
}
