# Lumen legal content review — 21 September 2026

Prepared locally for owner review; nothing has been published. The effective date
is 21 September 2026 as requested. Review the generated Privacy, Terms, Support,
Data controls and Delete account pages before publishing these policies.

## Implementation basis

Checked the sibling Lumen app repository's `src/account.js`, `account-ui.js`,
`subscription.js`, `membership.js`, `access.js`, `main.js`, `storage.js`,
`profile-photo.js`, cloud bridges, native defaults and dependencies.

- Google/Apple sign-in uses Firebase; RevenueCat uses the Firebase UID. Feature
  availability depends on build configuration; this review does not certify the
  production service configuration or store launch readiness.
- Daily Spark is free without sign-in. Monthly Pro unlocks available content.
  Bundled questions replace the old separate-download flow.
- Access checks require verified entitlements and stop at the earlier of seven
  days since verification or access expiry, including an applicable grace period.
- Deletion reauthenticates and deletes Firebase sign-in; Apple authorization is
  revoked through the existing flow. It does not reset local progress, cancel
  store renewal or automatically delete RevenueCat records.
- Native cloud backup is disabled by the checked defaults. No separate usage
  analytics, advertising or crash-reporting integration was found. RevenueCat
  purchase reporting is disclosed separately.

## Provider references checked

- [Firebase user profiles and deletion](https://firebase.google.com/docs/auth/web/manage-users)
- [Firebase privacy and retention](https://firebase.google.com/support/privacy)
- [RevenueCat customer identifiers](https://www.revenuecat.com/docs/customers/identifying-customers)
- [RevenueCat deletion and subscription independence](https://www.revenuecat.com/docs/dashboard-and-metrics/customer-profile)
- [RevenueCat data disclosures and purchase analytics](https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy)
- [RevenueCat privacy](https://www.revenuecat.com/privacy)
- [Apple cancellation](https://support.apple.com/en-us/118428) and [restoration](https://support.apple.com/en-us/108096)
- [Google Play cancellation](https://support.google.com/googleplay/answer/7018481?hl=en)

## Owner policy choices reflected in the draft

Private requests go to `glitchlabsio@gmail.com`. No unsupported fixed retention or
deletion deadline is promised. Email requests may require ownership verification;
the page does not imply an automated email-deletion service. Provider records and
support correspondence are handled separately. The under-13 exclusion remains,
without claiming an age-verification flow exists.

## Local verification

Run the generator with the dependencies in `scripts/requirements-performance.txt`,
then `python3 scripts/check-pages.py` and `python3 scripts/check-optimized.py` in that
environment. The generator invokes the optimizer itself.

Preview with `python3 -m http.server 8088 --bind 127.0.0.1`, then open
`http://localhost:8088/lumen/privacy.html` and `http://localhost:8088/lumen/terms.html`.
The page check now verifies all Lumen source fragments survive generation,
Terms/deletion links appear in the document navigation and product footers, and
the private deletion-request email route exists.

Chrome checks cover all seven Lumen pages at 1440×1000, 768×1024 and 320×568,
including 2× density on tablet/phone, loaded assets/fonts, horizontal overflow,
sidebar/footer navigation and email links. Full-page screenshots of fixed
backgrounds can show dark areas outside the initial viewport; scrolled viewport
captures are used to assess the actual background while reading.
