const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

const router = express.Router();

router.use(authController.protect);

router.get('/:urn/comments', postController.getComments);
router.get('/:urn/video', postController.getVideo);

router.post('/:urn/like', postController.likePost);
router.post('/:urn/skip', postController.skipPost);
router.post('/:urn/comment', postController.commentPost);

module.exports = router;
