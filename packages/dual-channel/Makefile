ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make dev-server - Start webpack dev server and hot reload any change"
	@echo "$(P) make build - Transpile es6 and above to es5 files, and build webpack bundles"
	@echo "$(P) make test-embedded-code - Local build a mock embedded code to test"

dev-server: 
	@echo "$(P) Generate dev/index.html"
	$(ROOT_BIN_DIR)/babel-node dev/create-index-html --root-mode upward
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config dev/webpack.config.js

build: clean build-default
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js

clean:
	@echo "$(P) Clean lib/ dist/"
	$(ROOT_BIN_DIR)/rimraf lib/ dist/

test-embedded-code: clean
	@echo "$(P) Build development mode webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack --config webpack.config.js
	@echo "$(P) Build testing embedded code and start express server to test it."
	$(ROOT_BIN_DIR)/babel-node src/build-code/test-generated-embedded-code --root-mode upward

.PHONY: build clean dev-server test-embedded-code
