require('dotenv').config();
const pool = require('./src/config/database');

const fixUser = async () => {
  try {
    const result = await pool.query(
      `INSERT INTO users (cognito_id, email, username, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (cognito_id) DO NOTHING 
       RETURNING *`,
      ['b40804d8-c021-706f-1844-0937b297bf62', 'onlinerahulpatel@gmail.com', 'onlinerahulpatel']
    );
    console.log('User added:', result.rows[0] || 'Already exists');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixUser();
