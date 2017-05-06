# GPX Processor

This little cli app currently splits a GPX track (`<trk><trkseg>...`) into
actual segments, taking the speed into account to identify stops.

## Usage

Prepare:

`npm install`

Execute:

`node index.js -t track.gpx`

Output segments are stored in the same dir as `output-<n>.gpx`.

http://utrack.crempa.net has a nice report generator, where single segments files
can be analyzed.
