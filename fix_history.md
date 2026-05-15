# Fix History

## 2026-05-15

- Fixed OTP email sending in `BACKEND/server.js`.
- Removed hardcoded Gmail sender address and switched the backend to read `EMAIL_USER` and `EMAIL_PASS` from environment variables, with fallback support for `EMAIL_PASSWORD` and `EMAIL_FROM`.
- Loaded environment variables from both the backend folder and the repository root so the backend can find the project's `.env` file reliably.
- Reworked OTP mail sending into a shared `sendOtpEmail()` helper and used it for both `/api/generate-otp` and `/api/signup-with-otp`.
- Updated the feedback reply mail route to use the same configured sender address.
- Fixed `src/utils/otpUtils.js` so a provided OTP is stored instead of generating a different local code.
- Updated `src/pages/SignupPage.jsx` so resend OTP also goes through the backend instead of the old local EmailJS fallback.

## Notes

- If Nodemailer still logs `Missing credentials for "PLAIN"`, the running backend process is not loading valid `EMAIL_USER` and `EMAIL_PASS` values yet.
- Make sure the backend is restarted after updating `.env`.
- For Gmail, use an app password, not the normal account password.
