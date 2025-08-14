# ToDoLex - Simple Stride Planner

ToDoLex is a desktop task management application built with Electron and React. It provides monthly and weekly calendar views to help you plan your tasks efficiently.

## Tech Stack

- **Framework:** React
- **Bundler:** Vite
- **Desktop Shell:** Electron
- **Language:** TypeScript
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Package Manager:** Bun

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [Bun](https://bun.sh/) installed on your system.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/LexWhitespike95/simple-stride-planner.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd simple-stride-planner
    ```
3.  Install the dependencies:
    ```sh
    bun install
    ```

### Running the Application

To run the application in development mode, which enables hot-reloading:

```sh
npm run electron:dev
```

## Available Scripts

-   `npm run dev`: Starts the Vite development server for the web interface.
-   `npm run build`: Builds the web interface for production.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run electron:dev`: Runs the full desktop application in development mode.
-   `npm run electron:build`: Builds the distributable desktop application.