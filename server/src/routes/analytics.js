const { Router } = require('express');
const { protect } = require('../middleware/auth');
const { summary, byCategory, monthly } = require('../controllers/analyticsController');

const router = Router();

router.use(protect);

router.get('/summary', summary);
router.get('/by-category', byCategory);
router.get('/monthly', monthly);

module.exports = router;
