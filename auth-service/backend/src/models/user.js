const pool = require('../config/database');

class User {
  static async create(cognitoId, email, username) {
    const query = `
      INSERT INTO users (cognito_id, email, username, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [cognitoId, email, username]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  static async findByCognitoId(cognitoId) {
    const query = 'SELECT * FROM users WHERE cognito_id = $1';
    const result = await pool.query(query, [cognitoId]);
    return result.rows[0];
  }

  static async updateLastLogin(cognitoId) {
    const query = 'UPDATE users SET last_login = NOW() WHERE cognito_id = $1';
    await pool.query(query, [cognitoId]);
  }

  static async existsByEmail(email) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await pool.query(query, [email]);
    return result.rows[0].exists;
  }

  static async existsByUsername(username) {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)';
    const result = await pool.query(query, [username]);
    return result.rows[0].exists;
  }
}

module.exports = User;
