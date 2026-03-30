# Nickle 💰

## 🚀 Problem

Traditional financial apps rely on passive tracking, making saving money boring and inconsistent. Users struggle with motivation, discipline, and engagement when building financial habits.

---

## 💡 Solution

Nickle is a **gamified financial savings platform** that transforms saving into an engaging experience using:

* XP (experience points)
* Daily streaks
* Goal-based progression
* Leaderboards and rewards

Instead of just tracking money, Nickle **motivates users to actively save and build habits**.

---

## 🧠 Core Features

* 🎯 **Goal-Based Savings** – Create and track financial goals
* 💼 **Wallet System** – Manage and monitor funds
* 🏆 **Leaderboard** – Compete with others to stay motivated
* 🧩 **Quiz System** – Learn finance through interactive quizzes
* 🤖 **AI Financial Coach** – Personalized guidance using Gemini API
* 📊 **Interactive Dashboard** – Real-time charts and insights

---

## 🛠 Tech Stack

* **Frontend:** React + TypeScript + Tailwind CSS
* **Backend:** Flask (Python)
* **Database:** PostgreSQL
* **Charts & UI:** Recharts
* **AI Integration:** Google Gemini API
* **Deployment:**

  * Frontend → Netlify
  * Backend → Render

---

## ⚙️ System Architecture

* Full-stack architecture with **separated frontend and backend**
* REST API communication between services
* PostgreSQL for structured, scalable data storage
* Modular backend design for maintainability

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Nickle.git
cd Nickle
```

---

### 2. Create `.env` File

```env
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key
```

---

### 3. Install Dependencies

#### Backend

```bash
cd backend
pip install -r requirements.txt
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 4. Run the Project

#### Backend

```bash
flask run
```

#### Frontend

```bash
npm run dev
```

---

## 🎯 Demo Flow

User logs in → sets savings goal → earns XP → maintains streak → interacts with AI coach → tracks progress via dashboard → climbs leaderboard

---

## ⚡ Key Challenges Solved

* Resolved **API mismatches** by standardizing request/response contracts
* Fixed **state inconsistencies** in frontend with structured state management
* Debugged **database issues** through schema redesign and validation
* Refactored architecture for scalability and maintainability

---

## 🔥 What Makes This Different

Unlike basic CRUD projects, Nickle is:

* A **production-style fintech system**
* Built with **real-world architecture (frontend + backend separation)**
* Focused on **behavioral engagement through gamification**
* Designed for **scalability and extensibility**

---

## 📌 Future Improvements

* Payment gateway integration
* Mobile app version
* Advanced financial analytics
* Social features and community challenges

---

## ⚠️ Notes

* Do NOT commit `.env`
* Use `.env.example` for reference
* API keys must be securely managed

---

## 📄 License

This project is developed for educational and practical purposes.
