Sitemap.xml Automated Testing Script using CasperJS

Usage instructions: casperjs sitemap_xml_testing.js --sitemap=<URL TO SITEMAP> --logfile=<LOG FILE NAME>

This script will attempt to crawl through a specified sitemap to check children pages for broken urls, 
images, css, and Javascript. Errors will be recorded to the logfile specified. This script requires 
casperjs to be installed.

Known issues:

-PhantomJS seems to crash after writing about 3KB of data to a single log file. This might be able to be fixed
by using multiple log files, or splitting data up differently.

-PhantomJS crashes on certain pages, albeit consistently. Google suggests that it may be a PhantomJS issue.