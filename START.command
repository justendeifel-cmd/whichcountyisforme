#!/bin/bash
# Doppelklick auf diese Datei → Browser öffnet automatisch
cd "$(dirname "$0")"
echo "============================================"
echo "  USA County Finder — Lokaler Server"
echo "============================================"
echo ""
echo "  Öffne im Browser: http://localhost:8080"
echo ""
echo "  Zum Beenden: Strg+C drücken"
echo "============================================"
open "http://localhost:8080"
python3 -m http.server 8080
