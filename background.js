const SOURCE_LIST_URL =
  "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts";
const SWEEP_ALARM = "periodicSweep";
const SWEEP_PERIOD_MINUTES = 60;
const SWEEP_PAGE_SIZE = 5000;

let domainSetPromise = null;

function normalizeDomain(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function hostnameCandidates(hostname) {
  const labels = hostname.toLowerCase().split(".");
  const candidates = [];
  for (let i = 0; i < labels.length - 1; i++) {
    candidates.push(labels.slice(i).join("."));
  }
  if (candidates.length === 0) candidates.push(hostname.toLowerCase());
  return candidates;
}

function isBlocked(hostname, blockSet, whitelistSet) {
  const candidates = hostnameCandidates(hostname);
  for (const c of candidates) if (whitelistSet.has(c)) return false;
  for (const c of candidates) if (blockSet.has(c)) return true;
  return false;
}

async function loadDomainState(forceReload = false) {
  if (domainSetPromise && !forceReload) return domainSetPromise;
  domainSetPromise = (async () => {
    const stored = await chrome.storage.local.get([
      "updatedDomains",
      "customDomains",
      "whitelistDomains",
      "enabled",
    ]);

    let baseDomains;
    if (Array.isArray(stored.updatedDomains) && stored.updatedDomains.length) {
      baseDomains = stored.updatedDomains;
    } else {
      const res = await fetch(chrome.runtime.getURL("blocklist/default-domains.json"));
      baseDomains = await res.json();
    }

    const blockSet = new Set(baseDomains);
    for (const d of stored.customDomains || []) {
      const n = normalizeDomain(d);
      if (n) blockSet.add(n);
    }

    const whitelistSet = new Set(
      (stored.whitelistDomains || []).map(normalizeDomain).filter(Boolean)
    );

    return {
      blockSet,
      whitelistSet,
      enabled: stored.enabled !== false,
      domainCount: blockSet.size,
    };
  })();
  return domainSetPromise;
}

function invalidateDomainState() {
  domainSetPromise = null;
}

async function bumpDeletedStat(count) {
  if (!count) return;
  const { totalDeleted = 0 } = await chrome.storage.local.get("totalDeleted");
  await chrome.storage.local.set({
    totalDeleted: totalDeleted + count,
    lastDeletedAt: Date.now(),
  });
}

async function sweepHistory() {
  const { blockSet, whitelistSet, enabled } = await loadDomainState(true);
  if (!enabled) return 0;

  let deleted = 0;
  let endTime = Date.now();

  while (true) {
    const items = await chrome.history.search({
      text: "",
      startTime: 0,
      endTime,
      maxResults: SWEEP_PAGE_SIZE,
    });
    if (!items.length) break;

    for (const item of items) {
      try {
        const hostname = new URL(item.url).hostname;
        if (isBlocked(hostname, blockSet, whitelistSet)) {
          await chrome.history.deleteUrl({ url: item.url });
          deleted++;
        }
      } catch {
        // malformed / non-http(s) URL, skip
      }
    }

    if (items.length < SWEEP_PAGE_SIZE) break;
    endTime = items[items.length - 1].lastVisitTime - 1;
  }

  await chrome.storage.local.set({ lastSweepAt: Date.now() });
  await bumpDeletedStat(deleted);
  return deleted;
}

async function updateBlocklistFromSource() {
  const res = await fetch(SOURCE_LIST_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();

  const domains = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("0.0.0.0 ")) continue;
    const domain = trimmed.slice(8).trim().toLowerCase();
    if (domain && domain !== "0.0.0.0" && domain !== "localhost") {
      domains.push(domain);
    }
  }

  const unique = Array.from(new Set(domains));
  await chrome.storage.local.set({
    updatedDomains: unique,
    updatedDomainsAt: Date.now(),
  });
  invalidateDomainState();
  return unique.length;
}

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get("enabled");
  if (existing.enabled === undefined) {
    await chrome.storage.local.set({ enabled: true });
  }
  chrome.alarms.create(SWEEP_ALARM, { periodInMinutes: SWEEP_PERIOD_MINUTES });
  sweepHistory().catch(() => {});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SWEEP_ALARM) {
    sweepHistory().catch(() => {});
  }
});

chrome.history.onVisited.addListener(async (result) => {
  try {
    const { blockSet, whitelistSet, enabled } = await loadDomainState();
    if (!enabled) return;
    const url = new URL(result.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (isBlocked(url.hostname, blockSet, whitelistSet)) {
      await chrome.history.deleteUrl({ url: result.url });
      await bumpDeletedStat(1);
    }
  } catch {
    // ignore
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.customDomains || changes.whitelistDomains || changes.enabled || changes.updatedDomains) {
    invalidateDomainState();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message?.action === "sweepNow") {
      const count = await sweepHistory();
      sendResponse({ ok: true, count });
    } else if (message?.action === "updateList") {
      try {
        const count = await updateBlocklistFromSource();
        sendResponse({ ok: true, count });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
    } else if (message?.action === "getStats") {
      const state = await loadDomainState();
      const stored = await chrome.storage.local.get([
        "totalDeleted",
        "lastSweepAt",
        "lastDeletedAt",
        "updatedDomainsAt",
      ]);
      sendResponse({
        ok: true,
        domainCount: state.domainCount,
        enabled: state.enabled,
        ...stored,
      });
    }
  })();
  return true;
});
