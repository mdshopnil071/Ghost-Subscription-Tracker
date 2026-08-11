function startLogoRain() {
  const logoRainContainer = document.getElementById("logoRain");
  if (!logoRainContainer) return;

  const logoSlugs = [
    "claude", "netflix", "x", "openai", "googlegemini", "grok",
    "cursor", "elevenlabs", "spotify", "primevideo", "discord",
    "telegram", "googlecloud", "icloud", "githubcopilot",
    "amazonaws", "hostinger", "godaddy", "notion", "figma"
  ];

  const totalColumns = 12;

  for (let i = 0; i < totalColumns; i++) {
    const column = document.createElement("div");
    column.className = "logo-column";
    column.style.left = Math.random() * 100 + "%";

    const duration = 18 + Math.random() * 16;
    const delay = Math.random() * -30;
    column.style.animationDuration = duration + "s";
    column.style.animationDelay = delay + "s";

    const logosInColumn = 6 + Math.floor(Math.random() * 3);
    for (let j = 0; j < logosInColumn; j++) {
      const randomSlug = logoSlugs[Math.floor(Math.random() * logoSlugs.length)];
      const img = document.createElement("img");
      img.src = "https://cdn.simpleicons.org/" + randomSlug;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () { this.remove(); };

      column.appendChild(img);
    }

    logoRainContainer.appendChild(column);
  }
}

startLogoRain();