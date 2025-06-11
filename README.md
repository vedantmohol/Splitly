# Splitly Backend

A MERN backend to split expenses among a group with smart settlements.

## Features

- Add and view people
- Add expenses (equal, exact, percentage)
- View who owes how much
- Auto-settlement logic
- API error handling

## API Base URL

https://splitly-backend.onrender.com


## Sample People

- Shantanu
- Sanket
- Om

## API Endpoints

| Method | Endpoint                          | Description                            |
| ------ | --------------------------------- | -------------------------------------- |
| GET    | `/api/settlements/getPeople`      | Get list of all people                 |
| GET    | `/api/expense/getExpenses`        | Get list of all expenses               |
| POST   | `/api/expense/addExpense`         | Add a new expense                      |
| PUT    | `/api/expense/updateExpense/:id`  | Update an existing expense             |
| DELETE | `/api/expense/deleteExpense/:id`  | Delete an expense                      |
| GET    | `/api/settlements/getSettlements` | Get settlement summary (who owes whom) |
| GET    | `/api/settlements/getBalances`    | Get balance per person                 |

## Setup (Local)

1. Clone repo
2. Install dependencies: npm install
3. Create `.env`: MONGODB_URL='mongodb+srv://vedantmohol18:Krsna18@splitly.l8w4hko.mongodb.net/splitly?retryWrites=true&w=majority&appName=splitly'   PORT=3000
4. Run dev server: npm run dev

   
## Deployment

- Backend: [Render](https://splitly-backend.onrender.com)
- DB: MongoDB Atlas

## Postman Collection

- 📁 Public Gist: [Postman Collection Link](https://gist.github.com/vedantmohol/07c2f46f161068046f9dbbfa2927124a)

## Notes

- No local setup needed — everything runs on deployed backend
- Pre-populated with:
- 3 people (Shantanu, Sanket, Om)
- Sample expenses with all split types
- Balances/summary are auto-computed
