# AI Resume Portfolio Generator

An interactive React + Vite experience that turns a PDF resume into a fully designed portfolio site powered by an AI backend. The interface focuses on a rich 3D-inspired design while keeping the original functionality—uploading resumes, submitting them to the API, previewing generated portfolios, and downloading the results.

## ✨ Features

- **Drag-and-drop PDF upload** with live validation (PDF only).
- **API integration** for uploading resumes, previewing generated portfolios, and downloading packaged results.
- **3D-inspired UI** with glassmorphism, dynamic glow, and animated background elements.
- **Inline preview modal** plus quick actions to open a new tab or download outputs.
- **Responsive layout** tuned for both desktop and mobile viewing.

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# run the production build
npm run build

# preview the production bundle
npm run preview
```

The frontend expects the AI service to be available at `http://localhost:3300/api`. Update the `API_BASE` constant in `src/App.jsx` if you need a different endpoint.

## 🔗 Backend Setup

Clone the AI service from the `master` branch of the backend repository and follow its README to configure the required API keys and environment variables.[^backend]

```bash
# clone backend
git clone --branch master https://github.com/Tamilazhagu97/AI-Resume-to-Portfolio-Generator-api.git
cd AI-Resume-to-Portfolio-Generator-api
npm install
npm run dev
```

Once the backend is running on `http://localhost:3300`, this frontend can upload resumes, preview generated portfolios, and trigger downloads.

## 📁 Project Structure

- `src/App.jsx` – main application component containing the UI and API interactions.
- `src/index.css` – Tailwind base imports plus custom 3D utilities and global styles.
- `src/main.jsx` – React entry point.
- `public/` – static assets served by Vite.

## 🛠 Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS** for utility-first styling
- **lucide-react** icon set

## 🧪 Linting

```bash
npm run lint
```

## 📄 License

This project is proprietary to the owner of this repository. Modify and distribute only with permission.

[^backend]: [AI-Resume-to-Portfolio-Generator-api](https://github.com/Tamilazhagu97/AI-Resume-to-Portfolio-Generator-api.git) README.
