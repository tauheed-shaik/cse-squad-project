# Smart-Hire Memories: CSE A Journey (2022–2026)

A private, emotionally engaging, and highly interactive digital memory platform for the CSE A batch.

## 🚀 Features
- **Cinematic Landing Page**: Blurred previews for outsiders, inviting them to join the journey.
- **3D Interactive Background**: Floating memory spheres and stars powered by Three.js.
- **Dynamic Timeline**: Vertical archive of memories grouped by academic years (2022-2026).
- **Ghost Whispers**: Send and receive completely anonymous messages from classmates.
- **Message Wall**: A public feed to share thoughts, like, and comment on peer posts.
- **Surprise Me**: A magic button that resurfaces a random memory from the vault.
- **Premium UI**: Dark mode with vibrant orange accents and glassmorphism.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Three Fiber.
- **Backend**: Node.js, Express, MongoDB.
- **Storage**: Cloudinary (for production-grade media handling).
- **Auth**: JWT & bcrypt.

## ⚙️ Setup Instructions

### 1. Server Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm start
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

## 🔐 Access Control
- **Public**: Can only see the Landing Page with blurred/masked content.
- **Classmates**: Register with Roll Number to unlock the full timeline, feed, and messaging system.

---
"We became a family... this platform holds our story."
❤️ Made for CSE A
