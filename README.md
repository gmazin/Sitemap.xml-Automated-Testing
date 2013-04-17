Sitemap.xml Automated Testing Script using CasperJS

Usage instructions: casperjs sitemap_xml_testing.js --sitemap=<URL TO SITEMAP> --logfile=<LOG FILE NAME>

This script will attempt to crawl through a specified sitemap to check children pages for broken urls, 
images, css, and Javascript. Errors will be recorded to the logfile specified. This script requires 
casperjs to be installed.