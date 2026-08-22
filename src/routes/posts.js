const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const validatePost = require('../middleware/validate');

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', validatePost, postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

module.exports = router;
