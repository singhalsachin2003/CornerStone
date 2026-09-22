#!/usr/bin/env bash
# Pull the four variable faces gen2.py expects. Run once.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts && cd fonts
base=https://raw.githubusercontent.com/google/fonts/main/ofl
curl -sSL -o PlusJakartaSans.ttf "$base/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
curl -sSL -o SourceSerif4.ttf    "$base/sourceserif4/SourceSerif4%5Bopsz,wght%5D.ttf"
curl -sSL -o Archivo.ttf         "$base/archivo/Archivo%5Bwdth,wght%5D.ttf"
curl -sSL -o JetBrainsMono.ttf   "$base/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
echo "fonts ready:"; ls -la
