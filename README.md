# Aura

**Aura** is an innovative, open-source AI agent designed to revolutionize web development. By leveraging the power of AI, Aura makes building websites accessible and intuitive for developers of all skill levels. While Aura currently uses **Google Gemini**, you can customize it to use other models compatible with the **Vercel AI SDK**.

---

## ✨ Features

- **AI-powered frontend web app builder**: Create React-based web applications directly in your browser.
- **Open-source innovation**: Fully customizable to fit your development style.

---

## 🚀 Roadmap & Features in Development

- ✅ **Download project as ZIP**: Export your work with ease.
- ✅ **AI thinking capabilities**: Enhance decision-making and problem-solving during development (now on beta).
- ⬜ **Blob storage**: Storing images in file system (working).
- ⬜ **Stock Image**: Ability to use stock images while development (working).
- ⬜ **Pages Support**: Support for cloudflare page (working).
- ⬜ **Persistent chat history**: Remember conversations and context for better continuity.
- ⬜ **Codespace VM-based previews**: Use Codespaces for enhanced project previews.
- ⬜ **Prompt enhancements**: Smarter and more intuitive prompts.
- ⬜ **Git integration**: Push, pull, and manage code directly.
- ⬜ **Error detection in previews**: Spot and debug issues instantly.
- ⬜ **Deploy buttons**: One-click deployment to popular hosting platforms.
- ⬜ **Image-to-website**: Transform design ideas into fully functional web pages.

---

## 🪲 Bugs

- **Preview**: The preview initially displays "Hello, World!" You can close it and reopen it from the file manager to view it again (fixed).

Currently, the only known issue is the timeout limitation, which is dependent on the service provider. I recommend setting it to at least 60 seconds; otherwise, the system may not function properly. Additionally, occasional message breaks may occur due to Gemini 2.0 Flash being experimental and subject to high load.

If you encounter any other issues, please report them.

---

## 🛠 Prerequisites

Before you get started, make sure you have the following installed:

- **Node.js** (latest LTS version recommended)
- **PNPM** (used as the package manager)

---

## 📦 Getting Started

1. Clone the repository and navigate to the project folder:

   ```bash
   git clone https://github.com/4thweb/openaura.git
   cd aura
   ```

2. Install PNPM globally (if not already installed):

   ```bash
   npm install -g pnpm
   ```

3. Install project dependencies:

   ```bash
   pnpm install
   ```

4. Build the project:

   ```bash
   pnpm run build
   ```

5. Run the development server:

   ```bash
   pnpm run dev
   ```

---

## 💡 Contributing

We welcome contributions! If you have ideas or improvements, feel free to submit a pull request or open an issue.