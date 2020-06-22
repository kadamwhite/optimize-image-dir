#! /usr/bin/env node
const { resolve } = require( 'path' );
const minimist = require( 'minimist' );

const { recursivelyProcessDirectory } = require( './index' );
const { ProgressBar, NestedProgressBar } = require( './progress' );

const argv = minimist( process.argv.slice( 2 ) );

if ( ! argv._[0] ) {
	console.error( 'No directory path provided; aborting.' );
	console.error( 'Usage:' );
	console.error( '    optimize-image-dir {path to parent directory}' );
	process.exit( 1 );
}

const baseDir = resolve( argv._[0] );

( async () => {
	let parentBar;
	let childBar;
	function onStart( total ) {
		parentBar = new ProgressBar( '(:current/:total) :bar :subbar :etas', {
			width: 35,
			total,
		} );
	}

	function onTick( currentIdx, total ) {
		if ( ! parentBar ) {
			onStart( total );
		}
		parentBar.tick( {
			subbar: childBar ? childBar.toString() : '',
		} );
	}

	function onChildTick( currentIdx, total ) {
		if ( ! childBar || currentIdx === 0 ) {
			childBar = new NestedProgressBar( '[(:current/:total) :bar]', {
				width: 25,
				total,
			} );
		}
		childBar.tick();
		parentBar.tick( 0, {
			subbar: childBar.toString(),
		} );
	}

	try {
		await recursivelyProcessDirectory( baseDir, {
			onStart,
			onTick,
			onChildTick,
			lighten: argv.lighten || false,
		} );
	} catch ( e ) {
		console.error( "Error!:", e );
		process.exit( 1 );
	}
})();
