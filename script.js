// Rileva il volume del microfono
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateBackground() {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      // Calcolare la media del volume
      const average = sum / dataArray.length;
      const intensity = average / 255;

      // Cambiare il gradiente dello sfondo in base al volume
      const gradient = `linear-gradient(90deg, rgba(255, ${Math.min(
        255,
        255 * intensity
      )}, ${Math.min(255, 255 * (1 - intensity))}, 1), rgba(${Math.min(
        255,
        255 * (1 - intensity)
      )}, ${Math.min(255, 255 * intensity)}, 255, 1))`;
      document.body.style.background = gradient;

      requestAnimationFrame(updateBackground);
    }

    updateBackground();
  })
  .catch(function (error) {
    console.log("Accesso al microfono negato", error);
  });
