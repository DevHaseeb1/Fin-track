const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { list, getById, create, update, remove } = require('../controllers/transactionController');

const router = Router();

router.use(protect);

router.get('/', list);
router.get('/:id', getById);

router.post('/', [
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date')
], validate, create);

router.put('/:id', [
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date')
], validate, update);

router.delete('/:id', remove);

module.exports = router;
