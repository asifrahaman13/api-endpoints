const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require("express-validator");

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    }
    catch (err) {
        res.status(400).send({ err: "error occured" });
    }

})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title for the note').isLength({ min: 5 }),
    body('description', "The description of the note should be minimum 10 characters.").isLength({ min: 20 })
],
    async (req, res) => {
        try {
            const { title, description, tag } = await req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const notes = new Notes({
                title, description, tag, user: req.user.id
            });
            const saveNotes = notes.save();
            res.json(saveNotes);
        }
        catch (err) {
            res.status(400).send({ err: "error occured" });
        }
    }
)

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = await req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };
    let note = await Notes.findById(req.params.id);
    if (!note) (res.status(404)).send("Not found");
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json(note);
})


router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) (res.status(404)).send("Not found");
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted" });
    }
    catch (err) {
        res.status(400).send("Some error occured")
    }

})

module.exports = router;
