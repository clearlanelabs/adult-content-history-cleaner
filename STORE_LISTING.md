# Chrome Web Store listing — copy/paste reference

## Item name
Adult Content History Cleaner

## Category
Productivity (or "Tools", if Productivity isn't offered for this content type)

## Language
English

## Short description (max 132 characters)
Automatically removes adult-content sites from your Chrome history so they never show up as address-bar suggestions.

(131 characters)

## Single purpose statement (required field in dashboard)
This extension has a single purpose: to delete adult-content website entries from the user's local Chrome browsing history so they do not appear as autocomplete suggestions in the address bar.

## Full description

Adult Content History Cleaner keeps your Chrome browsing history free of adult-content sites, automatically.

**How it works**
- The moment you visit a page, the extension checks the site's domain against a large, regularly-updated blocklist of known adult-content domains (76,000+ entries, sourced from the open-source StevenBlack/hosts project).
- If it matches, the entry is deleted from your local Chrome history within moments — so it never shows up as a suggestion when you start typing in the address bar.
- A background sweep also runs hourly to catch anything missed (for example, entries synced in from another signed-in device).

**Everything stays on your device**
This extension does not collect, transmit, or sell any browsing data. All matching and deletion happens locally, using Chrome's own History API. The only network request it ever makes is a single, optional, user-triggered fetch of an updated public domain list — no browsing data is included in that request. Full details in the privacy policy.

**Customizable**
- Add your own domains to always block.
- Add a whitelist of domains that should never be touched, even if they match the list.
- Run a full manual sweep of your entire existing history at any time.
- Refresh the blocklist from its public source on demand.

**Limitations (please read)**
- This extension only affects the Chrome history on the device it's installed on. Chrome extensions cannot run on Chrome for Android or iOS, so it cannot act on mobile devices directly.
- If Chrome Sync is enabled and signed into the same account on another device, deletions will typically propagate there too, but this is a function of Chrome Sync, not something this extension controls directly.
- This extension only removes history entries — it does not block access to sites.

## Data disclosure (Privacy practices tab in the dashboard)

When the dashboard asks "What user data does this item collect?", select:

- **Browsing history** — Yes
  - Purpose: App functionality
  - "Is this data collected... transferred to third parties?" → No
  - "Is this data used for purposes unrelated to the item's core functionality?" → No
  - "Is this data sold to third parties?" → No

All other categories (personally identifiable info, health info, financial info, authentication info, personal communications, location, web history *beyond what's disclosed above*, user activity, website content) → No.

Certify: "I do not sell or transfer user data to third parties outside of the approved use cases" and "I do not use or transfer user data for purposes unrelated to the item's single purpose" — both apply here.

## Privacy policy URL
Host `PRIVACY_POLICY.md` from this folder somewhere public (GitHub Pages, a public Gist, etc.) and paste that URL into the dashboard's privacy policy field. The Store will not accept a policy that isn't reachable at a public URL.

## Permission justifications (dashboard will prompt for each)

- **history**: "Required to detect newly visited adult-content sites and delete the matching entries from the user's local Chrome history."
- **storage**: "Required to persist the user's settings (custom blocked domains, whitelist, enabled/disabled state) locally on the device."
- **alarms**: "Required to schedule an hourly background sweep of history as a backstop, in case an entry is added outside of normal browsing (e.g. synced from another device)."
- **host permission (raw.githubusercontent.com/StevenBlack/hosts/\*)**: "Used only when the user explicitly clicks 'Update blocklist from source' in the options page, to fetch the latest version of the public, open-source adult-domain blocklist this extension relies on. No user data is included in this request."

## Screenshot suggestions
Take 1–2 screenshots (1280×800) of:
1. The Options page showing the status panel and domain count.
2. The popup showing the enabled toggle and "Clean history now" button.

Avoid including any real visited-site history or personal data in screenshots.
