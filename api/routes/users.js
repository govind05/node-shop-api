const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');
const {user_login, user_signup, user_remove} = require('./../controllers/users');

router.post('/signup', user_signup );

router.post('/login', user_login );

router.delete('/:userId', user_remove );

module.exports = router;