// server/models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    incidentType: { type: String, required: true, trim: true },
    reportTitle:  { type: String, required: true, trim: true },
    description:  { type: String, required: true, trim: true },
    location:     { type: String, trim: true },
    image: {
      url: { type: String },  // Store the URL from Cloudinary 
    },
    trackNumber: { type: String, unique: true, required: true },
    status: { 
      type: String, 
      default: 'received', 
      enum: ['received', 'processing', 'completed'], // Restrict values 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);


//-------------------------------------------------------------------------------------------------------------------------------------
