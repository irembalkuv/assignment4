#!/bin/sh
# İrem Balkuv, 2200004679
# Builds latex/guide.pdf from README.md. Run from the latex/ folder: sh build.sh
set -e
# skip the name/number header (the title page has it) and replace the one emoji the font does not have
tail -n +9 ../README.md | sed 's/🛰/[satellite emoji]/g' > body.md
pandoc body.md -f gfm -t latex --listings --wrap=preserve --shift-heading-level-by=-1 --columns=60 -o body.tex
python3 fixtables.py body.tex
xelatex -interaction=nonstopmode guide.tex > /dev/null
xelatex -interaction=nonstopmode guide.tex > /dev/null   # second run fills in the contents page
rm -f body.md
grep -c "Overfull" guide.log || true
