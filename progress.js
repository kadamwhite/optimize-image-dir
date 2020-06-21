const ProgressBar = require( 'progress' );

// output.on( 'data', (chunk) => outputContent.push(chunk ));

const pause = () => new Promise( resolve => {
    setTimeout( resolve, 200 );
} );

class MockStream {
	constructor() {
		this.isTTY = true;
		this.columns = 100;
		this.output = '';
	}

	// Stub out stream API.
	cursorTo() {}
	clearLine() {}

	// Override stream API.
	write( str ) {
		if ( str.trim() ) {
			this.output = str;
		} else {
			this.lastOutput = str;
			this.output = '';
		}
	}
	toString() {
		return this.output || this.lastOutput;
	}
}

class NestedProgressBar extends ProgressBar {
	constructor( template, opts = {} ) {
		const stream = new MockStream();
		super( template, {
			total: 100,
			...opts,
			stream,
		} );
		this.stream = stream;
	}

	toString() {
		return this.stream.toString().trim();
	}
}

module.exports = {
	ProgressBar,
	NestedProgressBar,
};
