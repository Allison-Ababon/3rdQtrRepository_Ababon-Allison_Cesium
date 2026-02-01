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
  if (!raw) return [];
  const parsed = safeParseJSON(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveSignups(signupsArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signupsArray));
}

function getFormDataObject(form) {
  const fd = new FormData(form);

  const clubCode = String(fd.get("club") || "").trim();
  const gradeCode = String(fd.get("grade") || "").trim();

  return {
    studentID: String(fd.get("studentID") || "").trim(),
    fullname: String(fd.get("fullname") || "").trim(),
    birthday: String(fd.get("birthday") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    grade: gradeCode,
    status: String(fd.get("status") || "").trim(),
    club: clubCode, // e.g. cs
    clubLabel: CLUB_LABELS[clubCode] || clubCode,
    reason: String(fd.get("reason") || "").trim(),

    createdAtISO: new Date().toISOString(),
  };
}

function confirmSubmit() {
  const ok = confirm("Submit your application?");
  if (!ok) return false;

  const form = document.querySelector("form");
  const newSignup = getFormDataObject(form);

  const signups = getSignups();
  signups.push(newSignup);
  saveSignups(signups);

  alert("Saved! Your sign-up is now stored on this browser.");

  form.reset();
  return false;
}

function confirmReset() {
  return confirm("Reset the form?");
}

function checkEmpty(el) {
  if (!el) return;
  const value = (el.value || "").trim();
  el.style.border = value ? "" : "2px solid red";
}

function goToViewSignups() {
  window.location.href = "viewSignUps.html";
}
