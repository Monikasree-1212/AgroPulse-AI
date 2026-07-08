const PDFDocument = require('pdfkit')
const ExcelJS     = require('exceljs')
const { createObjectCsvStringifier } = require('csv-writer')

const Activity        = require('../models/Activity')
const Notification    = require('../models/Notification')
const Commodity       = require('../models/Commodity')
const GovernmentScheme = require('../models/GovernmentScheme')

/* ── helpers ── */
const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
const fmtNow  = ()  => new Date().toLocaleString('en-IN', { dateStyle: 'long',   timeStyle: 'short' })

function buildPDF(res, title, drawContent) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}.pdf"`)
  doc.pipe(res)

  /* header bar */
  doc.rect(0, 0, doc.page.width, 70).fill('#16a34a')
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold')
     .text('🌾 AgroPulse AI', 50, 22)
  doc.fontSize(10).font('Helvetica')
     .text(title, 50, 46)

  /* meta */
  doc.fillColor('#374151').fontSize(9).font('Helvetica')
     .text(`Generated: ${fmtNow()}`, 50, 85, { align: 'right' })

  doc.moveDown(3)
  drawContent(doc)

  /* footer */
  const bottom = doc.page.height - 40
  doc.moveTo(50, bottom - 10).lineTo(doc.page.width - 50, bottom - 10)
     .strokeColor('#e5e7eb').stroke()
  doc.fillColor('#9ca3af').fontSize(8)
     .text('AgroPulse AI — Smart Agricultural Market Intelligence Platform', 50, bottom, { align: 'center' })

  doc.end()
}

function tableHeader(doc, cols, y) {
  doc.rect(50, y, doc.page.width - 100, 18).fill('#f0fdf4')
  doc.fillColor('#16a34a').fontSize(8).font('Helvetica-Bold')
  let x = 55
  cols.forEach(({ label, w }) => { doc.text(label, x, y + 4, { width: w, ellipsis: true }); x += w })
  return y + 20
}

function tableRow(doc, cols, values, y, shade) {
  if (shade) doc.rect(50, y, doc.page.width - 100, 16).fill('#f9fafb')
  doc.fillColor('#374151').fontSize(8).font('Helvetica')
  let x = 55
  cols.forEach(({ w }, i) => {
    doc.text(String(values[i] ?? '—'), x, y + 3, { width: w - 4, ellipsis: true })
    x += w
  })
  return y + 18
}

function sectionTitle(doc, text) {
  doc.moveDown(0.5)
  doc.fillColor('#16a34a').fontSize(13).font('Helvetica-Bold').text(text)
  doc.moveDown(0.3)
}

