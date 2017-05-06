# GPX Processor

This little CLI app currently splits a GPX track (`<trk><trkseg>...`) into
actual segments, taking the speed into account to identify stops. Original segment
split points are preserved.

## Usage

Prepare:

`npm install`

Execute:

`node index.js -t track.gpx -o output.gpx`

http://utrack.crempa.net has a nice report generator, where single segments files
can be analyzed.
