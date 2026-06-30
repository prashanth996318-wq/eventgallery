# FirstCry Intellitots Event Photo Gallery Website

A secure, full-stack event photo gallery system tailored for **FirstCry Intellitots Preschool**. This application enables teachers to create event albums and upload photos tagging specific students, allows administrators to audit and approve albums, and gives parents a private portal to view and download only authorized photographs where their children are tagged.

---

## 🚀 Key Features

* **Three Role Dashboards**: Authorized workspaces for **Admins**, **Teachers**, and **Parents**.
* **Milestone Tagging**: Teachers tag individual students during photo uploads.
* **Granular Parent Galleries**: Parents view *only* approved albums and photos containing tags of their own child.
* **Image Management Fallback**: Integrated Cloudinary support for production CDN media delivery, with automatic fallback to local storage paths on disk for offline testing.
* **One-Click Blob Downloader**: Safe, high-speed image blob downloads for parent keepsakes.
* **Administrative Audit Queue**: Review queue where admins approve, reject, or provide feedback for teacher creations.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, React Router v6, Axios, Tailwind CSS, Lucide Icons, Vite
* **Backend**: Node.js, Express.js, JWT Authentication (JsonWebToken), Bcryptjs, Multer
* **Database**: MongoDB Atlas (via Mongoose ODM)

---

## 📂 Folder Directory Layout

```text
workspace/
├── backend/
│   ├── config/             # DB and Cloudinary setup configs
│   ├── controllers/        # Controllers for Auth, Students, Albums, Photos
│   ├── middleware/         # Auth JWT, Role checks, Multer storage engines
│   ├── models/             # Mongoose Models (User, Student, Album, Photo)
│   ├── routes/             # Express API routers
│   ├── uploads/            # Local uploads fallback directory
│   ├── .env                # Server credentials configuration
│   ├── server.js           # Server application startup
│   └── seed.js             # DB Bootstrap Seeding Script
├── frontend/
│   ├── src/
│   │   ├── components/     # PrivateRoute, StatCard, AlbumCard, DashboardLayout
│   │   ├── context/        # Global AuthContext provider state
│   │   ├── pages/          # Home, Login, and Dashboards (Admin, Teacher, Parent)
│   │   ├── services/       # Axios API services layer (api.js)
│   │   ├── App.jsx         # App router maps
│   │   ├── index.css       # Tailwind entry styles & animations
│   │   └── main.jsx        
│   ├── tailwind.config.js  # Color schemes configuration
│   └── vite.config.js
├── Postman_Collection.json # Importable Postman Collection
├── Sample_Data.json        # Database payload format reference
├── README.md               
├── Deployment_Guide.md     
└── Testing_Report.md       
```

---

## 🏁 Fast Start Instructions

### Prerequisites
* [Node.js](https://nodejs.org) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance running or MongoDB Atlas connection string)

### 1. Database & Server Setup (Backend)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment parameters. Create a `.env` file (copied from `.env.example`):
   ```ini
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/event-photo-gallery
   JWT_SECRET=super_secret_jwt_key_firstcry_intellitots
   ```
4. **Seed the database**: Run the bootstrap seeder to pre-populate the database with demo users, students, approved events, and tagged photographs:
   ```bash
   npm run seed
   ```
5. Launch the backend API server:
   ```bash
   npm start
   ```
   *The server will start running on [http://localhost:5000](http://localhost:5000).*

### 2. Dashboard Interface Setup (Frontend)
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite local dev server:
   ```bash
   npm run dev
   ```
   *The client interface will run on [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Demo Access Credentials

Seeding the database creates the following profiles for immediate logins:

| Role | Username / Email | Password | Linked Child / Tags |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@firstcry.com` | `admin123` | *All permissions* |
| **Teacher** | `teacher@firstcry.com` | `teacher123` | *Create & upload permissions* |
| **Parent 1** | `parent1@firstcry.com` | `parent123` | Tagged Child: **Aanya Verma** |
| **Parent 2** | `parent2@firstcry.com` | `parent123` | Tagged Child: **Kabir Malhotra** |
