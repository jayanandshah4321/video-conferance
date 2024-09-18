const mongoose = require('mongoose');
const Meeting = require('../models/meeting');

const CreateMeeting = async (req, res) => {
    try {
        const meeting = new Meeting(req.body);
        await meeting.save();
        res.status(201).send(meeting);
    
    } catch (error) {
        res.status(200).json({ message: error });
    }
}
module.exports=CreateMeeting;