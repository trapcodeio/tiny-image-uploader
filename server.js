const fs = require('fs')
const xpresser = require('xpresser')

const $ = xpresser({
    name: 'Tiny Image Uploader',
    paths: {
        base: __dirname,
        public: 'dist'
    },
    server: {use: {cors: true}}
});

// Symlink Folders on boot
$.on.boot((next) => {

    // Symlink storage to public folder
    const mainStorageLocation = $.path.storage('public');
    const publicStorageLocation = $.path.base('public/storage')

    if (!fs.existsSync(publicStorageLocation)) {

        if (!fs.existsSync(mainStorageLocation)) {
            throw new Error(`Main storage does not exists: ${mainStorageLocation}`);
        }

        try {
            fs.symlinkSync(mainStorageLocation, publicStorageLocation);
        } catch (e) {
            throw Error(e)
        }
    }

    // Continue Boot
    return next();
})

// Add Routes
$.on.boot((next) => {
    // Set Routes
    $.router.post('/upload_image', 'File@uploadImage')

    // Continue Boot
    return next();
})

// Boot Server
$.boot();