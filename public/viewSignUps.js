const STORAGE_KEY = "clubSignups";

const CLUB_LABELS = {
  cs: "Computron",
  likha: "Likha",
  polvere: "Gaming Club",
  celluloid: "Celluloid",
};

function safeParseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function getSignups() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeParseJSON(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function gradeLabel(gradeCode) {
  if (!gradeCode) return "";
  if (gradeCode[0] === "g") return `Grade ${gradeCode.slice(1)}`;
  return gradeCode;
}

function statusLabel(status) {
  if (status === "internal") return "Intern";
  if (status === "external") return "Extern";
  return status || "";
}

function renderTable(signups) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  for (const s of signups) {
    const tr = document.createElement("tr");

    const clubName = s.clubLabel || CLUB_LABELS[s.club] || s.club || "";
    const cells = [
      clubName,
      s.studentID || "",
      s.fullname || "",
      gradeLabel(s.grade),
      s.email || "",
      statusLabel(s.status),
    ];

    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
}

function setMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text || "";
}

function updateView(filterValue, allSignups) {
  const totalEl = document.getElementById("totalCount");
  const table = document.getElementById("signupsTable");

  let shown = [];

  if (filterValue === "ALL") {
    shown = allSignups;
  } else {
    shown = allSignups.filter((s) => s.club === filterValue);
  }

  totalEl.textContent = String(shown.length);

  if (allSignups.length === 0) {
    setMessage("No sign-ups saved yet.");
    table.style.display = "none";
    return;
  }

  if (shown.length === 0) {
    const clubName = CLUB_LABELS[filterValue] || filterValue;
    setMessage(`No sign-ups for ${clubName}.`);
    table.style.display = "none";
    return;
  }

  setMessage("");
  table.style.display = "table";
  renderTable(shown);
}

document.addEventListener("DOMContentLoaded", () => {
  const filter = document.getElementById("clubFilter");

  const stored = getSignups();
  if (stored === null) {
    document.getElementById("totalCount").textContent = "0";
    setMessage("No sign-ups saved yet (localStorage is empty).");
    document.getElementById("signupsTable").style.display = "none";
    return;
  }

  updateView("ALL", stored);

  filter.addEventListener("change", () => {
    updateView(filter.value, stored);
  });
});
