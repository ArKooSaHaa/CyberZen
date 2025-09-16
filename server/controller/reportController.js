// server/controller/reportController.js
import cloudinary from '../cloudinaryConfig.js'; // Cloudinary setup
import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  console.log('createReport function called');
  console.log('Request body:', req.body);
  console.log('File attached:', req.file ? 'Yes' : 'No');

  const { incidentType, reportTitle, description, location } = req.body;

  // Validate required fields
  if (!incidentType || !reportTitle || !description) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ message: 'Incident type, report title, and description are required.' });
  }

  let imageUrl = null;

  // Handle image upload if provided
  if (req.files && req.files.image && req.files.image[0]) {
    const file = req.files.image[0];
    console.log('Image file details:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    try {
      // Check Cloudinary config
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary configuration missing:', {
          cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
          api_key: !!process.env.CLOUDINARY_API_KEY,
          api_secret: !!process.env.CLOUDINARY_API_SECRET
        });
        return res.status(500).json({ message: 'Image upload service not configured properly' });
      }

      console.log('Cloudinary configured. Starting upload...');

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          }
          else {
            console.log('Cloudinary result:', result);
            resolve(result);
          }
        });
        stream.end(req.files.image[0].buffer);
      });
      imageUrl = result.secure_url; 
      console.log('Image uploaded to Cloudinary successfully:', imageUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary: ' + error.message });
    }
  }

  // Generate a random 7-digit track number
  const trackNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
  console.log('Generated track number:', trackNumber);

  // Create and save the report hoise 
  const report = new Report({
    incidentType,
    reportTitle,
    description,
    location,
    image: imageUrl ? { url: imageUrl } : null,
    trackNumber, 
    status: 'received', 
  });

  try {
    await report.save();
    console.log('Report saved to database successfully. Report ID:', report._id);
    res.status(201).json({ report, trackNumber }); 
  } catch (err) {
    console.error('Error saving report to database:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get a report by track number
export const getReportByTrackNumber = async (req, res) => {
  const { trackNumber } = req.params;

  try {
    // Ensure trackNumber is treated as a string for consistency
    const report = await Report.findOne({ trackNumber: trackNumber.toString() });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report); // Return the full report
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};


export const updateReportStatus = async (req, res) => {
  const { trackNumber } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const report = await Report.findOne({ trackNumber });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();
    
    res.json({ message: 'Report status updated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report status', error: error.message });
  }
}
