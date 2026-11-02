#!/bin/sh
# Builds the public site into dist/ for Cloudflare. Runs automatically on every deploy (see wrangler.jsonc).
# 1. copies only public files (docs/, tools/ and config files stay private)
# 2. stamps style.css / site.js links with a hash of their contents, so visitors always get the latest
#    version even though those files are cached for a year (see _headers)
set -e
rm -rf dist && mkdir dist
cp *.html style.css site.js robots.txt sitemap.xml llms.txt llms-full.txt agents.md favicon.ico favicon-32.png apple-touch-icon.png _headers _redirects dist/
cp -R assets fonts vendor dist/
hash() { (sha1sum "$1" 2>/dev/null || shasum "$1") | cut -c1-8; }   # Linux / macOS
css=$(hash style.css); js=$(hash site.js)
for f in dist/*.html; do
  sed -E "s#(href=\")style\.css(\?v=[0-9a-f]+)?\"#\1style.css?v=$css\"#; s#(src=\")site\.js(\?v=[0-9a-f]+)?\"#\1site.js?v=$js\"#" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
echo "dist: $(find dist -type f | wc -l | tr -d ' ') files, style.css?v=$css, site.js?v=$js"
