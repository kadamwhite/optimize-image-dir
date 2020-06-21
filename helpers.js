/**
 * Pure functions that take in input and return predictable output.
 */
const { extname } = require( 'path' );

/**
 * Change the extension of a file path to use a new filename extension.
 * May be used to apply suffices to files, e.g. .tmp.jpg or -orig.png.
 *
 * @param {String} absFilePath Original filename.
 * @param {String} newExt      Desired filename extension.
 */
const replaceExtension = ( absFilePath, newExt ) => {
	return absFilePath.replace( extname( absFilePath ), newExt );
};

module.exports = {
	replaceExtension,
};
