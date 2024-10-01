const jsonServer = require("json-server");
const cors = require("cors");
const auth = require("json-server-auth");
const db = require("./db.json");

const PORT = process.env.PORT || 8000;

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Add custom routes
server.get("/api/budgets/transactions", function (req, res) {
  const output = db.budgets.map((budget) => {
    const transactions = db.transactions
      .filter((el) => el.category === budget.category && el.amount < 0)
      .slice(0, 3);
    return {
      ...budget,
      spent: 0,
      latest: transactions,
    };
  });
  return res.json(output);
});

// server.db = router.db;

server.use(middlewares);
server.use(cors());
server.use("/api", auth);
server.use("/api", router);

server.listen(PORT, () => {
  console.log(`JSON Server is running
    Resources
    http://localhost:${PORT}/api/balance
    http://localhost:${PORT}/api/transactions
    http://localhost:${PORT}/api/budgets
    http://localhost:${PORT}/api/pots
    http://localhost:${PORT}/api/users
    http://localhost:${PORT}/api/budgets/transactions
    
    Home
    http://localhost:${PORT}
  `);
});
