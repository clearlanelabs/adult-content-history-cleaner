function fmtTime(ts) {
  if (!ts) return "never";
  return new Date(ts).toLocaleString();
}

async function refresh() {
  const stats = await chrome.runtime.sendMessage({ action: "getStats" });
  if (!stats?.ok) return;
  document.getElementById("enabledToggle").checked = stats.enabled;
  document.getElementById("domainCount").textContent = stats.domainCount.toLocaleString();
  document.getElementById("totalDeleted").textContent = (stats.totalDeleted || 0).toLocaleString();
  document.getElementById("lastSweep").textContent = fmtTime(stats.lastSweepAt);
}

document.getElementById("enabledToggle").addEventListener("change", async (e) => {
  await chrome.storage.local.set({ enabled: e.target.checked });
});

document.getElementById("sweepNow").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Cleaning...";
  const res = await chrome.runtime.sendMessage({ action: "sweepNow" });
  statusEl.textContent = res?.ok ? `Deleted ${res.count} entries.` : "Failed.";
  refresh();
});

refresh();
