// server/middleware/upload.js
import multer from 'multer';

// Configure Multer to store files in memory
const storage = multer.memoryStorage(); // buffeer a rakhe

// Define allowed file types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const upload = multer({
    storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: (req, file, cb) => {
        console.log('File upload attempt:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.error('Invalid file type:', file.mimetype);
            cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
        }
    }
}).fields([
    { name: 'image', maxCount: 1 }
]);

// Wrapper to handle multer errors
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                message: err.code === 'LIMIT_FILE_SIZE' 
                    ? 'File size too large. Maximum size is 5MB.'
                    : 'Error uploading file.'
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

export default uploadMiddleware;