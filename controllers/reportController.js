const Event = require('../models/eventModel')
const User = require('../models/userModel')
const Report = require('../models/reportModel')
const { Resend } = require('resend')

// Create report
const createReport = async (req, res) => {
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
        const report = await Report.create(req.body)

        var reported
        const type = req.body.type

        if (type == 'Event') {
            // Get event title
            reported = await Event.findById(req.body.eventId).select('title')
            reported = reported.title
        } else if (type == 'User') {
            // Get user username
            reported = await User.findById(req.body.perpetrator).select(
                'username'
            )
            reported = reported.username
        }

        var reporterEmail = await User.findById(report.reporter).select('email')
        reporterEmail = reporterEmail.email

        // Get report reportSubmit hour
        const reportDate = new Date(report.reportSubmit)

        console.log(reporterEmail)
        const data = await resend.emails.send({
            from: 'Overcome <sender@app-overcome.schr.tech>',
            to: [reporterEmail],
            subject: '¡Detalles de tu reporte! 🆘',
            html: `
            <table width="100%"  cellpadding="0" cellspacing="0"  style="background-color: #ffffff; border-radius: 4px; padding: 20px;margin-top: 1rem">
            <tr>
              <td align="center">
                <img src='https://drive.google.com/uc?id=1t2AKc12EanKhfjs_dIqXgXFk-ySY9l4x' style="height:100px"/>
                <h1 style="color: #333333; font-size:29px">Hola, <a href="mailto:${reporterEmail}">${reporterEmail}</a>:</h1>
                <p style="color: #666666;">Hemos recibido tu reporte en <a href='https://app-overcome.onrender.com' target="_blank">Overcome</a>, agradecemos tu ayuda. 
                  <br/>
                  Tus reportes son valiosos para mantener una comunidad sana y respetuosa para todos. 
                </p>
                <br/>   
                 <p style="color: #666666;">
                  A continuación, encontrarás un resumen del reporte que realizaste:
                </p>
                <table style="color: #666666; margin-bottom: 10px">
                  <tr>
                    <td style="padding:5px; font-weight: bold">Reportaste a (${type}): </td>
                    <td>${reported}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px; font-weight: bold">Hora de reporte: </td>
                    <td>${reportDate}</td>
                  </tr>
                </table>
                <p style="color: #666666;margin-bottom: 30px">
                  Nos comunicaremos nuevamente en cuanto tengamos noticias de tu reporte.
                </p>
                <p style="color: ##666666; opacity: 0.7; width: 90%;">
                  Si deseas mas información puedes contactarte con nuestro equipo a <a href="mailto:help@overcome.tech">help@overcome.tech</a>
                </p>
              </td>
            </tr>
          </table>
      `,
        })

        res.status(200).json({
            status: 'success',
            data,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: err.message,
        })
    }
}

// Get all reports
const getAllReports = async (req, res) => {
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
