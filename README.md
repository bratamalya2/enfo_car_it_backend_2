# Delivery Management System 🚚

## 📋 Objective

This project is a miniature version of how large commerce platforms like Amazon, Delhivery, and Bluedart manage delivery operations — built using **Node.js (Express)** and **Prisma ORM**.

It includes:
- Agents (Delivery Partners)
- Orders (Goods for delivery)
- Warehouses (Where goods are stored)

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- Prisma ORM (with SQLite or PostgreSQL)
- Lightweight Frontend (optional — Vue.js)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd delivery-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
```

(If you are using PostgreSQL, adjust the `DATABASE_URL` accordingly.)

### 4. Prisma Migrations

Run the following commands:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates the database tables based on `prisma/schema.prisma`.

### 5. Seed the Database

```bash
node src/seed.js
```

This populates:
- 10 warehouses
- 20 agents per warehouse
- 60 orders per agent

### 6. Start the Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📖 API Routes (for Postman Testing)

### Agents

| Method | Route | Description |
|:------:|:-----|:-------------|
| `POST` | `/agents/check-in/:id` | Check-in an agent |
| `GET` | `/agents/:id/orders` | Get orders assigned to an agent |

### Warehouses

| Method | Route | Description |
|:------:|:-----|:-------------|
| `GET` | `/warehouses/:id` | Get warehouse details |

### Orders

| Method | Route | Description |
|:------:|:-----|:-------------|
| `POST` | `/orders/allocate` | Allocate orders to agents based on constraints |

---

## 📜 Features

- **Agent Check-In** to their respective warehouse
- **Automatic Order Allocation**:
  - No more than 10 working hours per agent
  - No more than 100 km travel per agent
- **Compensation Calculations**:
  - Minimum Guarantee of 500 INR/day
  - Incentives based on number of orders delivered
- **Efficient Warehouse and Order Management**
- **Basic Error Handling and Validations**

---

## 🚀 Deployment Suggestions

- Use **Railway**, **Render**, or **Vercel** for Node.js backend hosting.
- Use **PlanetScale** or **Neon** for managed PostgreSQL database hosting.
- Setup **PM2** for process management if deploying to VPS like AWS Lightsail or DigitalOcean.

---

## 🧪 Bonus (Optional)

- Added unit tests using `jest` and `supertest`
- Swagger API documentation
- Simple Vue.js dashboard for monitoring deliveries

---

## 📸 Screenshots

> *(Add screenshots of Postman responses and/or a small dashboard here)*

---

## 🙏 Acknowledgements

- Prisma ORM Documentation
- Express.js Documentation
- Original challenge idea inspired by commerce platforms

---

## 📚 License

This project is licensed under the MIT License.
