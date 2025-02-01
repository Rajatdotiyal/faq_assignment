const express = require('express');
const FAQController = require('../controllers/faqControllers');

const router = express.Router();

// Public routes for fetching FAQs
// GET /api/faqs/ - Get all FAQs (with optional lang parameter)
// GET /api/faqs/?lang=hi - Get all FAQs in Hindi
// GET /api/faqs/?lang=bn - Get all FAQs in Bengali
router.get('/', FAQController.list);

// Get single FAQ with language support
router.get('/:id', FAQController.getById);

// Protected admin routes
router.post('/', FAQController.create);
router.put('/:id', FAQController.update);

module.exports = router;