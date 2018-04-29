#!/bin/sh
zip -r deploy.zip .
scp -r deploy.zip hfs@hugofs.com:deploy.zip
ssh hfs@hugofs.com << EOF
  unzip -o deploy.zip -d hugofs
  rm deploy.zip
  systemctl --user restart hugofs.service
  systemctl --user restart hugofsback.service
EOF
