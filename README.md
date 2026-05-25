# MPloyChek Background Verification Application

This repository contains a full-stack application built for the MPloyChek Software Engineer Intern assessment.

## Architecture

The project consists of two main parts:
1.  **Frontend**: An Angular (12+) Single Page Application.
2.  **Backend**: A Node.js Express server that simulates an API and interacts with a local XML database (`db.xml`).

### Key Features Implemented:
*   **Authentication**: Login system that differentiates between "Admin" and "General User" roles.
*   **Dashboard**: Displays user information and a table of background verification records fetched from the API.
*   **Role-Based Access Control**: Admins have an additional "User Management" section to view other users in the system.
*   **Asynchronous Processing**: The backend API includes a configurable delay mechanism (e.g., `?delay=1500`) to simulate slow network responses, and the frontend elegantly handles this using loading spinners and reactive state management.
*   **Modern UI/UX**: The application features a rich, dark-themed aesthetic with glassmorphism effects, smooth animations, and a responsive layout without relying on external heavy UI frameworks like Bootstrap.
*   **Clean Architecture**: Separation of concerns using Angular Services (`AuthService`, `UserService`), Guards (`AuthGuard`), and modular components.

## Prerequisites

*   Node.js (v14 or higher)
*   Angular CLI (`npm install -g @angular/cli`)

## Getting Started

### 1. Start the Backend API

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node server.js
    ```
    The server will run on `http://localhost:3000`.

### 2. Start the Angular Frontend

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    ng serve
    ```
    The application will be available at `http://localhost:4200`.

## Demo Credentials

You can test the application using the following mock accounts stored in `backend/db.xml`:

**Admin User**
*   **User ID:** `admin1`
*   **Password:** `admin123`

**General User**
*   **User ID:** `user1`
*   **Password:** `user123`
