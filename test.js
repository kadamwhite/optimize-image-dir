#! /usr/bin/env node
const { resolve } = require( 'path' );
const minimist = require( 'minimist' );

const argv = minimist( process.argv.slice( 2 ) );

console.log( argv );
