# 📘 Project Conventions

## 🧩 Domain-Driven Layered Structure

This project follows a **Domain-Driven Layered Architecture** for better modularity, scalability, and maintainability.

```

📁 domain/
┣ 📁 user/
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
┣ 📁 trade/
┃ ┣ 📁 controller/
┃ ┣ 📁 service/
┃ ┗ 📁 repository/
📁 router/
┣ 📄 userRouter.js
┗ 📄 tradeRouter.js

```

---

## 📦 Router Convention

### 1. Create a Router File

```bash
# Example
touch router/userRouter.js
````

### 2. Register the Router in `index.js`

Routers should be registered in `index.js` using a **parent domain path**.

```js
// index.js
const userRouter = require('./router/userRouter');
app.use(`${API_PREFIX}/user`, userRouter); // Exposes /users/login, /users/me, etc.
```

> 📌 **Convention**: Use `app.use(`${API_PREFIX}/user`, userRouter);` format for clear route scoping.

---

## ⚙️ Layer Responsibilities

| Layer          | Responsibility                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Controller** | Receives the request, extracts data (params/body), and calls service layer. Handles all exceptions from service layer. |
| **Service**    | Contains core business logic. All errors and exceptions must be thrown from this layer using `throw new Error(...)`.   |
| **Repository** | Contains direct database query logic only. No business logic should be written here.                                   |

---

## ❗ Error Handling Convention

* **All errors must be thrown in the service layer**
  Example:

  ```js
  // service/userService.js
  if (!user) {
    throw new Error('User not found');
  }
  ```

* **Controller must handle all errors using try/catch**

  ```js
  // controller/userController.js
  exports.getUser = async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  ```

---

## ✍️ Naming Conventions

* **Controller functions**: Clearly describe the action (e.g., `signup`, `login`, `getUserInfo`)
* **Service functions**: Express domain-level operations (e.g., `createUser`, `verifyPassword`)
* **Repository functions**: Simple DB operations (e.g., `findByEmail`, `insertUser`)

---

## 🧪 Recommended Structure

* `common/utils/`: Shared utility functions across domains
* `middlewares/`: Common middleware like authentication, logging
* `config/`: Configuration files (e.g., `.env`, DB, CORS)

---
