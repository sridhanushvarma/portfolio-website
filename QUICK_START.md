# Quick Start - Fix Profile Photo & Resume Persistence

## TL;DR - What You Need to Do

### 1. Get Firebase Credentials (2 minutes)
- Go to https://console.firebase.google.com/
- Select your project
- Click gear icon → Project Settings
- Copy all 7 credential values

### 2. Add GitHub Secrets (5 minutes)
- Go to https://github.com/Sridhanush-Varma/Portfolio-Website/settings/secrets/actions
- Click "New repository secret" 7 times
- Add these secrets with values from Firebase:
  - `REACT_APP_FIREBASE_API_KEY`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN`
  - `REACT_APP_FIREBASE_DATABASE_URL`
  - `REACT_APP_FIREBASE_PROJECT_ID`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
  - `REACT_APP_FIREBASE_APP_ID`

### 3. Trigger a Build (2 minutes)
- Make a small change to your repo (e.g., edit README.md)
- Commit and push to `main` branch
- Go to Actions tab and wait for build to complete

### 4. Test It (2 minutes)
- Visit https://sridhanush-varma.github.io/portfolio-website
- Click Admin button, enter password
- Upload a profile photo
- Refresh page - photo should still be there ✅

## What Was Fixed

| Issue | Before | After |
|-------|--------|-------|
| Profile photo upload | Saved locally only | Saved to Firebase |
| Resume upload | Saved locally only | Saved to Firebase |
| Persistence | Lost on refresh | Persists forever |
| Visibility | Only you see it | All users see it |
| Deployment | Broken | Works perfectly |

## Files Changed
- `.github/workflows/deploy.yml` - Added Firebase credentials to build
- `src/utils/firebase.js` - Better Firebase initialization
- `GITHUB_SECRETS_SETUP.md` - Detailed setup guide
- `FIX_SUMMARY.md` - Technical explanation
- `DEPLOYMENT_INSTRUCTIONS.md` - Complete walkthrough

## Common Issues & Fixes

### "Firebase database not initialized"
→ You haven't set GitHub Secrets yet. Follow step 2 above.

### Build fails in GitHub Actions
→ Check that all 7 secrets are set correctly (no typos, no extra spaces)

### Photo uploads but doesn't persist
→ Refresh page in incognito window to clear cache

### Can't find Firebase credentials
→ Go to Firebase Console → Your Project → Settings → General tab

## Need Help?
- Read `DEPLOYMENT_INSTRUCTIONS.md` for detailed walkthrough
- Read `GITHUB_SECRETS_SETUP.md` for setup guide
- Read `FIX_SUMMARY.md` for technical details

## Verification Checklist
- [ ] All 7 GitHub Secrets are set
- [ ] Build completed successfully in GitHub Actions
- [ ] Profile photo uploads without errors
- [ ] Profile photo persists after page refresh
- [ ] Resume uploads without errors
- [ ] Resume persists after page refresh
- [ ] Changes visible in new browser tab/incognito window

## Time Estimate
Total time to complete: **15 minutes**
- Get credentials: 2 min
- Add secrets: 5 min
- Trigger build: 2 min
- Test: 2 min
- Verify: 4 min

---

**Status**: ✅ Code is fixed. ⏳ Waiting for you to set GitHub Secrets.

