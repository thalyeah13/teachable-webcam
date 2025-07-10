const URL = "./model/";
let model, webcam, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load model
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  webcam = new tmImage.Webcam(224, 224, true);
  await webcam.setup({ facingMode: "environment" });
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

  // Urutkan berdasarkan probabilitas tertinggi
  prediction.sort((a, b) => b.probability - a.probability);
  const top = prediction[0]; // Hasil terbaik

  // Tampilkan semua hasil
  let resultText = "";
  prediction.forEach((p) => {
    resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
  });
  document.getElementById("result").innerHTML = resultText;

  // Tampilkan saran berdasarkan hasil terbaik
  const suggestionText = getSuggestion(top.className);
  document.getElementById("suggestion").innerHTML = `<strong>Saran Pengolahan:</strong> ${suggestionText}`;
}

// Fungsi saran pengolahan berdasarkan jenis
function getSuggestion(label) {
  switch (label.toLowerCase()) {
    case "kertas":
      return "Kertas bekas bisa didaur ulang, dijadikan kerajinan, atau dikomposkan.";
    case "plastik":
      return "Plastik dicuci lalu didaur ulang, dijadikan ecobrick atau kerajinan.";
    case "logam":
      return "Logam dibersihkan lalu dilebur, dijual, atau dimanfaatkan sebagai kerajinan.";
    case "kaca":
      return "Kaca dipisah warna, digunakan ulang, dilebur, atau dijadikan hiasan.";
    case "organik":
      return "Olah menjadi kompos atau pakan ternak.";
    default:
      return "Belum ada saran spesifik untuk jenis ini.";
  }
}

// Jalankan saat halaman siap
window.addEventListener("DOMContentLoaded", init);
