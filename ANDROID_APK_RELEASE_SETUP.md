# Smartschool Android APK release setup

Smartschool's Android wrapper is a Trusted Web Activity (TWA). The APK opens the live Smartschool website in an app-style Android window; student records, sign-in, documents and the assistant still use the secured online services.

## One-time signing key setup (keep this private)

Android updates must use the same signing key. Do not commit the keystore, send it in chat, or share it with students.

On the Android phone, open Termux and run:

```sh
pkg update
pkg install openjdk-21 coreutils
keytool -genkeypair -v -keystore "$HOME/smartschool-release.jks" -alias smartschool -keyalg RSA -keysize 4096 -validity 10000
```

Choose and safely keep the keystore password and key password. For the name and organization prompts, enter the school's approved publisher details.

Convert the keystore to one line of Base64:

```sh
base64 -w 0 "$HOME/smartschool-release.jks"
```

Copy the entire output. In GitHub open **Settings → Secrets and variables → Actions → New repository secret** and add these four secrets:

| Secret name | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Entire Base64 output |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `smartschool` |
| `ANDROID_KEY_PASSWORD` | Key password |

Do not paste any password or Base64 keystore content into ChatGPT, an issue, a pull request, or a normal repository file.

## Build and publish the APK

1. Open the repository's **Actions** tab.
2. Select **Build and publish Smartschool Android APK**.
3. Choose **Run workflow** on the `main` branch.
4. Keep version `1.0.0` for the first release and use hostname `kirimungesenior.vercel.app`.
5. Start the workflow and wait for all steps to pass.

The workflow builds a signed APK, publishes the Android Digital Asset Links fingerprint for the website, and creates a GitHub Release containing `Smartschool.apk`.

## Public download page

After the first successful release, the website page at:

`https://kirimungesenior.vercel.app/download.html`

will link to the latest APK at:

`https://github.com/travistrevor800-debug/Smartschool/releases/latest/download/Smartschool.apk`

The APK requires Android 7.0 or later and an internet connection. Use the same keystore for every future release. Losing it means existing installations cannot receive a signed in-place update.

## Important release checks

- Verify the APK installs on a test Android phone before sharing it widely.
- Verify the website serves `/.well-known/assetlinks.json` after the workflow deploys the fingerprint.
- Confirm the app opens in verified full-screen TWA mode; if the association is not yet deployed, Chrome may show browser controls.
- The APK is a website-backed app, not an offline copy of the whole school system. Private school data is not stored in the service-worker cache.
