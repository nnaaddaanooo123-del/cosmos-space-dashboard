const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const sectionId = this.getAttribute("data-section");
    sections.forEach((s) => s.classList.add("hidden"));
    const selected = document.getElementById(sectionId);
    if (selected) selected.classList.remove("hidden");
  });
});

// ===== APOD =====
const apod = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodExplanation = document.getElementById("apod-explanation");
const apodDate = document.getElementById("apod-date");
const apodDateInfo = document.getElementById("apod-date-info");

async function getApod() {
  try {
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    );
    if (!response.ok) throw new Error("Failed to fetch APOD");
    const d = await response.json();

    apod.src = d.hdurl || d.url;
    apodTitle.textContent = d.title;
    apodExplanation.textContent = d.explanation;
    const formatted = d.date.split("-").reverse().join("/");
    apodDate.textContent = formatted;
    apodDateInfo.textContent = formatted;
  } catch (e) {
    console.log(e);
  }
}
getApod();

// ===== Launches =====
const launchesGrid = document.getElementById("launches-grid");

async function getLaunches() {
  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=9"
    );
    if (!response.ok) throw new Error("Failed to fetch launches");
    const { results } = await response.json();

    let html = "";
    for (const launch of results) {
      const image =
        launch.image?.image_url || "https://placehold.co/600x400?text=No+Image";
      const name = launch.name;
      const company = launch.launch_service_provider?.name || "Unknown";
      const location = launch.pad?.location?.name || "Unknown";
      const d = new Date(launch.net);
      const date = d.toLocaleDateString("en-GB");
      const time = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      html += `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
          <img src="${image}" alt="${name}" class="w-full h-full object-cover">
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">Upcoming</span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">${name}</h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i> ${company}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${date}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${time} UTC</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${location}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">Details</button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>`;
    }
    launchesGrid.innerHTML = html;
  } catch (e) {
    console.log(e);
  }
}
getLaunches();

// ===== Planets =====
let planetData;

async function getPlanet() {
  try {
    const response = await fetch(
      "https://solar-system-opendata-proxy.vercel.
