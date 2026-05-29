# 🛕 శ్రీ వరసిద్ది వినాయక స్వామి వారి ఆలయం — సింగంపల్లి

ఆలయ నిర్మాణ నవీకరణలు, నోటీసులు, కార్యక్రమాలు, విరాళాల వివరాలు అందించే అధికారిక React Web App.

---

## 🚀 Local లో Run చేయడం

```bash
# 1. Dependencies install చేయండి
npm install

# 2. App start చేయండి
npm start
```

Browser లో `http://localhost:3000` లో తెరుచుకుంటుంది.

---

## 🌐 GitHub Pages లో Deploy చేయడం

### Step 1 — gh-pages package install చేయండి

```bash
npm install --save-dev gh-pages
```

### Step 2 — `package.json` లో ఈ మార్పులు చేయండి

```json
"homepage": "https://<మీ-username>.github.io/vinayaka-temple-app",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### Step 3 — Deploy చేయండి

```bash
npm run deploy
```

---

## 📱 Features

| Feature | వివరాలు |
|---|---|
| 🔐 Auth | Register / Login (Phone + Password) |
| 📰 Feed | Posts, Photos, Videos |
| 📢 Notices | అత్యవసర నోటీసులు |
| 📅 Events | నిర్మాణ కార్యక్రమాల Timeline |
| ℹ️ Info | కమిటి సభ్యులు, దాతలు |
| 🖼️ Gallery | ఫోటో గ్యాలరీ |
| 💛 Donations | UPI, Bank Transfer వివరాలు |
| 👑 Admin Panel | Posts, Events, Donors, Committee CRUD |

---

## 🔧 Admin Login

| Field | Value |
|---|---|
| User ID | `VS2026NT` |
| Password | `Vs@1417` |

> ⚠️ Production లో admin credentials మార్చుకోండి.

---

## 🗂️ Project Structure

```
vinayaka-temple-app/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.jsx             # Main component (all logic)
│   └── index.js            # React entry point
├── .gitignore
├── package.json
└── README.md
```

---

## 📝 Notes

- Data `localStorage` లో save అవుతుంది — same browser లో persist అవుతుంది.
- Cross-device sync కావాలంటే Firebase Firestore integrate చేయవచ్చు.
- App Telugu font support కోసం Google Fonts load చేస్తుంది.

---

🙏 **జయ గణేశా!**

---

## 🔥 Firebase Real-time Sync

ఈ app Firebase Firestore వాడుతుంది — ఒకే సమయంలో ఇద్దరు admins post చేసినా real-time గా అందరికీ update అవుతుంది.

### Firestore Rules (Console లో పెట్టండి)

Firebase Console → Firestore → Rules → ఈ rules paste చేయండి:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vtData/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> ⚠️ తర్వాత auth add చేసిన తర్వాత rules restrict చేయవచ్చు.
