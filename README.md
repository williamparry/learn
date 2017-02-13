# Learn

This is from the course material written to teach at the community [Web Development 101](http://www.randwick.nsw.gov.au/library/library-events/library-calendar/events/2015/april/web-development-101?SQ_CALENDAR_DATE=2015-05-10) course in May 2015.

The Make a Homepage section has been removed.

It lives at [learn.williamparry.com](http://learn.williamparry.com)

To run:

	npm install
	gulp

To generate screenshots of example pages you'll need phantomjs installed and the following packages:

	"node-phantom": "git+https://github.com/williamparry/node-phantom.git",
    "mkdirp": "^0.5.0",
    "ncp": "^2.0.0",
    "serve-static": "^1.9.2",
    "finalhandler": "^0.3.4",
    "glob": "^5.0.3",
    "figures": "^1.3.5"

Then run:

	node screenshots