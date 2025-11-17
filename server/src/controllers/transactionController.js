import pool from "../config/database.js";

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, type, amount, description, category, date, account_id, created_at 
       FROM transactions 
       WHERE user_id = $1 
       ORDER BY date DESC, created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      transactions: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, type, amount, description, category, date, account_id, created_at 
       FROM transactions 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, amount, description, category, date, accountId } = req.body;

    // Validation
    if (!type || !amount || !description || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Create transaction
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, description, category, date, account_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, type, amount, description, category, date, account_id, created_at`,
      [userId, type, amount, description, category, date, accountId || null]
    );

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { type, amount, description, category, date, accountId } = req.body;

    // Check if transaction exists and belongs to user
    const checkResult = await pool.query(
      "SELECT id FROM transactions WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Validation
    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"',
      });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (type) {
      updates.push(`type = $${paramCount}`);
      values.push(type);
      paramCount++;
    }
    if (amount) {
      updates.push(`amount = $${paramCount}`);
      values.push(amount);
      paramCount++;
    }
    if (description) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (category) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }
    if (date) {
      updates.push(`date = $${paramCount}`);
      values.push(date);
      paramCount++;
    }
    if (accountId !== undefined) {
      updates.push(`account_id = $${paramCount}`);
      values.push(accountId || null);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Add id and userId to values
    values.push(id, userId);

    // Update transaction
    const result = await pool.query(
      `UPDATE transactions 
       SET ${updates.join(", ")} 
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING id, type, amount, description, category, date, account_id, updated_at`,
      values
    );

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get financial summary for a user
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
       FROM transactions 
       WHERE user_id = $1`,
      [userId]
    );

    const summary = result.rows[0];

    res.status(200).json({
      success: true,
      summary: {
        totalIncome: parseFloat(summary.total_income),
        totalExpense: parseFloat(summary.total_expense),
        balance: parseFloat(summary.balance),
      },
    });
  } catch (error) {
    next(error);
  }
};
