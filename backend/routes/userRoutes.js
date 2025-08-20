const express = require('express');
const { authenticateToken } = require('../helper/authMiddleware');
const { getProfile, updateProfile, updateUserInfo, changePassword, deleteUser, listUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/user/profile', authenticateToken, getProfile);
router.put('/user/profile', authenticateToken, updateProfile);
router.put('/user/info', authenticateToken, updateUserInfo);
router.put('/user/password', authenticateToken, changePassword);
router.get('/users', authenticateToken, listUsers);

// Admin/dev routes
router.delete('/admin/delete-user/:userId', deleteUser);
router.get('/admin/users', listUsers);

module.exports = router;

