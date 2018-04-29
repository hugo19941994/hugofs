#!/bin/sh
zip -r deploy.zip .
scp -r deploy.zip hfs@hugofs.com:deploy.zip
ssh hfs@hugofs.com 'unzip -o deploy.zip -d hugofs; rm deploy.zip;'
