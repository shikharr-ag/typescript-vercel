# Firebase TypeScript Project Setup

## Introduction

This tutorial will guide you through setting up a Firebase project using TypeScript. We will initialize a Firebase project, configure TypeScript, and deploy our app using Firebase Hosting and Cloud Functions.

## Initial Project Setup
```
# Create a new directory for your project
mkdir firebase-typescript-project
cd firebase-typescript-project
```
```
# Initialize npm project
npm init -y
```
```
# Install TypeScript and other dependencies
npm install typescript ts-node --save-dev
npm install firebase firebase-admin
```

```
# Initialize TypeScript
npx tsc --init
```

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))

---

## 1. Initialize Firebase Project

```sh
firebase login
firebase init
```

Select the following features:

- **Hosting** (for deploying web apps)
- **Functions** (for server-side logic, optional)

---

## 2. Setup TypeScript

Inside your project, install TypeScript and required dependencies:

```sh
npm install -D typescript ts-node @types/node
```

Initialize TypeScript:

```sh
tsconfig --init
```

Edit `tsconfig.json` with the following:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

---

## 3. Configure Firebase Functions (Optional)

If using Cloud Functions, navigate to `functions/` and run:

```sh
npm install -D typescript ts-node @types/node
```

Modify `functions/tsconfig.json` to:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "lib"
  },
  "include": ["src"]
}
```

Replace JavaScript function files with TypeScript inside `functions/src/`:

```ts
import * as functions from "firebase-functions";
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});
```

Deploy using:

```sh
firebase deploy --only functions
```

---

## 4. Deploy Firebase Hosting

Modify `public/index.html` as needed, then deploy with:

```sh
firebase deploy --only hosting
```

---

## Conclusion

You have successfully set up a Firebase project with TypeScript! 🎉

