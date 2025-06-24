import mongoose, { Schema } from 'mongoose'

const chartSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true
  },
  sheetName: {
    type: String,
    required: true
  },
  data: {
    labels: [String],
    values: [[Schema.Types.Mixed]],
    raw: [Schema.Types.Mixed]
  }
}, { timestamps: true })

export const Chart = mongoose.model('Chart', chartSchema)
