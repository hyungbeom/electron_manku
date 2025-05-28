#!/bin/bash

# Git pull
echo "Pulling latest changes from Git..."
git pull origin test

# Next.js 설치
echo "Installing Next.js dependencies..."
if ! yarn install; then
    echo "Yarn install failed, keeping the current running application."
    exit 1  # 설치 실패 시 종료
fi

# Next.js 빌드
echo "Building Next.js application..."
if ! yarn build; then
    echo "Yarn build failed, keeping the current running application."
    exit 1  # 빌드 실패 시 종료
fi

# PM2로 애플리케이션 재실행
echo "Restarting application with PM2..."
pm2 stop nextjs-apps || true  # 기존 프로세스가 있으면 중지
pm2 start --name "nextjs-apps" -- bash -c "PORT=3001 yarn start"

# Nginx 재시작
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully!"
