const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const buildDateFilter = (userId, startDate, endDate) => {
  const filter = { user: userId };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

exports.summary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = buildDateFilter(req.user._id, startDate, endDate);

  const result = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  result.forEach(r => {
    if (r._id === 'income') totalIncome = r.total;
    else if (r._id === 'expense') totalExpense = r.total;
  });

  const range = {
    start: startDate || 'all',
    end: endDate || 'all'
  };

  success(res, { range, totalIncome, totalExpense, netBalance: totalIncome - totalExpense });
});

exports.byCategory = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = buildDateFilter(req.user._id, startDate, endDate);

  const result = await Transaction.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo'
      }
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: { name: '$categoryInfo.name', type: '$type' },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: '$_id.name',
        type: '$_id.type',
        total: 1
      }
    }
  ]);

  const range = {
    start: startDate || 'all',
    end: endDate || 'all'
  };

  success(res, { range, data: result });
});

exports.monthly = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = buildDateFilter(req.user._id, startDate, endDate);

  const result = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthlyMap = {};

  result.forEach(r => {
    const key = `${r._id.year}-${String(r._id.month).padStart(2, '0')}`;
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: r._id.month, year: r._id.year, income: 0, expense: 0 };
    }
    if (r._id.type === 'income') monthlyMap[key].income = r.total;
    else monthlyMap[key].expense = r.total;
  });

  const data = Object.values(monthlyMap).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const range = {
    start: startDate || 'all',
    end: endDate || 'all'
  };

  success(res, { range, data });
});
