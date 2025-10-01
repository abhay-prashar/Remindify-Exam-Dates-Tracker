# 📚 Remindify – Exam Dates Tracker

Remindify is a simple full-stack web app that helps students **track upcoming exams**.  
Built with **React (Vite) + TailwindCSS** for the frontend and **Express + MongoDB** for the backend.  

Deployed on:
- 🌐 Frontend: [Vercel](https://vercel.com)
- ⚙️ Backend: [Render](https://render.com)
- 📦 Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 🚀 Features
- Add upcoming exams with subject, type, and date  
- Search exams by subject/type  
- Highlights the next upcoming exams in red for quick visibility  
- Mobile responsive, clean UI (TailwindCSS)  
- Deployed online – accessible anywhere  

---

## 🛠️ Tech Stack
**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Vercel (hosting)

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Render (hosting)

---

## ✨ Future Improvements

- User login (personalized exams list)

- Notifications/reminders for exams

- Dark mode UI

## Admin-only add protection

To prevent everyone from adding exams, the API now requires an admin key for write operations.

Setup:

- In `backend/.env`, add a strong secret key:

	```env
	ADMIN_KEY=your-strong-secret-here
	```

- Restart the backend server after changing `.env`.

Usage:

- On the Add Exam form, enter the admin code before submitting. The frontend sends it in an `x-admin-key` header, and the backend validates it. Requests without a valid key receive 403 Forbidden.

Security notes:

- This is a simple shared-secret approach suitable for small private usage. For larger deployments, prefer proper user authentication and roles.
