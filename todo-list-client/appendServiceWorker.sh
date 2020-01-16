#!/usr/bin/env bash
API_URL=$REACT_APP_TODO_LIST_API

if [ -f .env ]; then
    API_URL=$(grep REACT_APP_TODO_LIST_API .env | cut -d '=' -f2)
fi

sed -i "s|API_URL|${API_URL}|g" src/serviceWorkerCacheAjax.js

cat src/serviceWorkerCacheAjax.js >> build/service-worker.js
