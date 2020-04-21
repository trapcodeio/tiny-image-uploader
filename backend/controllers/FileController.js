/**
 * FileController
 * @class
 * @extends $.controller
 */
class FileController extends $.controller {

    /**
     * middleware - Set Middleware
     * @returns {Object}
     */
    static middleware() {
        return {}
    }

    /**
     * Image Uploader
     * @param {Xpresser.Http} http
     */
    async uploadImage(http) {
        const file = await http.file('image', {
            extensions: ['png']
        });

        // for upload errors
        if(file.error())
            return http.res.status(500).json(file.error());

        // save to public folder
        await file.saveTo($.path.storage('public'))

        return http.res.status(200).json({
            success: true,
            file: {
                name: file.name,
                path: '/storage/'+file.name
            }
        })
    }

}


module.exports = FileController;
