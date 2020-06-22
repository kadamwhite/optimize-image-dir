const cp = require( 'child_process' );

/**
 * Execute a command as a spawned process, and return its output.
 *
 * @async
 * @param {String}   command A bash command string, excluding arguments.
 * @param {String[]} args    An array of argument strings for the provided command.
 * @returns {Promise<String>} Promise for the command's output, as a string.
 */
const spawn = ( command, args ) => {
	const output = [];
	return new Promise( ( resolve, reject ) => {
		const spawnedProcess = cp.spawn( command, args );

		spawnedProcess.stdout.on( 'data', ( message ) => {
			output.push( message.toString() );
		} );

		spawnedProcess.on( 'error', err => reject( err ) );

		spawnedProcess.on( 'close', ( code, signal ) => {
			if ( code ) {
				console.error( code, signal );
				reject();
				return;
			}

			resolve( output.join( '\n' ) );
		} );
	} );
};

module.exports = {
	spawn,
};
