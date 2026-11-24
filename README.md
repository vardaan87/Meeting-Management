# Meeting Management

A meeting-slot booking application based on the uploaded screen recording. Frontend: HTML/CSS/vanilla JavaScript. Backend: Node.js + Express. Database: MySQL via Sequelize.

## Features
- Four fixed time slots: 2:00 PM, 2:30 PM, 3:00 PM and 3:30 PM.
- Four seats per slot.
- Live available-seat counts from the database.
- Booking form with name and email validation.
- Scheduled meeting cards with link and cancellation.
- Cancelled bookings are retained in the database but no longer consume a seat.

## Requirements
- Node.js 18+
- MySQL Server running locally

## Setup

1. Open this folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the database in MySQL:
   ```sql
   CREATE DATABASE meeting_management;
   ```
4. Copy `.env.example` to `.env` and enter your MySQL username and password:
   ```env
   PORT=3000
   DB_NAME=meeting_management
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   Or use `npm start`.
6. Open **http://localhost:3000** in your browser. Do not open `index.html` directly with Live Server; the page calls the Express API at `/api`.

Sequelize creates the `meetings` table automatically the first time the server starts.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/slots` | List slots and remaining capacity |
| POST | `/api/bookings` | Create a booking (`name`, `email`, `slotTime`) |
| GET | `/api/bookings` | List active scheduled meetings |
| DELETE | `/api/bookings/:id` | Cancel a scheduled meeting |
| GET | `/health` | Check server status |

## Important note about Google Meet

This starter project creates a **demo-shaped** `meet.google.com` URL so the UI can demonstrate displaying/copying a link. It does **not** create a real Google Meet conference. Creating a valid conference requires Google Calendar/Meet API integration, OAuth credentials, and an authorized Google account. Do not send the demo links to actual attendees.

## Project structure

```text
meeting-management/
├── config/
│   └── database.js
├── controllers/
│   └── meetingController.js
├── models/
│   └── Meeting.js
├── routes/
│   └── meetingRoutes.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```
