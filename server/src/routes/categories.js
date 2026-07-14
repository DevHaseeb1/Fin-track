const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { list, create, update, remove } = require('../controllers/categoryController');

const router = Router();

router.use(protect);

router.get('/', list);

router.post('/', [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense')
], validate, create);

router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense')
], validate, update);

router.delete('/:id', remove);

module.exports = router;
