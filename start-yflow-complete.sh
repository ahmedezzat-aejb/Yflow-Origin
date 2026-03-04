#!/bin/bash

echo "🚀 Starting YFlow Platform - Complete Project"
echo "🌍 Languages: Russian, English, Arabic, Chinese"
echo "💳 Payment: YooKassa + СБП"
echo "🎨 White Label: Complete"
echo ""

# Start frontend directly with Vite
cd packages/react-ui
npx vite --port 4300 --host 0.0.0.0
