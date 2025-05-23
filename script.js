const URL = "./model/";
let model, webcam, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load model
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam dengan kamera belakang
  webcam = new tmImage.Webcam(224, 224, true);
  await webcam.setup({ facingMode: "environment" }); // Kamera belakang
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Tampilkan video webcam
  document.getElementById("webcam").appendChild(webcam.canvas);
}

async function loop() {
  webcam.update();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  // Urutkan berdasarkan probabilitas
  prediction.sort((a, b) => b.probability - a.probability);

  // Tampilkan hasil
  let resultText = "";
  prediction.forEach((p) => {
    resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
  });

  document.getElementById("result").innerHTML = resultText;
}

// Jalankan saat halaman siap
window.addEventListener("DOMContentLoaded", init);
