const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads')
    },
    filename: (req, file, callback) => {
        const timestamp = new Date().getTime();
        const extension = path.extname(file.originalname);
        callback(null, `${timestamp}${extension}`)
    }
});

const fileFilter = function (req, file, cb) {
    // Allowed file types
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only Image with JPEG, JPG and PNG files are allowed.'), false); // Reject the file
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1000 * 1000 // 3mb
    },
    fileFilter: fileFilter,
});

module.exports = upload;