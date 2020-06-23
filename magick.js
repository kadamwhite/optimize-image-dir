/**
 * This file exports methods which receive a file and process it in some way.
 * Most of them use imagemagick's "convert", but not all.
 */
const { spawn } = require( './cp' );
const { replaceExtension } = require( './fs' );

/**
 * Determine whether an image file is greyscale.
 *
 * @param {String} absFilePath Path to an image file.
 * @returns {Promise<Boolean>}
 */
async function isBW( absFilePath ) {
	// https://superuser.com/questions/508472/how-to-recognize-black-and-white-images
	const saturation = await spawn( 'convert', [
		absFilePath,
		'-colorspace', 'HSL',
		'-channel', 'g',
		'-separate',
		'+channel',
		'-format', '"%[fx:mean]"',
		'info:',
	] );

	return ( +( saturation.replace( /[^0-9.]/g, '' ) ) < 0.01 );
}

/**
 * Given an image file path, convert that image to an optimized greyscale png.
 *
 * @async
 * @param {String} absFilePath Absolute file system path to an image.
 */
const convertToGreyscale = async ( absFilePath, opts = {} ) => {
	const { lighten } = opts;
	const isPNG = /\.png/i.test( absFilePath );

	const tmpFile = replaceExtension( absFilePath, '.tmp.png' );
	const optimizedFile = replaceExtension( absFilePath, '.tmp.opt.png' );
	const targetFile = replaceExtension( absFilePath, '.png' );

	// https://imagemagick.org/script/command-line-options.php
	await spawn( 'convert', [
		absFilePath,
		'-alpha', 'off',
		'-interlace', 'none',
		'-colors', '17',
		// Reduce color depth in highs and lows for better text contrast.
		'-white-threshold', '95%',
		'-black-threshold', '10%',
		...( lighten ? [
			// Lighten the image for better display on Kindle screens.
			'-sigmoidal-contrast', '3x10%', // This could be refined further.
			'-gamma', '1.1', // Ditto. This *and* sigmoidal contrast...? Bad?
		] : [] ),
		tmpFile,
	] );

	// https://pngquant.org/
	await spawn( 'pngquant', [
		'--ext', '.opt.png',
		'--speed', '1',
		tmpFile,
	] );

	// Clean up.
	if ( ! isPNG ) {
		await spawn( 'rm', [ absFilePath ] );
	}
	await spawn( 'rm', [ tmpFile ] );
	await spawn( 'mv', [ optimizedFile, targetFile ] );
};

/**
 * Given an image file path, convert that image to an optimized color jpg file.
 *
 * @async
 * @param {String} absFilePath Absolute file system path to an image.
 */
const convertToColor = async ( absFilePath ) => {
	const isJPG = /\.jpe?g/i.test( absFilePath );

	const tmpFile = replaceExtension( absFilePath, '.tmp.jpg' );
	const targetFile = replaceExtension( absFilePath, '.jpg' );

	// https://imagemagick.org/script/command-line-options.php
	await spawn( 'convert', [
		absFilePath,
		'-interlace', 'none',
		'-quality', '80',
		'-strip', // No ICC profiles.
		tmpFile,
	] );
	// https://www.kokkonen.net/tjko/src/man/jpegoptim.txt
	await spawn( 'jpegoptim', [
		tmpFile,
		'-m', '80', // Max quality 80.
		'--strip-icc',
		'--strip-exif',
		'--all-normal',
	] );

	// Clean up.
	if ( ! isJPG ) {
		await spawn( 'rm', [ absFilePath ] );
	}
	await spawn( 'mv', [ tmpFile, targetFile ] );
};

/**
 * Given an image file path, convert that image to an optimized color png file.
 *
 * @async
 * @param {String} absFilePath Absolute file system path to an image.
 */
const convertToColorPNG = async ( absFilePath ) => {
	const isPNG = /\.png/i.test( absFilePath );

	const tmpFile = replaceExtension( absFilePath, '.tmp.png' );
	const optimizedFile = replaceExtension( absFilePath, '.tmp.opt.png' );
	const targetFile = replaceExtension( absFilePath, '.png' );

	// https://imagemagick.org/script/command-line-options.php
	await spawn( 'convert', [
		absFilePath,
		'-alpha', 'off',
		'-interlace', 'none',
		tmpFile,
	] );

	// https://pngquant.org/
	await spawn( 'pngquant', [
		'--ext', '.opt.png',
		'--speed', '1',
		tmpFile,
	] );

	// Clean up.
	if ( ! isPNG ) {
		await spawn( 'rm', [ absFilePath ] );
	}
	await spawn( 'rm', [ tmpFile ] );
	await spawn( 'mv', [ optimizedFile, targetFile ] );
};

/**
 * Given an image file path, determine if that image is greyscale or color and
 * convert it to the appropriate format, optimizing in the process.
 *
 * @async
 * @param {String} absFilePath Absolute file system path to an image.
 */
const optimize = async ( absFilePath, opts = {} ) => {
	if ( await isBW( absFilePath ) ) {
		await convertToGreyscale( absFilePath, opts );
	} else {
		if ( opts.colorPNG ) {
			await convertToColorPNG( absFilePath, opts );
		} else {
			await convertToColor( absFilePath, opts );
		}
	}
};

module.exports = {
	convertToColor,
	convertToGreyscale,
	isBW,
	optimize,
};
