var fs = require( 'fs' )
var path = require( 'path' )
var csv = require( 'csv-stringify' )

var header = []

var cs = csv({})
var ts = csv({
  delimiter: '\x09'
})

var ws = fs.createWriteStream( path.join( __dirname, '..', 'data.csv' ) )
var tws = fs.createWriteStream( path.join( __dirname, '..', 'data.tsv' ) )

cs.pipe( ws )
ts.pipe( tws )

function createHeader( cpu ) {
  flatten( cpu, 'arch' )
  flatten( cpu, 'technology' )
  flatten( cpu, 'cache' )
  flatten( cpu, 'vdd' )
  header = Object.keys( cpu )
  cs.write( header )
  ts.write( header )
}

function flatten( obj, key ) {
  var delimiter = ':'
  var keys = Object.keys( obj[key] )
    .map( function( k ) {
      obj[ key + delimiter + k ] = obj[key][k]
      return k
    })
  // console.log( '[FLATTENED]', keys )
  delete obj[key]
}

function createRow( cpu, noflat ) {
  
  if( !noflat ) {
    flatten( cpu, 'arch' )
    flatten( cpu, 'technology' )
    flatten( cpu, 'cache' )
    flatten( cpu, 'vdd' )
  }
  
  var row = header.map( function( key ) {
    return cpu[ key ]
  })
  
  cs.write( row )
  ts.write( row )
  
}

fs.readdirSync( path.join( __dirname, '..', 'data' ) )
  .sort()
  .forEach( function( filename, i ) {
    var cpu = require( '../data/' + filename )
    if( i === 0 ) { createHeader( cpu ) }
    createRow( cpu, i === 0 )
  })

cs.end()
ts.end()
