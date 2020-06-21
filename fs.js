
/**
 * Functions relating to filesystem interaction or file paths.
 */
const { extname } = require( 'path' );
const { promisify } = require( 'util' );
const fs = require( 'fs' );

/**
 * Determine whether a file path points to a directory.
 *
 * @param {String} absFilePath Absolute file system path to an image.
 * @returns {Boolean} Whether absFilePath is a directory path.
 */
function isDirectory( absFilePath ) {
	try {
		const stats = fs.statSync( absFilePath );
		if ( ! stats || ! stats.isDirectory ) {
			return false;
		}
		return stats.isDirectory();
	} catch ( e ) {
		return false;
	}
}

/**
 * List the files in a directory, either as a list of file and subdir names or
 * a list of absolute file system paths.
 *
 * @async
 * @param {String}  inputDir        The file system path to the directory to read.
 * @param {Object}  [opts]          Options hash.
 * @param {Boolean} [opts.absolute] Whether to return absolute file system paths.
 * @returns {Promise<String[]>} A promise to an array of file/directory names within inputDir.
 */
async function ls( inputDir, opts = {} ) {
	const { absolute = false } = opts;
	const fileList = await promisify( fs.readdir )( inputDir );
	if ( absolute ) {
		return fileList.map( fileName => resolve( inputDir, fileName ) );
	}
	return fileList;
};

/**
 * Change the extension of a file path to use a new filename extension.
 * May be used to apply suffices to files, e.g. .tmp.jpg or -orig.png.
 *
 * @param {String} absFilePath Original filename.
 * @param {String} newExt      Desired filename extension.
 */
function replaceExtension( absFilePath, newExt ) {
	return absFilePath.replace( extname( absFilePath ), newExt );
};

module.exports = {
	isDirectory,
	ls,
	replaceExtension,
};
