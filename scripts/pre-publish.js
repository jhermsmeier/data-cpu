var fs = require( 'fs' )
var path = require( 'path' )

var data = []

fs.readdirSync( path.join( __dirname, '..', 'data' ) )
  .sort()
  .forEach( function( filename ) {
    data.push( require( '../data/'+filename ))
  })

fs.writeFileSync(
  path.join( __dirname, '..', 'data.json' ),
  JSON.stringify( data, null, 2 )
)
