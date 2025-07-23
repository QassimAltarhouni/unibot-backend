# UniBot Backend

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

A powerful and scalable backend solution for modern web applications.

## 📋 Requirements

- **Node.js** (v16.0.0 or higher recommended)
- **Git** for version control
- **npm** or **yarn** package manager

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd golden-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server (run after build) |

## 🌿 Branching Strategy

We follow a structured branching workflow to maintain code quality:

- **main**: Production-ready code only
- **feature/task-name**: For new features
- **bugfix/task-name**: For bug fixes

### Guidelines

- ❌ No direct pushes to `main` branch
- ✅ Create branches named after Trello tasks (e.g., `feature/GLD-123-user-authentication`)
- ⚠️ Always pull the latest changes before starting work:
  ```bash
  git checkout main
  git pull
  git checkout -b feature/your-feature
  ```

## 📝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.