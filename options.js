function fmtTime(ts) {
  if (!ts) return "never";
  return new Date(ts).toLocaleString();
}

async function loadUi() {
  const stored = await chrome.storage.local.get([
    "enabled",
    "customDomains",
    "whitelistDomains",
    "updatedDomainsAt",
  ]);
  document.getElementById("enabledToggle").checked = stored.enabled !== false;
  document.getElementById("customDomains").value = (stored.customDomains || []).join("\n");
  document.getElementById("whitelistDomains").value = (stored.whitelistDomains || []).join("\n");
  document.getElementById("listSource").textContent = stored.updatedDomainsAt
    ? "StevenBlack/hosts (refreshed)"
    : "StevenBlack/hosts (bundled default)";
  document.getElementById("listUpdatedAt").textContent = stored.updatedDomainsAt
    ? fmtTime(stored.updatedDomainsAt)
    : "bundled with extension";

  const stats = await chrome.runtime.sendMessage({ action: "getStats" });
  if (stats?.ok) {
    document.getElementById("domainCount").textContent = stats.domainCount.toLocaleString();
    document.getElementById("totalDeleted").textContent = (stats.totalDeleted || 0).toLocaleString();
    document.getElementById("lastSweepAt").textContent = fmtTime(stats.lastSweepAt);
  }
}

function parseLines(text) {
  return text
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

document.getElementById("enabledToggle").addEventListener("change", async (e) => {
  await chrome.storage.local.set({ enabled: e.target.checked });
});

document.getElementById("save").addEventListener("click", async () => {
  const customDomains = parseLines(document.getElementById("customDomains").value);
  const whitelistDomains = parseLines(document.getElementById("whitelistDomains").value);
  await chrome.storage.local.set({ customDomains, whitelistDomains });
  const el = document.getElementById("saveStatus");
  el.textContent = "Saved.";
  setTimeout(() => (el.textContent = ""), 2000);
});

document.getElementById("sweepNow").addEventListener("click", async () => {
  const el = document.getElementById("sweepStatus");
  el.textContent = "Sweeping full history, this may take a moment...";
  const res = await chrome.runtime.sendMessage({ action: "sweepNow" });
  el.textContent = res?.ok ? `Deleted ${res.count} matching entries.` : "Sweep failed.";
  loadUi();
});

document.getElementById("updateList").addEventListener("click", async () => {
  const el = document.getElementById("updateStatus");
  el.textContent = "Fetching latest list from StevenBlack/hosts...";
  const res = await chrome.runtime.sendMessage({ action: "updateList" });
  el.textContent = res?.ok
    ? `Loaded ${res.count.toLocaleString()} domains.`
    : `Update failed: ${res?.error || "unknown error"}`;
  loadUi();
});

loadUi();