/* ══════════════════════════════════════════════
   PREDICTIONS PDF
══════════════════════════════════════════════ */
exports.predictionsPDF = async (req, res) => {
  try {
    const commodities = await Commodity.find().lean()
    const predActs    = await Activity.find({ activityType: 'prediction' }).sort({ createdAt: -1 }).limit(50).lean()

    buildPDF(res, 'Prediction History Report', (doc) => {
      sectionTitle(doc, 'Commodity Price Summary')

      const cols = [
        { label: 'Commodity', w: 100 },
        { label: 'Days',      w: 50  },
        { label: 'Min ₹/kg',  w: 80  },
        { label: 'Max ₹/kg',  w: 80  },
        { label: 'Avg ₹/kg',  w: 80  },
        { label: 'Latest ₹/kg', w: 90 },
      ]
      let y = tableHeader(doc, cols, doc.y)
      commodities.forEach((c, i) => {
        const prices = c.prices.map(p => p.price)
        const avg    = prices.length ? (prices.reduce((s, v) => s + v, 0) / prices.length).toFixed(2) : 0
        const latest = prices.length ? prices[prices.length - 1] : 0
        y = tableRow(doc, cols, [c.commodity, prices.length, Math.min(...prices), Math.max(...prices), avg, latest], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })

      doc.moveDown(1.5)
      sectionTitle(doc, 'Recent AI Prediction Activities')

      const cols2 = [
        { label: 'Date',        w: 130 },
        { label: 'Commodity',   w: 90  },
        { label: 'Description', w: 220 },
        { label: 'Confidence',  w: 70  },
      ]
      y = tableHeader(doc, cols2, doc.y)
      predActs.forEach((a, i) => {
        y = tableRow(doc, cols2, [fmtDate(a.createdAt), a.commodity || '—', a.description, a.metadata?.confidence ? `${a.metadata.confidence}%` : '—'], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   PREDICTIONS EXCEL
══════════════════════════════════════════════ */
exports.predictionsExcel = async (req, res) => {
  try {
    const commodities = await Commodity.find().lean()
    const predActs    = await Activity.find({ activityType: 'prediction' }).sort({ createdAt: -1 }).lean()
    const profitActs  = await Activity.find({ activityType: 'profit'     }).sort({ createdAt: -1 }).lean()
    const weatherActs = await Activity.find({ activityType: 'weather'    }).sort({ createdAt: -1 }).lean()
    const allActs     = await Activity.find().lean()

    const wb = new ExcelJS.Workbook()
    wb.creator = 'AgroPulse AI'
    wb.created = new Date()

    const headerStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16a34a' } }, alignment: { horizontal: 'center' } }
    const altFill     = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }

    function addSheet(name, columns, rows) {
      const ws = wb.addWorksheet(name)
      ws.columns = columns.map(c => ({ header: c.header, key: c.key, width: c.width || 20 }))
      ws.getRow(1).eachCell(cell => Object.assign(cell, headerStyle))
      rows.forEach((row, i) => {
        const r = ws.addRow(row)
        if (i % 2 === 1) r.eachCell(cell => { cell.fill = altFill })
      })
      return ws
    }

    /* Sheet 1 — Predictions */
    addSheet('Predictions', [
      { header: 'Commodity', key: 'commodity', width: 18 },
      { header: 'Days of Data', key: 'days', width: 14 },
      { header: 'Min Price (₹)', key: 'min', width: 16 },
      { header: 'Max Price (₹)', key: 'max', width: 16 },
      { header: 'Avg Price (₹)', key: 'avg', width: 16 },
      { header: 'Latest Price (₹)', key: 'latest', width: 18 },
    ], commodities.map(c => {
      const prices = c.prices.map(p => p.price)
      return {
        commodity: c.commodity,
        days:      prices.length,
        min:       prices.length ? Math.min(...prices) : 0,
        max:       prices.length ? Math.max(...prices) : 0,
        avg:       prices.length ? +(prices.reduce((s, v) => s + v, 0) / prices.length).toFixed(2) : 0,
        latest:    prices.length ? prices[prices.length - 1] : 0,
      }
    }))

    /* Sheet 2 — Profit Simulations */
    addSheet('Profit Simulations', [
      { header: 'Date',           key: 'date',           width: 22 },
      { header: 'Commodity',      key: 'commodity',      width: 16 },
      { header: 'Description',    key: 'description',    width: 40 },
      { header: 'ROI (%)',        key: 'roi',            width: 12 },
      { header: 'Recommendation', key: 'recommendation', width: 30 },
    ], profitActs.map(a => ({
      date:           fmtDate(a.createdAt),
      commodity:      a.commodity || '—',
      description:    a.description,
      roi:            a.metadata?.roi ?? '—',
      recommendation: a.metadata?.recommendation ?? '—',
    })))

    /* Sheet 3 — Weather */
    addSheet('Weather Checks', [
      { header: 'Date',        key: 'date',        width: 22 },
      { header: 'Commodity',   key: 'commodity',   width: 16 },
      { header: 'Description', key: 'description', width: 50 },
    ], weatherActs.map(a => ({
      date:        fmtDate(a.createdAt),
      commodity:   a.commodity || '—',
      description: a.description,
    })))

    /* Sheet 4 — Analytics Summary */
    const counts = {}
    allActs.forEach(a => { counts[a.activityType] = (counts[a.activityType] || 0) + 1 })
    addSheet('Analytics Summary', [
      { header: 'Feature',    key: 'feature', width: 24 },
      { header: 'Total Uses', key: 'total',   width: 14 },
    ], [
      { feature: 'AI Predictions',    total: counts.prediction  || 0 },
      { feature: 'Price Checks',      total: counts.price       || 0 },
      { feature: 'Weather Checks',    total: counts.weather     || 0 },
      { feature: 'Profit Simulations',total: counts.profit      || 0 },
      { feature: 'Mandi Searches',    total: counts.mandi       || 0 },
      { feature: 'Voice Queries',     total: counts.voice       || 0 },
      { feature: 'Government Views',  total: counts.government  || 0 },
      { feature: 'Total Activities',  total: allActs.length },
    ])

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="AgroPulse_Report.xlsx"')
    await wb.xlsx.write(res)
    res.end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   PREDICTIONS CSV
══════════════════════════════════════════════ */
exports.predictionsCSV = async (req, res) => {
  try {
    const commodities = await Commodity.find().lean()
    const predActs    = await Activity.find({ activityType: 'prediction' }).sort({ createdAt: -1 }).lean()

    const stringifier = createObjectCsvStringifier({
      header: [
        { id: 'commodity',   title: 'Commodity'       },
        { id: 'day',         title: 'Day'             },
        { id: 'price',       title: 'Price (₹/kg)'    },
        { id: 'confidence',  title: 'Confidence (%)'  },
        { id: 'date',        title: 'Date'            },
      ],
    })

    const rows = []
    commodities.forEach(c => {
      c.prices.forEach(p => {
        const match = predActs.find(a => a.commodity === c.commodity)
        rows.push({
          commodity:  c.commodity,
          day:        p.day,
          price:      p.price,
          confidence: match?.metadata?.confidence ?? '—',
          date:       match ? fmtDate(match.createdAt) : '—',
        })
      })
    })

    const csv = stringifier.getHeaderString() + stringifier.stringifyRecords(rows)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="AgroPulse_Predictions.csv"')
    res.send(csv)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   WEATHER PDF
══════════════════════════════════════════════ */
exports.weatherPDF = async (req, res) => {
  try {
    const acts = await Activity.find({ activityType: 'weather' }).sort({ createdAt: -1 }).limit(50).lean()

    buildPDF(res, 'Weather History Report', (doc) => {
      sectionTitle(doc, 'Weather Check History')

      if (!acts.length) {
        doc.fillColor('#6b7280').fontSize(11).text('No weather check history found.')
        return
      }

      const cols = [
        { label: 'Date & Time',  w: 140 },
        { label: 'Commodity',    w: 90  },
        { label: 'Description',  w: 280 },
      ]
      let y = tableHeader(doc, cols, doc.y)
      acts.forEach((a, i) => {
        y = tableRow(doc, cols, [fmtDate(a.createdAt), a.commodity || '—', a.description], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })

      doc.moveDown(1)
      doc.fillColor('#374151').fontSize(10).font('Helvetica-Bold')
         .text(`Total Weather Checks: ${acts.length}`)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   PROFIT PDF
══════════════════════════════════════════════ */
exports.profitPDF = async (req, res) => {
  try {
    const acts = await Activity.find({ activityType: 'profit' }).sort({ createdAt: -1 }).limit(50).lean()

    buildPDF(res, 'Profit Simulation Report', (doc) => {
      sectionTitle(doc, 'Profit Simulation History')

      if (!acts.length) {
        doc.fillColor('#6b7280').fontSize(11).text('No profit simulations found.')
        return
      }

      /* summary */
      const rois = acts.filter(a => a.metadata?.roi != null).map(a => a.metadata.roi)
      if (rois.length) {
        const avgRoi = (rois.reduce((s, v) => s + v, 0) / rois.length).toFixed(1)
        const maxRoi = Math.max(...rois).toFixed(1)
        doc.fillColor('#374151').fontSize(10).font('Helvetica')
           .text(`Total Simulations: ${acts.length}   |   Avg ROI: ${avgRoi}%   |   Best ROI: ${maxRoi}%`)
        doc.moveDown(0.5)
      }

      const cols = [
        { label: 'Date',           w: 130 },
        { label: 'Commodity',      w: 80  },
        { label: 'ROI (%)',        w: 60  },
        { label: 'Recommendation', w: 240 },
      ]
      let y = tableHeader(doc, cols, doc.y)
      acts.forEach((a, i) => {
        y = tableRow(doc, cols, [
          fmtDate(a.createdAt),
          a.commodity || '—',
          a.metadata?.roi != null ? `${a.metadata.roi}%` : '—',
          a.metadata?.recommendation || a.description,
        ], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   ANALYTICS PDF
══════════════════════════════════════════════ */
exports.analyticsPDF = async (req, res) => {
  try {
    const [activities, notifications, commodities] = await Promise.all([
      Activity.find().lean(),
      Notification.find().lean(),
      Commodity.find().lean(),
    ])

    const counts = {}
    const commFreq = {}
    activities.forEach(a => {
      counts[a.activityType] = (counts[a.activityType] || 0) + 1
      if (a.commodity) commFreq[a.commodity] = (commFreq[a.commodity] || 0) + 1
    })

    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const thisWeek = activities.filter(a => now - new Date(a.createdAt) < oneWeek).length
    const lastWeek = activities.filter(a => { const age = now - new Date(a.createdAt); return age >= oneWeek && age < 2 * oneWeek }).length
    const growth   = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : (thisWeek > 0 ? 100 : 0)

    const predActs = activities.filter(a => a.activityType === 'prediction' && a.metadata?.confidence != null)
    const avgAcc   = predActs.length ? Math.round(predActs.reduce((s, a) => s + a.metadata.confidence, 0) / predActs.length) : 91

    buildPDF(res, 'Analytics Summary Report', (doc) => {
      sectionTitle(doc, 'Platform Usage Summary')

      const summaryRows = [
        ['Total Activities',       activities.length],
        ['AI Predictions',         counts.prediction  || 0],
        ['Price Checks',           counts.price       || 0],
        ['Weather Checks',         counts.weather     || 0],
        ['Profit Simulations',     counts.profit      || 0],
        ['Mandi Searches',         counts.mandi       || 0],
        ['Voice Queries',          counts.voice       || 0],
        ['Government Views',       counts.government  || 0],
        ['Total Notifications',    notifications.length],
        ['Unread Notifications',   notifications.filter(n => !n.isRead).length],
        ['Avg Prediction Accuracy',`${avgAcc}%`],
        ['Weekly Growth',          `${growth >= 0 ? '+' : ''}${growth}%`],
      ]

      const cols = [{ label: 'Metric', w: 220 }, { label: 'Value', w: 100 }]
      let y = tableHeader(doc, cols, doc.y)
      summaryRows.forEach(([metric, value], i) => {
        y = tableRow(doc, cols, [metric, value], y, i % 2 === 1)
      })

      doc.moveDown(1.5)
      sectionTitle(doc, 'Commodity Search Frequency')

      const commCols = [{ label: 'Commodity', w: 180 }, { label: 'Searches', w: 100 }]
      y = tableHeader(doc, commCols, doc.y)
      Object.entries(commFreq).sort((a, b) => b[1] - a[1]).forEach(([name, val], i) => {
        y = tableRow(doc, commCols, [name, val], y, i % 2 === 1)
      })

      doc.moveDown(1.5)
      sectionTitle(doc, 'Commodity Average Prices')

      const priceCols = [
        { label: 'Commodity',    w: 120 },
        { label: 'Avg Price (₹)', w: 100 },
        { label: 'Min (₹)',      w: 80  },
        { label: 'Max (₹)',      w: 80  },
      ]
      y = tableHeader(doc, priceCols, doc.y)
      commodities.forEach((c, i) => {
        const prices = c.prices.map(p => p.price)
        const avg    = prices.length ? (prices.reduce((s, v) => s + v, 0) / prices.length).toFixed(2) : 0
        y = tableRow(doc, priceCols, [c.commodity, avg, prices.length ? Math.min(...prices) : 0, prices.length ? Math.max(...prices) : 0], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   ACTIVITY PDF
══════════════════════════════════════════════ */
exports.activityPDF = async (req, res) => {
  try {
    const acts = await Activity.find().sort({ createdAt: -1 }).limit(100).lean()

    buildPDF(res, 'Farmer Activity History Report', (doc) => {
      sectionTitle(doc, `Activity Log  (${acts.length} records)`)

      if (!acts.length) {
        doc.fillColor('#6b7280').fontSize(11).text('No activity records found.')
        return
      }

      const cols = [
        { label: 'Date',        w: 130 },
        { label: 'Type',        w: 80  },
        { label: 'Commodity',   w: 80  },
        { label: 'Description', w: 220 },
      ]
      let y = tableHeader(doc, cols, doc.y)
      acts.forEach((a, i) => {
        y = tableRow(doc, cols, [fmtDate(a.createdAt), a.activityType, a.commodity || '—', a.description], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ══════════════════════════════════════════════
   NOTIFICATIONS PDF
══════════════════════════════════════════════ */
exports.notificationsPDF = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(100).lean()

    buildPDF(res, 'Notifications Report', (doc) => {
      sectionTitle(doc, `Notifications  (${notifs.length} total)`)

      if (!notifs.length) {
        doc.fillColor('#6b7280').fontSize(11).text('No notifications found.')
        return
      }

      const unread = notifs.filter(n => !n.isRead).length
      doc.fillColor('#374151').fontSize(10).font('Helvetica')
         .text(`Unread: ${unread}   |   Read: ${notifs.length - unread}`)
      doc.moveDown(0.5)

      const cols = [
        { label: 'Date',      w: 120 },
        { label: 'Type',      w: 70  },
        { label: 'Priority',  w: 60  },
        { label: 'Title',     w: 130 },
        { label: 'Message',   w: 110 },
        { label: 'Status',    w: 50  },
      ]
      let y = tableHeader(doc, cols, doc.y)
      notifs.forEach((n, i) => {
        y = tableRow(doc, cols, [
          fmtDate(n.createdAt),
          n.type,
          n.priority,
          n.title,
          n.message,
          n.isRead ? 'Read' : 'Unread',
        ], y, i % 2 === 1)
        if (y > doc.page.height - 80) { doc.addPage(); y = 80 }
      })
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
