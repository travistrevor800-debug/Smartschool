# Smartschool Android APK release

Smartschool is packaged as a Trusted Web Activity (TWA), so the Android app opens the existing secure Smartschool website in a standalone Android experience. The Android wrapper does not copy school records onto the APK.

## One-time release signing setup

A release APK must be signed with a private key. Keep the same key for every future update: Android will reject an update signed with a different key. Never commit the keystore or share it in chat.

On Android Termux:

1. Install Java/keytool:
   ```sh
   pkg update
   pkg install openjdk-17
   ```
2. Generate the private signing key:
   ```sh
   keytool -genkeypair -v -keystore smartschool-release.jks -alias smartschool -keyalg RSA -keysize 2048 -validity 10000
   ```
   Remember the keystore password and key password. Using the same password for both is simplest.
3. Encode the keystore for GitHub:
   ```sh
   base64 smartschool-release.jks | tr -d '\n' > smartschool-keystore-base64.txt
   ```
4. Open the Smartschool GitHub repository, then **Settings → Secrets and variables → Actions → New repository secret**. Add:
   - `ANDROID_KEYSTORE_BASE64`: the full contents of `smartschool-keystore-base64.txt`
   - `ANDROID_KEYSTORE_PASSWORD`: the keystore password
   - `ANDROID_KEY_ALIAS`: `smartschool`
   - `ANDROID_KEY_PASSWORD`: the key password
5. Delete the temporary base64 text file from your phone when the secret has been saved. Keep `smartschool-release.jks` backed up privately in at least two secure places. Do not commit either file to GitHub.

## Build and publish the APK

1. Open the repository's **Actions** tab.
2. Select **Build and publish Smartschool Android APK**.
3. Tap **Run workflow**, enter the release version (first release: `1.0.0`), then run it.
4. The workflow builds and signs `Smartschool.apk`, publishes the SHA-256 signing fingerprint to `/.well-known/assetlinks.json`, and creates a GitHub Release.
5. Wait for the Vercel deployment that includes `assetlinks.json` to finish. Then verify:
   `https://kirimungesenior.vercel.app/.well-known/assetlinks.json`
6. The download page at `/download.html` links to the latest APK release.

## Important

- The Android package ID is `ke.co.kirimunge.smartschool`. Do not change it after distribution.
- The workflow takes the website hostname as an input and applies it to the Android launch URL, Android link verification and website association. Always enter the exact production hostname used by the school.
- The website and Supabase remain the source of truth. Authentication and Row Level Security continue to protect student and parent information.
- The APK requires internet access for sign-in, school records, documents and the School Assistant.
- The first build cannot be published until the four GitHub Actions secrets above are configured.
