#!/usr/bin/env bash
node build-index.js
git add --all
git commit -m 'update';
git push
