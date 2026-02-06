#!/bin/bash

# Quantum Intelligence Studio - Quick Deployment Script
# This script helps you deploy to Netlify quickly

set -e  # Exit on error

echo "🚀 Quantum Intelligence Studio - Deployment Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Run build
echo "🔨 Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Show build output info
    echo "📊 Build Output:"
    du -sh dist/
    echo ""
    
    # Check if netlify-cli is installed
    if command -v netlify &> /dev/null; then
        echo "🌐 Netlify CLI detected!"
        echo ""
        echo "Choose deployment option:"
        echo "  1. Deploy to production (--prod)"
        echo "  2. Deploy as preview"
        echo "  3. Skip deployment (just build)"
        echo ""
        read -p "Enter choice (1-3): " choice
        
        case $choice in
            1)
                echo "🚀 Deploying to production..."
                netlify deploy --prod --dir=dist
                ;;
            2)
                echo "🚀 Deploying as preview..."
                netlify deploy --dir=dist
                ;;
            3)
                echo "✅ Build complete. Deployment skipped."
                ;;
            *)
                echo "❌ Invalid choice. Deployment skipped."
                ;;
        esac
    else
        echo "ℹ️  Netlify CLI not found. Install it with:"
        echo "   npm install -g netlify-cli"
        echo ""
        echo "✅ Build is ready in the 'dist' folder"
        echo ""
        echo "Next steps:"
        echo "  1. Install Netlify CLI: npm install -g netlify-cli"
        echo "  2. Login: netlify login"
        echo "  3. Deploy: netlify deploy --prod --dir=dist"
        echo ""
        echo "Or deploy via Netlify Dashboard:"
        echo "  https://app.netlify.com/drop"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📚 For more deployment options, see DEPLOYMENT.md"
echo "🎉 Happy deploying!"
