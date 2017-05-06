
var fs = require('fs');
var xml2js = require('xml2js');
var argv = require('minimist')(process.argv.slice(2));

var trackFile = argv.t || argv.track;

if (!trackFile) {
  console.warn('provide a track file via "-t" or "--track"');
  process.exit(1);
}

var outputFile = argv.o || argv.output || 'output.gpx';

var parser = new xml2js.Parser();
fs.readFile(trackFile, function(err, data) {
    parser.parseString(data, function (err, gpxData) {
        var segments = toSegments(gpxData);

        var builder = new xml2js.Builder();

        var cloneOfTrack = JSON.parse(JSON.stringify(gpxData));
        delete cloneOfTrack.gpx.trk[0].trkseg;
        cloneOfTrack.gpx.trk[0].trkseg = [];

        var count = 0;
        segments.forEach(function(segment) {
          cloneOfTrack.gpx.trk[0].trkseg.push(segment);
          count++;
        });

        console.log('Added '+count+ ' segments to output file...');
        var xml = builder.buildObject(cloneOfTrack);
        fs.writeFile(outputFile.startsWith('/') ? outputFile : __dirname + '/'+outputFile, xml, function(err) {
          if(err) {
              return console.log(err);
          }
          console.info('file written: '+outputFile);

        });
    });
});

var toSegments = function(gpxData) {
  var segments = [];
  var currentSegment = {
    trkpt: []
  };

  gpxData.gpx.trk[0].trkseg.forEach(function(seg) {

    var stopCandidateCount = 0;
    seg.trkpt.forEach(function(point) {
      if (point.extensions) {
        point.extensions.forEach(function(ext) {
          if (ext.speed) {
            var speedKmH = parseFloat(ext.speed) * 3.6;
            if (speedKmH > 3.0) {
              currentSegment.trkpt.push(point);
              stopCandidateCount = 0;
            }
            else {
              //speed too low
              stopCandidateCount++;
            }
          }
          else {
            //no speed value
            stopCandidateCount++;
          }
        });
      }
      else {
        //no speed value
        stopCandidateCount++;
      }

      if (stopCandidateCount > 6) {
        //reset as 30 seconds with low/no speed have passed (5 sec sampling rate)
        stopCandidateCount = 0;
        if (currentSegment.trkpt.length > 0) {
          segments.push(currentSegment);
          currentSegment = {
            trkpt: []
          };
        }
      }
    });

  });

  return segments;
}
