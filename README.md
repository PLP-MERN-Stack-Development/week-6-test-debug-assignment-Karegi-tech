Here’s a complete and clean README.md file for your Week 6 MERN Testing & Debugging Assignment:

markdown
Copy
Edit
# 🐛 MERN Stack Bug Tracker – Testing & Debugging Assignment (Week 6)

This is a MERN stack-based Bug Tracker application with a strong focus on **unit testing**, **integration testing**, and **component testing** using tools like **Jest**, **Supertest**, **MongoMemoryServer**, and **React Testing Library**.

---

## 🗂 Project Structure

project-root/
├── client/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Button.jsx
│ │ │ └── Button.test.jsx
│ │ └── utils/
│ │ ├── slugify.js
│ │ └── slugify.test.js
├── server/
│ ├── src/
│ │ ├── app.js
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ └── Post.js
│ │ └── utils/
│ │ └── auth.js
│ └── tests/
│ └── integration/
│ └── posts.test.js

yaml
Copy
Edit

---

## ⚙️ Installation

```bash
# Clone the project
git clone https://github.com/your-username/week-6-bug-tracker.git

# Navigate to client and install dependencies
cd client
npm install

# Navigate to server and install dependencies
cd ../server
npm install
🚀 Running the App
Make sure your backend (server) is running before you test endpoints.

bash
Copy
Edit
# Start client (in /client)
npm run dev

# Start server (in /server)
npm start
✅ Running Tests
🧪 Backend Integration Tests (Supertest + MongoMemoryServer)
bash
Copy
Edit
# From project root
cd server
npx jest tests/integration/posts.test.js
🧪 Frontend Unit/Component Tests (React Testing Library)
bash
Copy
Edit
cd ../client
npx jest
🧪 Utility Function Tests
bash
Copy
Edit
# Example: Slugify tests
cd client
npx jest utils/slugify.test.js
🧾 Coverage Report
To check how much of your code is covered by tests:

bash
Copy
Edit
# From /server or /client
npx jest --coverage
🛠️ Technologies Used
MongoDB with mongodb-memory-server for in-memory testing

Express.js

React.js (with Vite)

Node.js

Jest – test runner

Supertest – API testing

React Testing Library – UI component testing

Babel – ES6+ support in Jest

JWT Auth – JSON Web Tokens for protected route tests

👨‍💻 Author
Marion Mwangi – @Karegi-tech

📬 Contact
🌐 GitHub: github.com/Karegi-tech