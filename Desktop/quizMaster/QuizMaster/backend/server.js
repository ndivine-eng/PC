const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/Users'); 

dotenv.config(); // Load env vars

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes); // ✅ User routes only

app.get('/', (req, res) => res.send('🎯 QuizMaster API (Users only) is running...'));

sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL database.'))
  .catch((err) => console.error('❌ DB connection error:', err));

sequelize.sync({ force: false })
  .then(() => console.log('✅ Database tables synced.'))
  .catch((err) => console.error('❌ Error syncing tables:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
