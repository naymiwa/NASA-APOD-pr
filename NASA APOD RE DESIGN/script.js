// ===== NASA APOD SCRIPT =====

// ambil elemen HTML
const dateEl = document.querySelector(".date");
const imgEl = document.querySelector(".image");
const explanationEl = document.querySelector(".explanation");
const creditLink = document.querySelector(".link");

// API config
const apiKey = "tThbHCfjpdJHMP9QGLr8dCpmHLjPjQFP8ngwzqMW";
const baseUrl = "https://api.nasa.gov/planetary/apod";

// reset tampilan
function clearDisplay() {
  dateEl.textContent = "";
  explanationEl.textContent = "";
  imgEl.style.display = "none";
  imgEl.removeAttribute("src");
  creditLink.textContent = "";
  creditLink.href = "#";
}

// tampilkan pesan error ke pengunjung
function showErrorMessage(message) {
  explanationEl.textContent = message;
  imgEl.style.display = "none";
  imgEl.removeAttribute("src");
}

// render data APOD ke halaman
function applyData(data) {
  dateEl.textContent = data.date;

  if (data.media_type === "image") {
    imgEl.src = data.url;
    imgEl.style.display = "block";

    creditLink.textContent = data.title;
    creditLink.href = data.hdurl || data.url;
  }
  // jika APOD berupa video
  else if (data.media_type === "video") {
    explanationEl.textContent =
      "Today's APOD is a video. Click the link below to watch it.";

    creditLink.textContent = "Watch the video here";
    creditLink.href = data.url;
  }
  // media_type lain yang belum dikenal
  else {
    showErrorMessage("Today's APOD is not available.");
  }
}

async function fetchApod(date) {
  const url = date
    ? `${baseUrl}?api_key=${apiKey}&date=${date}`
    : `${baseUrl}?api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`APOD API error: HTTP ${response.status}`);
  }
  return response.json();
}

// tanggal kemarin (format YYYY-MM-DD) sebagai fallback
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// jika gambar gagal dimuat (URL 404 dsb)
imgEl.onerror = () => {
  showErrorMessage("The picture could not be loaded. Please try again later.");
};

// fetch APOD hari ini; kalau gagal (mis. HTTP 500 karena APOD
// hari ini belum di-upload), coba sekali lagi dengan tanggal kemarin
clearDisplay();
fetchApod()
  .catch(() => fetchApod(getYesterday()))
  .then(applyData)
  .catch((error) => {
    console.error(error);
    showErrorMessage("Failed to load APOD data. Please try again later.");
  });
