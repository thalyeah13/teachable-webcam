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
      return "Daur ulang menjadi kertas baru, tisu, atau kerajinan tangan.";
    case "plastik":
      return "Cacah menjadi biji plastik atau dilelehkan untuk produk baru.";
    case "logam":
      return "Lelehkan untuk dijadikan logam baru atau dijual ke pengepul.";
    case "kaca":
      return "Dapat dicuci dan digunakan ulang atau dilebur kembali.";
    case "organik":
      return "Olah menjadi kompos atau pakan ternak.";
    default:
      return "Belum ada saran spesifik untuk jenis ini.";
  }
}

// Jalankan saat halaman siap
window.addEventListener("DOMContentLoaded", init);
