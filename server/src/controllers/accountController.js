import pool from "../config/database.js";

// @desc    Get all accounts for user
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, name, type, account_number, icon, initial_balance, created_at
       FROM accounts
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
      [userId]
    );

    res.status(200).json({ success: true, accounts: result.rows });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type, accountNumber, icon, initialBalance } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Name and type are required" });
    }

    const result = await pool.query(
      `INSERT INTO accounts (user_id, name, type, account_number, icon, initial_balance)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, type, account_number, icon, initial_balance, created_at`,
      [
        userId,
        name,
        type,
        accountNumber || null,
        icon || "wallet",
        initialBalance || 0,
      ]
    );

    res.status(201).json({ success: true, account: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, type, accountNumber, icon, initialBalance } = req.body;

    // Ensure the account belongs to the user
    const check = await pool.query(
      "SELECT id FROM accounts WHERE id=$1 AND user_id=$2",
      [id, userId]
    );
    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    const updates = [];
    const params = [];
    let p = 1;

    if (name !== undefined) {
      updates.push(`name=$${p++}`);
      params.push(name);
    }
    if (type !== undefined) {
      updates.push(`type=$${p++}`);
      params.push(type);
    }
    if (accountNumber !== undefined) {
      updates.push(`account_number=$${p++}`);
      params.push(accountNumber);
    }
    if (icon !== undefined) {
      updates.push(`icon=$${p++}`);
      params.push(icon);
    }
    if (initialBalance !== undefined) {
      updates.push(`initial_balance=$${p++}`);
      params.push(initialBalance);
    }

    updates.push("updated_at=CURRENT_TIMESTAMP");

    params.push(id, userId);

    const result = await pool.query(
      `UPDATE accounts SET ${updates.join(
        ", "
      )} WHERE id=$${p++} AND user_id=$${p} RETURNING id, name, type, account_number, icon, initial_balance, created_at, updated_at`,
      params
    );

    res.status(200).json({ success: true, account: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Ensure the account belongs to the user
    const check = await pool.query(
      "SELECT id FROM accounts WHERE id=$1 AND user_id=$2",
      [id, userId]
    );
    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    await pool.query("DELETE FROM accounts WHERE id=$1 AND user_id=$2", [
      id,
      userId,
    ]);

    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    next(error);
  }
};
