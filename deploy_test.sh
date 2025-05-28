#!/bin/bash

# Git pull
echo "Pulling latest changes from Git..."
git pull origin test

# Next.js 설치
echo "Installing Next.js dependencies..."
if ! yarn install; then
    echo "Yarn install failed, keeping the current running application."
    exit 1
fi

# Next.js 빌드
echo "Building Next.js application..."
if ! yarn build; then
    echo "Yarn build failed, keeping the current running application."
    exit 1
fi

# PM2로 애플리케이션 재실행 (ecosystem 사용)
echo "Restarting application with PM2 using ecosystem.config.js..."
pm2 stop nextjs-apps || true
pm2 delete nextjs-apps || true
pm2 start ecosystem.config.js

# Nginx 재시작
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully!"