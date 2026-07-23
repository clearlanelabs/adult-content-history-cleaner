# Adult Content History Cleaner

A Chrome extension that automatically removes adult-content sites from your local browsing history, so they never appear as address-bar autocomplete suggestions.

**Chrome Web Store:** not yet published — link will be added here once the listing is live.

## How it works

- Watches for new history entries (`chrome.history.onVisited`) and deletes any that match a domain on the blocklist, within moments of the page loading.
- Runs an hourly background sweep (`chrome.alarms`) as a backstop, in case an entry is added outside normal browsing (e.g. synced in from another signed-in device).
- Ships with a bundled list of 76,000+ known adult-content domains, sourced from the open-source [StevenBlack/hosts](https://github.com/StevenBlack/hosts) project. The list can be refreshed on demand from the options page.
- Lets you add custom domains to always block, and a whitelist of domains to never touch.

Everything runs and stays on-device. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details — in short, no browsing data is ever transmitted anywhere; the only network request is a single, optional, user-triggered fetch of the public blocklist file.

## Limitations

- Chrome extensions cannot run on Chrome for Android or iOS, so this only cleans history on the desktop/laptop it's installed on directly. If Chrome Sync is enabled across devices, deletions typically propagate, but that's a function of Chrome Sync, not this extension.
- This only removes history entries — it does not block access to sites.

## Installing (until published to the Store)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder

## License

MIT
