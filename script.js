const grid = document.querySelector("#internship-grid");
const statusArea = document.querySelector("#status-area");
const searchInput = document.querySelector("#search");
const domainFilter = document.querySelector("#domain-filter");
const modeFilter = document.querySelector("#mode-filter");
const resultsCount = document.querySelector("#results-count");
const totalCount = document.querySelector("#total-count");
const detailsDialog = document.querySelector("#details-dialog");
const applyDialog = document.querySelector("#apply-dialog");
let internships = [];

const descriptions = {
  "Full Stack Development": "Help build useful web experiences and learn how the front end and back end work together.",
  "UI/UX": "Explore how thoughtful research and design can make digital products easier to use.",
  "Data Analytics": "Turn information into clear insights that help people make better decisions.",
  "Cyber Security": "Learn the basics of keeping systems, information, and users safer."
};

function showStatus(title, message, withRetry = false) {
  statusArea.innerHTML = `<div class="status-box"><strong>${title}</strong><span>${message}</span>${withRetry ? '<br><button class="retry-btn" id="retry-load" type="button">Try again</button>' : ""}</div>`;
  grid.innerHTML = "";
  if (withRetry) document.querySelector("#retry-load").addEventListener("click", loadInternships);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}

async function loadInternships() {
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = "";
  statusArea.innerHTML = "";
  resultsCount.textContent = "Loading opportunities…";
  try {
    const response = await fetch("./internships.json", { cache: "no-store" });
    if (!response.ok) throw new Error("The internship list could not be reached.");
    const payload = await response.json();
    if (!Array.isArray(payload.internships)) throw new Error("The internship data has an unexpected format.");
    internships = payload.internships;
    totalCount.textContent = String(internships.length).padStart(2, "0");
    populateDomains();
    renderInternships();
  } catch (error) {
    resultsCount.textContent = "Unable to load opportunities";
    showStatus("We couldn’t load the listings.", "Please check your connection and try again.", true);
  } finally {
    grid.setAttribute("aria-busy", "false");
  }
}

function populateDomains() {
  const domains = [...new Set(internships.map(item => item.domain))].sort();
  domainFilter.innerHTML = '<option value="">All domains</option>' +
    domains.map(domain => `<option value="${escapeHTML(domain)}">${escapeHTML(domain)}</option>`).join("");
}

function renderInternships() {
  const query = searchInput.value.trim().toLowerCase();
  const domain = domainFilter.value;
  const mode = modeFilter.value;
  const filtered = internships.filter(item => {
    const searchable = [item.title, item.domain, item.mode, item.location, ...(item.skills || [])].join(" ").toLowerCase();
    return searchable.includes(query) && (!domain || item.domain === domain) && (!mode || item.mode === mode);
  });

  statusArea.innerHTML = "";
  resultsCount.textContent = `Showing ${filtered.length} of ${internships.length} opportunities`;
  if (!filtered.length) {
    grid.innerHTML = "";
    showStatus("No internships found.", "Try a different keyword or clear one of your filters.");
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="internship-card" aria-labelledby="title-${escapeHTML(item.id)}">
      <div class="card-top"><span class="domain-tag">${escapeHTML(item.domain)}</span><span class="mode-tag">${escapeHTML(item.mode)}</span></div>
      <h3 class="card-title" id="title-${escapeHTML(item.id)}">${escapeHTML(item.title)}</h3>
      <p class="card-location">⌖ &nbsp;${escapeHTML(item.location)}</p>
      <div class="skills" aria-label="Required skills">${(item.skills || []).map(skill => `<span class="skill">${escapeHTML(skill)}</span>`).join("")}</div>
      <div class="card-bottom"><span class="openings">${Number(item.openings)} ${Number(item.openings) === 1 ? "opening" : "openings"}</span>
      <button class="details-btn" type="button" data-details="${escapeHTML(item.id)}">View details <span aria-hidden="true">↗</span></button></div>
    </article>`).join("");

  grid.querySelectorAll("[data-details]").forEach(button => {
    button.addEventListener("click", () => openDetails(button.dataset.details));
  });
}

function openDetails(id) {
  const item = internships.find(record => record.id === id);
  if (!item) return;
  document.querySelector("#dialog-content").innerHTML = `
    <h2 id="dialog-title">${escapeHTML(item.title)}<span>.</span></h2>
    <div class="detail-meta"><span class="domain-tag">${escapeHTML(item.domain)}</span><span class="skill">${escapeHTML(item.mode)}</span><span class="skill">${escapeHTML(item.location)}</span></div>
    <p class="detail-description">${escapeHTML(descriptions[item.domain] || "Explore this opportunity and build your skills.")}</p>
    <p><strong>What you’ll bring</strong></p>
    <ul class="detail-list">${(item.skills || []).map(skill => `<li>${escapeHTML(skill)}</li>`).join("")}</ul>
    <p class="detail-description">${Number(item.openings)} ${Number(item.openings) === 1 ? "position is" : "positions are"} listed for this opportunity.</p>
    <button class="primary-button" id="open-application" type="button">Apply for this role <span aria-hidden="true">↗</span></button>`;
  document.querySelector("#open-application").addEventListener("click", () => {
    detailsDialog.close();
    openApplication(item);
  });
  detailsDialog.showModal();
}

function openApplication(item) {
  document.querySelector("#application-id").value = item.id;
  document.querySelector("#apply-role").textContent = `You’re applying for ${item.title}.`;
  document.querySelector("#form-message").textContent = "";
  document.querySelector("#form-message").className = "form-message";
  document.querySelector("#application-form").reset();
  document.querySelector("#application-id").value = item.id;
  applyDialog.showModal();
  document.querySelector("#applicant-name").focus();
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
[detailsDialog, applyDialog].forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelector("#application-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = document.querySelector("#applicant-name").value.trim();
  const email = document.querySelector("#applicant-email").value.trim();
  const portfolio = document.querySelector("#portfolio-url").value.trim();
  const id = document.querySelector("#application-id").value;
  const message = document.querySelector("#form-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) { message.textContent = "Please enter your name (at least 2 characters)."; return; }
  if (!emailPattern.test(email)) { message.textContent = "Please enter a valid email address."; return; }
  if (portfolio && !/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(portfolio)) { message.textContent = "Please use a valid HTTPS portfolio or LinkedIn URL."; return; }

  const storageKey = "internboard-demo-applications";
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (saved.some(application => application.id === id && application.email.toLowerCase() === email.toLowerCase())) {
    message.textContent = "It looks like you’ve already applied for this role with that email.";
    return;
  }
  saved.push({ id, email, submittedAt: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(saved));
  message.textContent = "Thanks! Your demo application has been saved in this browser.";
  message.classList.add("success");
  form.reset();
});

searchInput.addEventListener("input", renderInternships);
domainFilter.addEventListener("change", renderInternships);
modeFilter.addEventListener("change", renderInternships);
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  domainFilter.value = "";
  modeFilter.value = "";
  renderInternships();
  searchInput.focus();
});
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) && !detailsDialog.open && !applyDialog.open) {
    event.preventDefault();
    searchInput.focus();
  }
});

loadInternships();
