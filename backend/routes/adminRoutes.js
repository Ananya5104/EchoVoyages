import express from 'express'
import { customers } from '../models/customerModel.js';
import { packages } from '../models/packageModel.js';
import { reviews } from '../models/customerReviewModel.js';
const router = express.Router()
// get all coustomers
router.get('/customers',async (req,res) => {
    try {
        const custs = await customers.find({});
        return res.status(200).json({
            count: custs.length,
            data: custs
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

// delete a customer
router.delete('/customers/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" User deleted"})


    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// update customers
router.put('/customers/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const result = await customers.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" User not found"})
        }
        return res.status(200).json({message:" user updated"})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// view a single customer
router.get('/customers/:id',async (req,res) => {
    try {
        let {id} = req.params
        id = id.toString()
        const custs = await customers.findOne({ _id: id });
        return res.status(200).json(custs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})

// view all packages
router.get('/packages',async (req,res) => {
    try {
        const packs = await packages.find({});
        return res.status(200).json({
            count: packs.length,
            data: packs
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})
// view a single package
router.get('/packages/:id',async (req,res) => {
    try {
        let {id} = req.params
        id = id.toString()
        const packs = await packages.findOne({ _id: id });
        return res.status(200).json(packs)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// update package
router.put('/packages/:id',async (req,res) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Package not found"})
        }
        return res.status(200).json({message:" package updated"})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// delete a package
router.delete('/packages/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" package not found"})
        }
        return res.status(200).json({message:" package deleted"})


    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
    
})
// get all reviews
router.get('/reviews',async (req,res) => {
    try {
        const revs = await reviews.find({});
        return res.status(200).json({
            count: revs.length,
            data: revs
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})
router.get('/reviews/:id', async (req, res) => {
    try {
        const review = await reviews.findById(req.params.id)
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.put('/reviews/:id', async (req, res) => {
    try {
        const { rating, comment, status } = req.body;

        // Update review fields
        const review = await reviews.findByIdAndUpdate(
            req.params.id,
            { rating, comment, status },
            { new: true }
        );
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send(review);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await reviews.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        return res.status(200).send({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
export default router