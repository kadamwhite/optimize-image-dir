const { resolve } = require( 'path' );

const { ls, isDirectory } = require( './fs' );
const { optimize } = require( './magick' );

/**
 * No-op function to use as default argument.
 */
const noop = () => {};

/**
 * If a provided path points to an image file, optimize it. Do nothing for
 * unrecognized file types.
 *
 * @async
 * @param {String} absFilePath
 */
async function maybeProcessImage( absFilePath ) {
	if ( /(png|jpe?g|gif)$/i.test( absFilePath ) ) {
		await optimize( absFilePath );
	}
}

/**
 * Process all files in a directory.
 *
 * @param {String} absDirPath Directory for which to optimize files.
 */
async function recursivelyProcessDirectory( absDirPath, opts = {} ) {
	const {
		onStart = noop,
		onTick = noop,
		onChildTick = noop,
		...flags,
	} = opts;

	const files = await ls( absDirPath );

	onStart( files.length );

	for ( let i = 0; i < files.length; i++ ) {
		const file = files[i];
		const absFilePath = resolve( absDirPath, file );
		if ( isDirectory( absFilePath ) ) {
			await recursivelyProcessDirectory( absFilePath, {
				onTick: onChildTick,
				...flags,
			} );
		} else {
			try {
				await maybeProcessImage( absFilePath );
			} catch ( e ) {
				console.error( `Error processing ${ absFilePath }` )
				throw e;
			}
		}
		onTick( i, files.length );
	}
}

module.exports = {
	recursivelyProcessDirectory,
};
