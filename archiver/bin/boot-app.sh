#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
	node ./dist/server.js
else
	npm run start
fi
