# React Blog App - Complete Project Guide
# PROJECT OVERVIEW
A full-stack blog application built with React, Redux, Supabase, and TypeScript. Users can register, login, create/edit/delete posts, and browse featured blogs.

##  IDEAL STEPS TO BUILD THIS PROJECT FROM SCRATCH

### **Phase 1: Project Setup (Foundation)**
1. **Create React + Vite Project**
   - `npm create vite@latest react-blog-learning -- --template react-ts`
   - Install dependencies: `npm install`

2. **Install Core Dependencies**
   - State Management: `npm install @reduxjs/toolkit react-redux`
   - Backend: `npm install @supabase/supabase-js`
   - Routing: `npm install react-router-dom`
   - Styling: `npm install tailwindcss @tailwindcss/vite`

3. **Setup Development Tools**
   - ESLint: `npm install --save-dev eslint`
   - TypeScript configuration
   - Vite configuration

---index.css---

@import "tailwindcss";
:root {font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; height: 100%; width: 100%;}
a {font-weight: 500;color: #646cff;text-decoration: inherit;}
a:hover {color: #535bf2;}
body {margin: 0;min-width: 320px;min-height: 100vh;}
h1 {font-size: 3.2em;line-height: 1.1;}
h2 {font-size: 2.4em;line-height: 1.2;}

---

### **Phase 2: Backend Setup (Supabase)**
1. **Create Supabase Project**
   - Sign up at supabase.com
   - Create new project
   - Get API keys (URL & ANON_KEY)
2. **Setup Environment Variables**
   - Create `.env` file with:
     ```
     VITE_SUPABASE_URL=your_url
     VITE_SUPABASE_ANON_KEY=your_key
     ```
     
---

### **Phase 3: Authentication System (Redux + Supabase)**
1. **Create Redux Store Structure**
   - Setup Redux store in `src/app/store.ts`
   - Create auth slice with `setAuth` reducer

2. **Implement Auth Listener**
   - Create `AuthListener.tsx` component
   - Listen to Supabase auth state changes
   - Dispatch user data to Redux on login/logout

3. **Create Authentication Pages**
   - **LoginPage.tsx**: Form with email/password, Supabase signIn
   - **RegisterPage.tsx**: Form with email/password, Supabase signUp
   - Handle errors and loading states

4. **Create Protected Routes**
   - Create `ProtectedRoute.tsx` component
   - Check if user exists before rendering pages
   - Redirect to login if not authenticated

---