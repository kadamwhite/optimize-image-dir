const { resolve } = require( 'path' );
const minimist = require( 'minimist' );

const { optimize } = require( './magick' );

const argv = require( 'minimist' )( process.argv.slice( 2 ) );

if ( ! argv._[0] ) {
	console.error( 'No directory path provided; aborting.' );
	console.error( 'Usage:' );
	console.error( '    optimize-image-dir {path to parent directory}' );
	process.exit( 1 );
}

const baseDir = resolve( argv._[0] );

console.log( baseDir );

/**
 * Get the absolute path of file, relative to the provided input path.
 *
 * @param  {...String} parts One or more relative paths.
 * @returns {String} absolute path to the provided relative location.
 */
const filePath = ( ...parts ) => join( process.cwd(), ...parts );

( async () => {
	try {
		const chapters = await ls( 'files-backup' );
		for ( let chapter of chapters ) {
			const pages = await ls( filePath( 'files-backup', chapter ) );
			for ( let page of pages ) {
				await optimize( filePath( 'files-backup', chapter, page ) );
			}
		}
	} catch ( e ) {
		console.error( e );
		process.exit( 1 );
	}
})();
