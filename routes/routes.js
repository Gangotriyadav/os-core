const express = require('express');
const router = express.Router();
const Model = require('../model/model');
const bcrypt = require("bcrypt");

router.post('/post', async (req, res) => {
    try {
       const { email, password } = req.body;
       const existingUser = await Model.findOne({ email });
       if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
       }
       const hashedPassword = await bcrypt.hash(password, 10);

       const data = new Model({ email, password: hashedPassword });
       const savedUser = await data.save();
       res.status(200).json(savedUser);

    } catch (error) {
       console.error("Signup Error", error);
       res.status(500).json({ message: "Something went wrong" });
    }
});



router.get('/getAll', async (req, res) => {
   try {
       const data = await Model.find();
       res.json(data);
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
});


router.get('/getOne/:id', async (req, res) => {
   try {
       const data = await Model.findById(req.params.id);
       if (!data) {
           return res.status(404).json({ message: "Data not found" });
       }
       res.json(data);
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
});


router.patch('/update/:id', async (req, res) => {
   try {
       const id = req.params.id;
       const updateData = req.body;
       const option = { new: true };


       const result = await Model.findByIdAndUpdate(id, updateData, option);
       if (!result) {
           return res.status(404).json({ message: "Data not found for update" });
       }
       res.json(result);
   } catch (error) {
       res.status(400).json({ message: error.message });
   }
});


router.delete('/delete/:id', async (req, res) => {
   try {
       const id = req.params.id;
       const data = await Model.findByIdAndDelete(id);
       if (!data) {
           return res.status(404).json({ message: "Data not found for deletion" });
       }
       res.send(`${data.name} data deleted`);
   } catch (error) {
       res.status(400).json({ message: error.message });
   }
});

module.exports = router;