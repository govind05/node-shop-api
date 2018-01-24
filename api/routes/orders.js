const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('./../models/order');
const Product = require('./../models/product');
const checkAuth = require('./../middleware/check-auth');
const { get_all, get_order, delete_order, create_order } = require('./../controllers/orders');

router.get('/', checkAuth, get_all);

router.post('/', checkAuth, create_order);

router.get('/:orderId', checkAuth, get_order);

router.delete('/:orderId', checkAuth, delete_order);

module.exports = router;