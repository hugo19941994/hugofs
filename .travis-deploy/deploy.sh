#!/bin/sh
zip -q -r deploy.zip .
scp -r deploy.zip hfs@hugofs.com:deploy.zip
ssh hfs@hugofs.com << EOF
  unzip -q -o deploy.zip -d hugofs
  rm deploy.zip
  cd hugofs
  git clean -f -d
  npm install
  npm run build:ssr
  systemctl --user restart hugofs.service
  systemctl --user restart hugofsback.service
EOF
