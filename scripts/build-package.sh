#!/bin/bash
# Build a complete downloadable package for ITL project
# Contains: conversation transcript + source code + PDF guide + screenshots

set -e

PACKAGE_DIR="/home/z/my-project/download/itl-full-package"
ZIP_FILE="/home/z/my-project/download/ITL-Full-Package.zip"

# Clean previous builds
rm -rf "$PACKAGE_DIR" "$ZIP_FILE"
mkdir -p "$PACKAGE_DIR/screenshots" "$PACKAGE_DIR/itl-website"

echo "📦 Step 1: Copying README + Conversation + PDF..."
cp /home/z/my-project/download/README.md "$PACKAGE_DIR/"
cp /home/z/my-project/download/محادثة-بناء-موقع-ITL.md "$PACKAGE_DIR/"
cp "/home/z/my-project/download/ITL-الدليل-الشامل-للنشر-والإدارة.pdf" "$PACKAGE_DIR/"

echo "📸 Step 2: Copying screenshots..."
cp /home/z/my-project/scripts/*.png "$PACKAGE_DIR/screenshots/" 2>/dev/null || true
ls "$PACKAGE_DIR/screenshots/" | wc -l
echo "screenshots copied"

echo "💻 Step 3: Copying source code (excluding node_modules, .next, db files)..."
cd /home/z/my-project

# Use rsync for clean exclusion
rsync -av --quiet \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='dev.log' \
  --exclude 'server.log' \
  --exclude '*.log' \
  --exclude='db/*.db' \
  --exclude='db/*.db-journal' \
  --exclude='.env' \
  --exclude='download' \
  --exclude='upload' \
  --exclude='worklog.md' \
  --exclude='.zscripts' \
  --exclude='skills' \
  --exclude='mini-services' \
  --exclude='examples' \
  ./ "$PACKAGE_DIR/itl-website/" 2>/dev/null || true

echo "Source code copied"
echo "Files in source: $(find "$PACKAGE_DIR/itl-website" -type f | wc -l)"

echo "📦 Step 4: Creating ZIP archive..."
cd /home/z/my-project/download
zip -r -q "ITL-Full-Package.zip" "itl-full-package"
rm -rf "$PACKAGE_DIR"

echo ""
echo "✅ Done!"
ls -lh /home/z/my-project/download/
echo ""
echo "📊 ZIP Contents:"
unzip -l /home/z/my-project/download/ITL-Full-Package.zip | tail -10
