const express = require('express');
const authController = require('../controllers/authController');
const listController = require('../controllers/listController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .post(listController.addList)
  .get(listController.getAll);

router.post('/:id', listController.addToList);

router.get('/:id/posts', listController.getPosts);

module.exports = router;
