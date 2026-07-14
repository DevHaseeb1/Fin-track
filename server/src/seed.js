require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');

const seedTransactions = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne();
  if (!user) {
    console.log('No user found. Register first, then run seed again.');
    process.exit(1);
  }

  const categories = await Category.find({ user: user._id });
  const catMap = {};
  categories.forEach(c => { catMap[c.name] = c._id; });

  const transactions = [
    { category: catMap['Salary'], type: 'income', amount: 120000, description: 'Monthly salary', date: '2026-07-01' },
    { category: catMap['Freelance'], type: 'income', amount: 35000, description: 'Freelance project', date: '2026-07-05' },
    { category: catMap['Food'], type: 'expense', amount: 4500, description: 'Grocery shopping', date: '2026-07-02' },
    { category: catMap['Food'], type: 'expense', amount: 1200, description: 'Lunch out', date: '2026-07-03' },
    { category: catMap['Transport'], type: 'expense', amount: 2500, description: 'Fuel', date: '2026-07-04' },
    { category: catMap['Bills'], type: 'expense', amount: 15000, description: 'Electricity bill', date: '2026-07-06' },
    { category: catMap['Bills'], type: 'expense', amount: 8000, description: 'Internet & phone', date: '2026-07-06' },
    { category: catMap['Rent'], type: 'expense', amount: 40000, description: 'Monthly rent', date: '2026-07-01' },
    { category: catMap['Shopping'], type: 'expense', amount: 6500, description: 'New shoes', date: '2026-07-08' },
    { category: catMap['Healthcare'], type: 'expense', amount: 2000, description: 'Pharmacy', date: '2026-07-10' },
    { category: catMap['Investments'], type: 'income', amount: 10000, description: 'Dividend payout', date: '2026-07-12' },
    { category: catMap['Food'], type: 'expense', amount: 3500, description: 'Dinner', date: '2026-06-25' },
    { category: catMap['Transport'], type: 'expense', amount: 1000, description: 'Taxi', date: '2026-06-28' },
    { category: catMap['Salary'], type: 'income', amount: 120000, description: 'Monthly salary', date: '2026-06-01' },
    { category: catMap['Rent'], type: 'expense', amount: 40000, description: 'Monthly rent', date: '2026-06-01' },
    { category: catMap['Food'], type: 'expense', amount: 4800, description: 'Grocery shopping', date: '2026-06-15' },
    { category: catMap['Bills'], type: 'expense', amount: 14000, description: 'Electricity bill', date: '2026-06-05' },
    { category: catMap['Shopping'], type: 'expense', amount: 12000, description: 'Clothes', date: '2026-06-20' },
  ];

  await Transaction.deleteMany({ user: user._id });
  await Transaction.insertMany(
    transactions.map(t => ({ ...t, user: user._id }))
  );

  console.log(`Seeded ${transactions.length} transactions`);
  await mongoose.disconnect();
};

seedTransactions().catch(err => { console.error(err); process.exit(1); });
