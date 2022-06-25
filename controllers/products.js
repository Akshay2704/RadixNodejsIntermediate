const express = require('express');
const mongoose = require('mongoose');
const { body, check, validationResult } = require('express-validator');
const Product = require('./../models/productsdata.js');
const { db } = require('./../models/productsdata.js');

const router = express.Router();

const getProducts = async (req, res) => {
    try {
        const product = await Product.find({}, { _id: 0, __v: 0});

        //search filter
        const filters = req.query;
        const filteredProduct = product.filter(user => {
            let isValid = true;
            for (key in filters) {
                isValid = isValid && user[key] == filters[key];
            }
            return isValid;
        });
        console.log('Products : ', filteredProduct);
        res.status(200).send(filteredProduct);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

const getSpecProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ pId: req.params.pId }, { _id: 0, __v: 0});
        if (!product) {
            res.status(404).json({ message: "productId not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

const createProduct = async (req, res) => {
    try {
        // const { storeName, pId, pName } = req.body;
        // if (!(storeName && pId && pName)) {
        //     res.status(400).send("All field is required");
        // }
        //console.log(req.body.products);
        var result = req.body.map(a => a.pId);
        var id = await Product.find({ pId: { $in: result } });
        //const id = await Product.findOne({ pId}) 
        if (id.length > 0) {
            return res.status(409).send("pId already exist.");
        }
        let newProduct = await Product.create(req.body)
        newProduct = JSON.parse(JSON.stringify(newProduct).split('"_id":').join('"productId":'));
        res.status(201).send(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}

const updateProduct = async (req, res) => {
    const pId = req.params.pId;
    try {
        const product = await Product.findOne({ pId: req.params.pId });
        if (!product) {
            res.status(404).json({ pId: parseInt(pId), message: "productID not found" });
        } else {
            const update = await Product.updateOne({ pId: pId }, req.body)
            if (update.nModified > 0) {
                res.status(200).json({ pId: pId, message: "data updated successfully" });
            }
        }
        res.status(200).json({ pId: pId, message: "same data" });
        // const update = await Product.findOneAndUpdate(pId, req.body,
        //     {new:true})

    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

const deleteProduct = async (req, res) => {
    const pId = req.params.pId;
    try {
        const product = await Product.findOne({ pId: req.params.pId });
        if (!product) {
            res.status(404).json({ message: "productID not found" });
        } else {
            await Product.deleteOne({ pId: pId })
            res.status(200).json({ pId: pId, message: "data deleted successfully" });
        }
    }
    // await Product.findOneAndRemove({ pId: pId });
    // res.status(203).json({pId: pId, message: "data deleted successfully"});
    catch (err) {
        res.status(402).json({ message: err.message });
    }
}

module.exports.getProducts = getProducts;
module.exports.createProduct = createProduct;
module.exports.getSpecProduct = getSpecProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;