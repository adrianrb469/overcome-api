const Event = require('../models/eventModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Report = require('../models/reportModel')

// Create report
exports.createReport = async (req, res) => {
    try {
        const report = await Report.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                report,
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        })
    }
}

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({})
            .populate('reporter', 'username')
            .populate('revisor', 'username')
            .populate('eventId', 'title')
            .populate('perpetrator', 'username')

        res.status(200).json({
            status: 'success',
            results: reports.length,
            data: {
                reports,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        })
    }
}

module.exports = {
    createReport,
    getAllReports,
}
