const path = require('path');
const fs = require('fs');

// Middleware to handle missing static files
function staticFileHandler(req, res, next) {
    const filePath = path.join(__dirname, '../uploads', req.path);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If file doesn't exist, return a 404 with a helpful message
            const ext = path.extname(filePath).toLowerCase();
            
            if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
                return res.status(404).json({ 
                    error: 'Profile image not found',
                    message: 'The requested profile image could not be found.'
                });
            } else if (ext === '.pdf') {
                return res.status(404).json({
                    error: 'Document not found',
                    message: 'The requested document could not be found.'
                });
            }
            
            return res.status(404).json({
                error: 'File not found',
                message: 'The requested file could not be found.'
            });
        }
        
        // File exists, serve it
        res.sendFile(filePath);
    });
}

module.exports = staticFileHandler;
