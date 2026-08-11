let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

const subForm = document.getElementById("subForm");
const cardsContainer = document.getElementById("cardsContainer");
const emptyMsg = document.getElementById("emptyMsg");
const filterCategory = document.getElementById("filterCategory");
const sortBy = document.getElementById("sortBy");

function saveToLocalStorage() {
  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
}

function getDaysLeft(renewalDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0);

  const diffTime = renewal - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDaysClass(days) {
  if (days <= 3) return "days-urgent";
  if (days <= 10) return "days-soon";
  return "days-safe";
}

function getMonthlyCost(sub) {
  return sub.cycle === "yearly" ? sub.cost / 12 : sub.cost;
}

function updateSummary() {
  const totalCount = subscriptions.length;
  let monthlyTotal = 0;
  let wastedTotal = 0;

  subscriptions.forEach(sub => {
    const monthlyCost = getMonthlyCost(sub);
    monthlyTotal += monthlyCost;
    if (sub.unused) {
      wastedTotal += monthlyCost;
    }
  });

  const yearlyTotal = monthlyTotal * 12;

  document.getElementById("totalCount").textContent = totalCount;
  document.getElementById("monthlyTotal").textContent = Math.round(monthlyTotal).toLocaleString();
  document.getElementById("yearlyTotal").textContent = Math.round(yearlyTotal).toLocaleString();
  document.getElementById("wastedTotal").textContent = "৳" + Math.round(wastedTotal).toLocaleString();
}

function createCardHTML(sub) {
  const daysLeft = getDaysLeft(sub.renewalDate);
  const daysClass = getDaysClass(daysLeft);

  let daysText = daysLeft > 0 
    ? `${daysLeft} days left` 
    : (daysLeft === 0 ? "Renews Today!" : "Already expired!");

  let unusedTag = sub.unused ? '<br><span style="color:#ff6b6b; font-size:0.75rem;">⚠️ Not used</span>' : "";

  return `
    <div class="sub-card" data-id="${sub.id}">
      <span class="category-badge">${sub.category}</span>
      <h3>${sub.name}</h3>
      <div class="sub-cost">৳${sub.cost} <small>/${sub.cycle === "monthly" ? "month" : "year"}</small></div>
      <div class="days-left ${daysClass}">📅 ${daysText}</div>
      ${unusedTag}
      <div class="card-actions">
        <button type="button" class="btn-delete" onclick="deleteSubscription('${sub.id}')">Delete</button>
      </div>
    </div>
  `;
}

function renderCards() {
  let filteredSubs = [...subscriptions];

  const selectedCategory = filterCategory.value;
  if (selectedCategory !== "All") {
    filteredSubs = filteredSubs.filter(sub => sub.category === selectedCategory);
  }

  if (sortBy.value === "date") {
    filteredSubs.sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
  } else if (sortBy.value === "cost") {
    filteredSubs.sort((a, b) => getMonthlyCost(b) - getMonthlyCost(a));
  }

  if (filteredSubs.length === 0) {
    emptyMsg.style.display = "block";
    cardsContainer.innerHTML = "";
  } else {
    emptyMsg.style.display = "none";
    cardsContainer.innerHTML = filteredSubs.map(createCardHTML).join("");
  }

  updateSummary();
}

subForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newSub = {
    id: Date.now().toString(),
    name: document.getElementById("subName").value.trim(),
    cost: parseFloat(document.getElementById("subCost").value),
    cycle: document.getElementById("subCycle").value,
    category: document.getElementById("subCategory").value,
    renewalDate: document.getElementById("subDate").value,
    unused: document.getElementById("subUnused").checked
  };

  subscriptions.push(newSub);
  saveToLocalStorage();
  renderCards();
  subForm.reset();
});

window.deleteSubscription = function (id) {
  subscriptions = subscriptions.filter(sub => sub.id !== id);
  saveToLocalStorage();
  renderCards();
};

filterCategory.addEventListener("change", renderCards);
sortBy.addEventListener("change", renderCards);

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

renderCards();
startLogoRain();