const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const db = require('./models');
const v1Routes = require('./routes/index')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Hello World');
})

app.use('/api/v1',v1Routes)


sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});