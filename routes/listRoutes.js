const express = require('express');
const authController = require('../controllers/authController');
const listController = require('../controllers/listController');

const router = express.Router();

// Middleware that applies to all routes
router.use(authController.protect);

// General list operations
router
  .route('/')
  .post(listController.addList)
  .get(listController.getAll);

// Single list operations
router
  .route('/:id')
  .put(listController.updateListName)
  .delete(listController.deleteList);

// List-specific operations
router.route('/:id/monitored').get(listController.getMonitoredUsers);

router.route('/:id/posts').get(listController.getPostsLive);

router
  .route('/:id/skipped')
  .get(listController.getSkippedPosts)
  .post(listController.skipPost);

router.route('/:id/engagements').get(listController.getEngagements);

// Actions on lists
router.post('/awareSynced', listController.awareListsUploaded);
router.post('/:id/add', listController.addToList);
router.delete('/:id/:userId', listController.deleteFromList);
router.post('/:id/commentToProfile', listController.commentToProfile);
router.post('/:id/likeToProfile', listController.likeToProfile);
router.get('/:id/getListUrl', listController.getListUrl);
router.post('/:id/addDuplicateLists', listController.addDuplicateLists);

module.exports = router;
