# Account: copy change notes

Copy in `src/content/account.ts` (`accountCopy.login`, `.signup`, `.forgotPassword`, `.account`). Figma: login 4:959 and 133:36579, signup 78:2530 and 133:36671, forgot-password 100:4081 and 133:36768, profile 92:2963 and 133:36817. The Google button uses the official SVG and its label text is Figma's. Typos and casing are not listed.

| Where (key) | Before (Figma) | After | Why |
|---|---|---|---|
| `login.header.lede` | Log in to report an issue and follow your tickets until they are resolved. | Same | Already plain and under 20 words |
| `login.fields.keepLoggedIn` | Keep me logged in | Same | Kept |
| `login.guest.body` | Read project updates, the traffic map and FAQs. Log in to report an issue or track a ticket. | Same | Kept. States what a guest can and cannot do |
| `signup.passwordHint` | At least 8 characters, with a number. | Same | Rule list `passwordRules` splits it for live checks |
| `forgotPassword.header.lede` | Enter the email you use for Mutiara Line. We will send you a link to set a new password. | Same | Kept |
| `forgotPassword.note` | The link expires after 30 minutes. Signed up with Google? Use Sign in with Google instead. | Same | Kept. VERIFY A4 |
| `account.details.rows.email.unverified` | (not shown) | Not verified | Counterpart of "Verified" |
| `account.reports.meta` | MLC-261028-0482, updated 29 Oct 2026 at 10:12 | Built from a function with ticket ID, date and time | One format for every row |
| `account.security.devices.logOutOthers` | Log out other devices | Log out of other devices | Grammar |
| `account.privacy.download.requested` | (not shown) | We've got your request. We will email {email} when your copy is ready. | Confirmation state |

## Hidden content

- **Login errors (6):** wrong email or password (one message, so it does not reveal which emails have accounts), unknown email, too many attempts, network, Google failed, Google cancelled. Empty-field and bad-format errors for both fields.
- **Sign-up errors and states:** name, email, password length and number, account exists (with a way forward), Google errors. A password rules list, a strength label and a success state with a verification note.
- **Forgot password:** the "Check your email" state (same text whether or not the email has an account), a resend countdown, and rate-limit and network errors.
- **Profile:** edit-in-place labels, hints and errors for name, email, phone, home area and language. Empty and loading states for each section. Stations: add picker with search and empty result, remove with undo. Notifications: five items with hints, saved and failed messages. Password change dialog with five errors. Google disconnect confirmation. Devices. Data download request states. Delete account confirmation with a typed DELETE, a working state, a failure and a done page. Log out confirmation.
- **Mock data added:** `src/data/mock/account-profile.ts` (phone, member since, verified, Google email, devices, notification defaults), typed in `src/data/models/account.ts`. Values come from Figma. Mei Ling's name, email, home area and followed stations come from the existing `mockUser`.
- **Placeholders `{name}` and `{email}`** in a few strings are filled by the builder. Strings with several moving parts are functions.
- **Login page legal line** keeps Figma's "Terms & Conditions" and "Privacy policy." (the full stop is in Figma's link text; the builder may drop it).
