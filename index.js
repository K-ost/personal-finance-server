const jsonServer = require("json-server");
const auth = require("json-server-auth");
const db = require("./db.json");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Add custom routes
server.get("/api/budgets/transactions", async (req, res) => {
  try {
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
    res.jsonp(output);
  } catch (error) {
    return res.jsonp({ msg: "Server error" });
  }
});

server.use(middlewares);
server.use(cors({ origin: "*" }));
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
