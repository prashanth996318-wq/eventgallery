# Deployment Guide

This guide details the step-by-step procedure to deploy the FirstCry Intellitots Event Photo Gallery Website in production.

---

## 1. Database Deployment (MongoDB Atlas)

1. Log into [MongoDB Atlas Cloud Console](https://cloud.mongodb.com/).
2. Create a new shared cluster (e.g. Free Tier).
3. Under **Network Access**, add IP address whitelist `0.0.0.0/0` (allows connections from Render/Vercel servers).
4. Under **Database Access**, create a user profile with read and write permissions (note down the password).
5. Click **Connect** → Choose **Connect your application** (Node.js driver) and copy the URI string:
   ```ini
   mongodb+srv://<username>:<password>@cluster.mongodb.net/intellitots?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials.

---

## 2. Media Delivery Deployment (Cloudinary)

1. Sign up/Log in to [Cloudinary Dashboard](https://cloudinary.com/).
2. Go to Dashboard page to retrieve:
   * **Cloud Name** (`CLOUDINARY_NAME`)
   * **API Key** (`CLOUDINARY_API_KEY`)
   * **API Secret** (`CLOUDINARY_API_SECRET`)
3. Save these credentials. They will be registered in the backend server parameters.

---

## 3. Backend API Deployment (Render)

1. Log in to [Render](https://render.com/).
2. Click **New** → **Web Service**.
3. Connect your Git repository containing the codebase.
4. Set the following configuration settings:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   * `NODE_ENV` = `production`
   * `MONGO_URI` = *(your MongoDB Atlas connection string)*
   * `JWT_SECRET` = *(a long, secure random hash key)*
   * `CLOUDINARY_NAME` = *(your Cloudinary name)*
   * `CLOUDINARY_API_KEY` = *(your Cloudinary API key)*
   * `CLOUDINARY_API_SECRET` = *(your Cloudinary API secret)*
6. Click **Deploy Web Service**. Render will build and deploy your Express API server and provide a public URL (e.g. `https://intellitots-gallery-api.onrender.com`).

---

## 4. Frontend Application Deployment (Vercel)

1. Sign up/Log in to [Vercel](https://vercel.com/).
2. Click **Add New** → **Project**.
3. Select and import the Git repository.
4. Configure Project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Open **Environment Variables** section and register:
   * `VITE_API_URL` = `https://intellitots-gallery-api.onrender.com/api` (URL pointing to the backend Render API service)
6. Click **Deploy**.
7. Vercel will compile the React bundle and deploy it live, exposing a production URL (e.g. `https://intellitots-gallery.vercel.app`).
