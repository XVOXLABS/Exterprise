#!/bin/sh
# Copies only the public website into dist/ for Cloudflare (run automatically by `wrangler deploy`).
set -e
rm -rf dist && mkdir dist
cp *.html style.css site.js robots.txt sitemap.xml llms.txt llms-full.txt agents.md favicon.ico favicon-32.png apple-touch-icon.png _headers _redirects dist/
cp -R assets fonts vendor dist/
echo "dist: $(find dist -type f | wc -l | tr -d ' ') files"
