/**
 * @async
 * @param {string} url
 * @return {Promise<ArrayBuffer | null>}
 */
async function fetchArrayBuffer(url) {
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "arraybuffer";

        request.onload = () => {
            if (
                request.status >= 200 &&
                request.status < 300 &&
                request.response
            ) {
                resolve(request.response);
            } else {
                resolve(null);
            }
        };

        request.onerror = function () {
            resolve(null);
        };

        request.send();
    });
}

/**
 * @typedef {32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768} FftSize
 */

class AudioController {
    constructor() {
        this.context = null;

        this.buffer = null;
        this.source = null;
        this.analyzer = null;
        this.gain = null;
        this.convolver = null;

        this.undecodedBuffer = null;

        this.loaded = false;
        this.initialized = false;

        this.started = false;

        this.realPausedTime = 0;
        this.realStartTime = 0;
    }

    /**
     * @async
     * @method load
     * @methodOf AudioController
     * @param {string} url
     * @return {Promise<AudioController>}
     */
    async load(url) {
        const data = await fetchArrayBuffer(url);
        if (data) {
            this.undecodedBuffer = data;
            this.loaded = true;
        } else {
            console.error(
                "There wa an error while fetching the audio file, check the network tab for more details"
            );
        }

        return this;
    }

    /**
     * AudioController.initialize is used to instantiate the AudioContext and its buffer. This method should only be
     * called when AudioController.loaded is true.
     *
     * @async
     * @method initialize
     * @methodOf AudioController
     * @param {AudioContextLatencyCategory} latencyHint
     * @return {Promise<AudioController>}
     */
    async initialize(latencyHint = "interactive") {
        if (!this.loaded) return this;

        this.context = new AudioContext({ latencyHint });
        this.context.onstatechange = () => {
            if (this.context.state !== "running") this.started = false;
        };
        this.buffer = await this.context.decodeAudioData(
            this.undecodedBuffer.slice()
        );

        this.createGain();
        this.createAnalyser();
        this.createSource();
        this.createConvolver();

        this.initialized = true;

        this.initialTime = this.context.currentTime;

        return this;
    }

    /**
     * @method createSource
     * @methodOf AudioController
     * @return {AudioController}
     */
    createSource() {
        if (!this.context) return this;

        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;

        if (this.gain)
            this.source.connect(this.gain).connect(this.context.destination);
        else this.source.connect(this.context.destination);
        if (this.analyser) this.source.connect(this.analyser);

        return this;
    }

    /**
     * @method createConvolver
     * @methodOf AudioController
     * @return {AudioController}
     */
    createConvolver() {
        if (!this.context) return this;

        this.convolver = this.context.createConvolver();
        this.convolver.normalize = true;
        this.convolver.buffer = this.buffer;

        return this;
    }

    /**
     * @method createAnalyser
     * @methodOf AudioController
     * @param {FftSize} fftSize
     * @return {AudioController}
     */
    createAnalyser(fftSize = 2048) {
        if (!this.context) return this;

        this.analyser = this.context.createAnalyser();

        if (fftSize) this.analyser.fftSize = fftSize;

        this.analyser.connect(this.context.destination);

        return this;
    }

    /**
     * @method createGain
     * @methodOf AudioController
     * @return {AudioController}
     */
    createGain() {
        if (!this.context || !this.buffer) return this;

        this.gain = this.context.createGain();
        let decodedBuffer = this.buffer.getChannelData(0);
        let sliceLen = Math.floor(this.buffer.sampleRate * 0.05);
        let averages = [];
        let sum = 0.0;
        for (let i = 0; i < decodedBuffer.length; i++) {
            sum += decodedBuffer[i] ** 2;
            if (i % sliceLen === 0) {
                sum = Math.sqrt(sum / sliceLen);
                averages.push(sum);
                sum = 0;
            }
        }
        // Ascending sort of the averages array
        averages.sort();
        // Take the average at the 95th percentile
        let a = averages[Math.floor(averages.length * 0.95)];

        let gain = 1.0 / a;

        // Perform some clamping
        gain = Math.max(gain, 0.02);
        gain = Math.min(gain, 100.0);

        gain = gain / 10.0;
        this.gain.gain.value = gain;

        return this;
    }

    /**
     * @method start
     * @methodOf AudioController
     * @return {AudioController}
     */
    start() {
        if (
            this.started ||
            !this.initialized ||
            this.context.state === "closed"
        )
            return this;

        if (
            this.context.state === "interrupted" ||
            this.context.state === "suspended"
        ) {
            this.context.resume().then(() => this.start());
            return this;
        }

        if (this.context.state !== "running") return this;

        this.createSource();

        if (this.realPausedTime) {
            this.source.start(0, this.realPausedTime);
        } else {
            this.realStartTime = this.context.currentTime;
            this.source.start(0);
        }

        let userStopped = false;

        this.source.onended = async () => {
            this.started = false;
            if (!userStopped) {
                this.realPausedTime = 0;
                this.realStartTime = 0;
                if (this.onended) {
                    this.onended();
                }
            }
            userStopped = false;
        };

        this.source.userStop = () => {
            userStopped = true;
            this.source.stop(0);
        };

        this.started = true;

        return this;
    }

    /**
     * @method stop
     * @methodOf AudioController
     * @return {AudioController}
     */
    stop() {
        if (
            !this.started ||
            !this.initialized ||
            this.context.state === "closed"
        )
            return this;

        this.source.userStop();
        this.realPausedTime = this.context.currentTime - this.realStartTime;

        return this;
    }

    /**
     * @method toggle
     * @methodOf AudioController
     * @return {AudioController}
     */
    toggle() {
        if (!this.initialized) return this;

        if (this.started) this.stop();
        else this.start();

        return this;
    }

    /**
     * @method analyzeFrequency
     * @methodOf AudioController
     * @param {{ fftSize?: FftSize, minFrequency?: number, maxFrequency?: number }} options
     * @return {Uint8Array | null}
     */
    analyzeFrequency(
        options = {
            fftSize: undefined,
            minFrequency: undefined,
            maxFrequency: undefined,
        }
    ) {
        if (!this.initialized || !this.analyser) return null;

        let {
            fftSize = undefined,
            minFrequency = undefined,
            maxFrequency = undefined,
        } = options;

        const sampleRate = this.context.sampleRate;

        if (!minFrequency) minFrequency = 0;
        if (!maxFrequency) maxFrequency = sampleRate / 2;

        if (fftSize) this.analyser.fftSize = fftSize;
        else fftSize = this.analyser.fftSize;

        const bufferLength = this.analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        const startIndex = Math.floor((minFrequency / sampleRate) * fftSize);
        const endIndex = Math.min(
            Math.floor((maxFrequency / sampleRate) * fftSize),
            bufferLength
        );

        return dataArray.subarray(startIndex, endIndex);
    }

    disconnect() {
        this.analyser?.disconnect();
        this.convolver?.disconnect();
        this.gain?.disconnect();
        this.source?.disconnect();
    }

    static create(...args) {
        try {
            return new AudioController(...args);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
