const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('./../middleware/check-auth');
const { products_get_all, 
        products_get_product, 
        products_remove_product, 
        products_create_product, 
        products_update_product } = require('./../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    cb(null, date + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter,
});

const Product = require('./../models/product');

router.get('/', products_get_all );

router.post('/', checkAuth, upload.single('productImage'), products_create_product );

router.get('/:productId', products_get_product );

router.patch('/:productId', checkAuth, products_update_product );

router.delete('/:productId', checkAuth, products_remove_product );

module.exports = router;