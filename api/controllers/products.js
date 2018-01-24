const mongoose = require('mongoose');

const Product = require('./../models/product');

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          }
        })
      }
      // if(docs.length > 0){
      res.status(200).json(response);
      // }else{
      //   res.status(404).json({
      //     message: 
      //   })
      // }

    }).catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path.replace(/\\/, '/')
  });
  product.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry for provided ID.' })
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err })
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.products_remove_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'Product deleted.',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};