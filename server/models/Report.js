// server/models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    incidentType: { type: String, required: true, trim: true },
    reportTitle:  { type: String, required: true, trim: true },
    description:  { type: String, required: true, trim: true },
    location:     { type: String, trim: true },
    image: {
      url: { type: String },  // Store the URL from Cloudinary or ImageKit
    },
    trackNumber: { type: String, unique: true, required: true },
    status: { 
      type: String, 
      default: 'received', // Default status can be 'received', other statuses could be 'processing', 'completed', etc.
      enum: ['received', 'processing', 'completed'], // Restrict values to these
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, for authenticated users
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);


//-------------------------------------------------------------------------------------------------------------------------------------
