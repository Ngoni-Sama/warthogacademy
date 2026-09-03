#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Warthog Academy — auto-deploy to the nivacity document root.
# Pulls the latest main and copies ONLY the web files into DOCROOT.
# Safe to run from cron: it exits early when there's nothing new.
#
#   REPO     git working copy (default: ~/wa-src)
#   DOCROOT  the domain's document root (default: ~/warthogacademy.co.zw)
#
# One-off:   bash ~/wa-src/deploy.sh
# Cron (10m): */10 * * * * /bin/bash $HOME/wa-src/deploy.sh >> $HOME/wa-src/deploy.log 2>&1
# ─────────────────────────────────────────────────────────────
set -e

REPO="${REPO:-$HOME/wa-src}"
# DirectAdmin document root for the domain
DOCROOT="${DOCROOT:-$HOME/domains/warthogacademy.co.zw/public_html}"

cd "$REPO"

git fetch --quiet origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

# Nothing changed since last run → do nothing (keeps cron quiet/cheap)
if [ "$LOCAL" = "$REMOTE" ] && [ -f "$DOCROOT/index.html" ]; then
  exit 0
fi

git reset --hard origin/main --quiet

mkdir -p "$DOCROOT/assets/img"
cp -a index.html styles.css script.js "$DOCROOT"/
cp -a assets/img/*.png assets/img/*.jpg "$DOCROOT/assets/img/" 2>/dev/null || true

echo "$(date '+%Y-%m-%d %H:%M:%S') deployed ${REMOTE:0:7} -> $DOCROOT"
