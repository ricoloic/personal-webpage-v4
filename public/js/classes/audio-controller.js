class AudioController {
  constructor() {
    this.context = null;
    this.buffer = null;
    this.source = null;
    this.analyzer = null;
    this.loaded = false;
    this.started = false;
    this.undecodedAudio = null;
    this.initialized = false;
    this.gainNode = null;
    this.convolver = null;

    this.pausedTime = 0;
    this.startTime = 0;
    this.initialTime = undefined;
  }

  initialize() {
    this.context = new AudioContext({ latencyHint: "interactive" });
    this.gainNode = this.context.createGain();
    this.convolver = this.context.createConvolver();
    this.convolver.normalize = true;
    return this.context
      .decodeAudioData(this.undecodedAudio, (data) => {
        this.buffer = data;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.convolver.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.initialized = true;
      })
      .then((decodedData) => {
        let decodedBuffer = decodedData.getChannelData(0);
        let sliceLen = Math.floor(decodedData.sampleRate * 0.05);
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
        this.gainNode.gain.value = gain;
      });
  }

  toggle() {
    console.log("toggle: ", this.started);
    if (this.started) this.stop();
    else this.start();
  }

  play() {
    console.log("play");
    // Create a new source node
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;

    // Reconnect the new source to the analyser and destination
    this.source.connect(this.gainNode).connect(this.context.destination);
    this.source.connect(this.analyser);

    if (!this.initialTime) this.initialTime = Date.now();
    if (this.pausedTime) {
      this.source.start(0, this.pausedTime / 1000);
    } else {
      this.startTime = Date.now();
      this.source.start(0);
    }

    let userStopped = false;
    this.source.onended = () => {
      this.started = false;
      if (!userStopped) {
        this.pausedTime = 0;
      }
      userStopped = false;
    };

    this.source.userStop = () => {
      userStopped = true;
      this.source.stop(0);
    };

    console.log("starting");
    this.started = true;
  }

  start(...args) {
    if (this.ready() && !this.started) {
      if (!this.context) {
        this.initialize().then(() => {
          this.play(...args);
        });
      } else {
        this.play(...args);
      }
    }
  }

  stop() {
    if (this.ready() && this.started) {
      console.log("stop");
      this.source.userStop();
      this.pausedTime = Date.now() - this.startTime;
    }
  }

  loop() {
    if (this.ready()) this.source.loop = true;
  }

  noloop() {
    if (this.ready()) this.source.loop = false;
  }

  ready() {
    return this.loaded;
  }

  /**
   * @param analyserOptions {object} - Options to configure the AnalyserNode
   */
  createAnalyser(analyserOptions = { fftSize: 4096 }) {
    this.analyser = this.context.createAnalyser();

    if (analyserOptions?.fftSize) {
      this.analyser.fftSize = analyserOptions.fftSize;
    }
  }

  /**
   * @param filepath {string}
   */
  async load(filepath) {
    return new Promise((resolve) => {
      const request = new XMLHttpRequest();
      request.open("GET", filepath);
      request.responseType = "arraybuffer";

      request.onload = () => {
        if (request.status === 200) {
          this.undecodedAudio = request.response;
          this.loaded = true;
          resolve(true);
        } else {
          resolve(false);
        }
      };

      request.onerror = function () {
        resolve(false);
      };

      request.send();
    });
  }

  getFrequencyData(
    fftSize = 2048,
    minFrequency = 0,
    maxFrequency = this.context.sampleRate / 2,
  ) {
    if (!this.analyser) return null;

    this.analyser.fftSize = fftSize;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Return the subarray containing the frequency data within the specified range
    return this.getFrequencyRange(dataArray, minFrequency, maxFrequency);
  }

  getFrequencyRange(
    dataArray,
    minFrequency = 0,
    maxFrequency = this.context.sampleRate / 2,
  ) {
    if (!this.analyser) return null;

    // Calculate the start and end indices based on the specified frequency range
    const sampleRate = this.context.sampleRate;

    const startIndex = Math.floor(
      (minFrequency / sampleRate) * this.analyser.fftSize,
    );
    const endIndex = Math.min(
      Math.floor((maxFrequency / sampleRate) * this.analyser.fftSize),
      dataArray.length,
    );

    // Return the subarray containing the frequency data within the specified range
    return dataArray.subarray(startIndex, endIndex);
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

// class AudioController {
//   constructor() {
//     this.context = null;
//     this.buffer = null;
//     this.source = null;
//     this.analyzer = null;
//     this.loaded = false;
//     this.started = false;
//     this.undecodedAudio = null;
//     this.initialized = false;
//     this.gainNode = null;
//     this.convolver = null;
//
//     this.pausedTime = 0;
//     this.startTime = 0;
//     this.initialTime = undefined;
//   }
//
//   initialize() {
//     this.context = new AudioContext({ latencyHint: "interactive" });
//     this.gainNode = this.context.createGain();
//     this.convolver = this.context.createConvolver();
//     this.convolver.normalize = true;
//     return this.context
//         .decodeAudioData(this.undecodedAudio, (data) => {
//           this.buffer = data;
//           this.source = this.context.createBufferSource();
//           this.source.buffer = this.buffer;
//           this.convolver.buffer = this.buffer;
//           this.source.connect(this.context.destination);
//           this.createAnalyser();
//           this.source.connect(this.analyser);
//           this.analyser.connect(this.context.destination);
//           this.initialized = true;
//         })
//         .then((decodedData) => {
//           let decodedBuffer = decodedData.getChannelData(0);
//           let sliceLen = Math.floor(decodedData.sampleRate * 0.05);
//           let averages = [];
//           let sum = 0.0;
//           for (let i = 0; i < decodedBuffer.length; i++) {
//             sum += decodedBuffer[i] ** 2;
//             if (i % sliceLen === 0) {
//               sum = Math.sqrt(sum / sliceLen);
//               averages.push(sum);
//               sum = 0;
//             }
//           }
//           // Ascending sort of the averages array
//           averages.sort();
//           // Take the average at the 95th percentile
//           let a = averages[Math.floor(averages.length * 0.95)];
//
//           let gain = 1.0 / a;
//
//           // Perform some clamping
//           gain = Math.max(gain, 0.02);
//           gain = Math.min(gain, 100.0);
//
//           gain = gain / 10.0;
//           this.gainNode.gain.value = gain;
//         });
//   }
//
//   toggle() {
//     console.log("toggle: ", this.started);
//     if (this.started) this.stop();
//     else this.start();
//   }
//
//   play() {
//     console.log("play");
//     // Create a new source node
//     this.source = this.context.createBufferSource();
//     this.source.buffer = this.buffer;
//
//     // Reconnect the new source to the analyser and destination
//     this.source.connect(this.gainNode).connect(this.context.destination);
//     this.source.connect(this.analyser);
//
//     if (!this.initialTime) this.initialTime = Date.now();
//     if (this.pausedTime) {
//       this.source.start(0, this.pausedTime / 1000);
//     } else {
//       this.startTime = Date.now();
//       this.source.start(0);
//     }
//
//     let userStopped = false;
//     this.source.onended = () => {
//       this.started = false;
//       if (!userStopped) {
//         this.pausedTime = this.initialTime - this.startTime;
//       }
//       userStopped = false;
//     };
//
//     this.source.userStop = () => {
//       userStopped = true;
//       this.source.stop(0);
//     };
//
//     console.log("starting");
//     this.started = true;
//   }
//
//   start(...args) {
//     if (this.ready() && !this.started) {
//       if (!this.context) {
//         this.initialize().then(() => {
//           this.play(...args);
//         });
//       } else {
//         this.play(...args);
//       }
//     }
//   }
//
//   stop() {
//     if (this.ready() && this.started) {
//       console.log("stop");
//       this.source.userStop();
//       this.pausedTime = Date.now() - this.startTime;
//     }
//   }
//
//   loop() {
//     if (this.ready()) this.source.loop = true;
//   }
//
//   noloop() {
//     if (this.ready()) this.source.loop = false;
//   }
//
//   ready() {
//     return this.loaded;
//   }
//
//   /**
//    * @param analyserOptions {object} - Options to configure the AnalyserNode
//    */
//   createAnalyser(analyserOptions = { fftSize: 4096 }) {
//     this.analyser = this.context.createAnalyser();
//
//     if (analyserOptions?.fftSize) {
//       this.analyser.fftSize = analyserOptions.fftSize;
//     }
//   }
//
//   /**
//    * @param filepath {string}
//    */
//   async load(filepath) {
//     return new Promise((resolve) => {
//       const request = new XMLHttpRequest();
//       request.open("GET", filepath);
//       request.responseType = "arraybuffer";
//
//       request.onload = () => {
//         if (request.status === 200) {
//           this.undecodedAudio = request.response;
//           this.loaded = true;
//           resolve(true);
//         } else {
//           resolve(false);
//         }
//       };
//
//       request.onerror = function () {
//         resolve(false);
//       };
//
//       request.send();
//     });
//   }
//
//   getFrequencyData(
//       fftSize = 2048,
//       minFrequency = 0,
//       maxFrequency = this.context.sampleRate / 2,
//   ) {
//     if (!this.analyser) return null;
//
//     this.analyser.fftSize = fftSize;
//
//     const bufferLength = this.analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);
//     this.analyser.getByteFrequencyData(dataArray);
//
//     // Return the subarray containing the frequency data within the specified range
//     return this.getFrequencyRange(dataArray, minFrequency, maxFrequency);
//   }
//
//   getFrequencyRange(
//       dataArray,
//       minFrequency = 0,
//       maxFrequency = this.context.sampleRate / 2,
//   ) {
//     if (!this.analyser) return null;
//
//     // Calculate the start and end indices based on the specified frequency range
//     const sampleRate = this.context.sampleRate;
//
//     const startIndex = Math.floor(
//         (minFrequency / sampleRate) * this.analyser.fftSize,
//     );
//     const endIndex = Math.min(
//         Math.floor((maxFrequency / sampleRate) * this.analyser.fftSize),
//         dataArray.length,
//     );
//
//     // Return the subarray containing the frequency data within the specified range
//     return dataArray.subarray(startIndex, endIndex);
//   }
//
//   static create(...args) {
//     try {
//       return new AudioController(...args);
//     } catch (err) {
//       console.error(err);
//       return null;
//     }
//   }
// }
