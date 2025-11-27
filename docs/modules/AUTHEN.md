# Authentication Module

## Overview
This module handles user authentication using a **BFF (Backend for Frontend)** pattern with **Server Actions**. It ensures secure access to the application's protected resources.

## Features
- **Registration**: Allows new users to create an account (Planned).
- **Login**: Allows existing users to sign in using **email or username**.
- **Session Management**: Uses **HTTP-Only Cookies** for security, managed by Server Actions.
- **Logout**: Securely clears sessions.

## Technical Approach
We use **Server Actions** to act as a proxy between the Client and the Backend API.

### Key Components
- **Server Actions (`src/actions/auth.ts`)**:
    - Handles `login`, `register`, `logout`.
    - Communicates with the Backend API.
    - Manages HTTP-Only Cookies (`accessToken`, `refreshToken`).
- **State Management (`useAuth`)**:
    - Built with **Zustand**.
    - Calls Server Actions instead of direct API endpoints.
    - Hydrates user data from a non-sensitive cookie.
- **Storage**:
    - **Cookies**:
        - `accessToken` (HTTP-Only).
        - `refreshToken` (HTTP-Only).
        - `userData` (Accessible to Client for UI).

## Flows

### 1. useAuth() Hook
- **Purpose**: Provides access to the current user's authentication state and data.
- **Functionality**:
    - Reads `userData` from Cookies to initialize state.
    - Exposes methods: `login`, `logout`, `register` (which call Server Actions).
    - Exposes state: `user`, `isLoading`, `isAuthenticated`.

### 2. Login Flow (Modal)
1.  **Trigger**:
    - User clicks "Login" button.
    - OR User accesses a protected route -> Middleware redirects to `/?auth_modal=login`.
    - OR API returns `401` -> Interceptor triggers Modal open.
2.  **UI**: Login Modal opens.
3.  User enters **email/username** and **password**.
4.  Frontend calls `loginAction(formData)`.
5.  **Server Action**:
    - Calls Backend API `/auth/login`.
    - Sets **HTTP-Only Cookies**.
    - Returns success.
6.  **Client**:
    - Updates `useAuth` store.
    - Closes Modal.
    - (Optional) Refreshes page or re-fetches data.

### 3. Logout Flow
- **Trigger**: User clicks "Logout" button.
- **Action**:
    - Frontend calls `logoutAction()`.
    - **Server Action**: Deletes all cookies.
    - Client resets store and redirects to Home.

### 4. Registration Flow (Modal)
- Similar to Login, but opens the Registration Modal.
