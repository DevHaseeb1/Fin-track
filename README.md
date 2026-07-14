# ExpenseTracker

Full-stack personal finance application built with Node.js, Express, MongoDB, and React. Track income and expenses, categorize transactions, and view spending summaries.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Frontend | React (Vite), React Router |
| Styling | Tailwind CSS |
| Charts | Recharts |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend dev server proxies `/api` requests to `http://localhost:5000`.

## API Routes

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account (seeds default categories) |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user profile |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories` | List user's categories |
| POST | `/categories` | Create category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category (blocks if transactions reference it) |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | List (filter: `type`, `category`, `startDate`, `endDate`, `page`, `limit`) |
| GET | `/transactions/:id` | Get single transaction |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/summary` | Total income, expense, net balance |
| GET | `/analytics/by-category` | Spend/income grouped by category |
| GET | `/analytics/monthly` | Income vs expense by month |

## Deployed URLs

- **Backend:** https://expense-tracker-api.onrender.com (placeholder)
- **Frontend:** https://expense-tracker.vercel.app (placeholder)

## Project Structure

```
Fin-Track/
├── server/          # Express API
│   ├── src/
│   │   ├── config/   # DB connection
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # Express routers
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── utils/        # Helpers
│   │   └── app.js        # Entry point
│   └── package.json
├── client/          # React SPA
│   ├── src/
│   │   ├── api/       # Axios instance
│   │   ├── context/   # AuthContext
│   │   ├── components/  # Reusable UI
│   │   ├── pages/     # Page components
│   │   ├── utils/     # Helpers (currency formatting)
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── postman/         # Postman collection
└── README.md
```
