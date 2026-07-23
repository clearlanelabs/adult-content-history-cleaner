# Privacy Policy — Adult Content History Cleaner

_Last updated: 2026-07-23_

Adult Content History Cleaner ("the extension") is a browser tool that removes adult-content websites from your local Chrome browsing history. This policy explains what data the extension accesses and what it does with it.

## Data the extension accesses

- **Browsing history (via the `history` permission).** The extension reads the URL and hostname of pages you visit, compares the hostname against a blocklist of known adult-content domains, and deletes matching entries from your local Chrome history using the `chrome.history.deleteUrl` API.

## Data the extension does NOT do

- It does **not** transmit your browsing history, visited URLs, or any personally identifiable information to any server, developer, or third party.
- It does **not** use analytics, telemetry, or crash-reporting services.
- It does **not** sell, rent, or share any data with third parties.
- It does **not** use your data for advertising, credit, or any purpose unrelated to the extension's single function of cleaning history entries.

## The one network request the extension makes

The extension bundles a static list of known adult-content domains. If you explicitly click **"Update blocklist from source"** in the Options page, the extension fetches an updated domain list from a single, fixed, public URL:

```
https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts
```

This is a one-way download of a public text file (a list of domain names maintained by the open-source [StevenBlack/hosts](https://github.com/StevenBlack/hosts) project). No browsing history, identifiers, or any other data is sent as part of this request — it is a plain GET request with no request body or query parameters derived from your data.

## Data storage

- Your enabled/disabled state, custom domain list, whitelist, and cached blocklist are stored locally on your device using the `chrome.storage.local` API.
- This data never leaves your device and is not synced to any external service by the extension itself.
- Uninstalling the extension removes all of this locally stored data.

## Permissions used and why

| Permission | Purpose |
|---|---|
| `history` | Required to detect and delete matching history entries. |
| `storage` | Required to save your settings (custom domains, whitelist, enabled state) locally. |
| `alarms` | Required to run a periodic (hourly) background sweep of history. |
| `host_permissions` for `raw.githubusercontent.com/StevenBlack/hosts/*` | Required only for the optional, user-initiated "Update blocklist from source" button. |

## Contact

Questions about this policy can be sent to: paragpaliwal91@gmail.com
