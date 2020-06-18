ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile
DEV_HOST ?= testtest.twreporter.org
DEV_PORT ?= 8080
IN ?= 1qMXdqZXtANzpOVlKRJJfVhr6YBOuzHV65VJBoylvxk0,1JwQ95yOsr7NEaAv4eX2L0b_hgKFVNqB6L2LE_rW_UXc,1P-RjNv-dFpEH0TadDHr8bEg-L-58or4IxeOgTWPO6Mo                  

dev-fetch-data:
	in=$(IN) $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/fetch-data.js"

dev-build-code:
	NODE_ENV=production $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/build-code.js"

dev-server:
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config dev/webpack.config.js --host $(DEV_HOST) --port ${DEV_PORT}

dev-validate:
	NODE_ENV=production $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/validate.js"

build: clean build-default
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js

clean:
	@echo "$(P) Clean lib/"
	$(ROOT_BIN_DIR)/rimraf lib dist

.PHONY: build clean dev-server dev-build-code dev-fetch-data