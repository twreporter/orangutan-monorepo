ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

help:
	@echo "$(P) make build - Transpile es6 and above to es5 files, and build webpack bundle"
	@echo "$(P) make test-embedded-code - Local build mock embedded codes to test"

build: clean build-default
	@echo "$(P) Build webpack bundles, chunks and webpack-assets.json to dist/"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js 

clean-dist:
	@echo "$(P) Clean dist/"
	$(ROOT_BIN_DIR)/rimraf dist/

clean-lib:
	@echo "$(P) Clean lib/"
	$(ROOT_BIN_DIR)/rimraf lib/

clean: clean-dist clean-lib
	@echo "$(P) Clean dist/ lib/"

test-embedded-code: clean
	@echo "$(P) Build testing embedded code and start express server to test it."
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack --config webpack.config.js 
	$(ROOT_BIN_DIR)/babel-node --root-mode upward "./dev/test-embedded-code-server.js"

dev-server: 
	@echo "$(P) Running dev server on http://0.0.0.0:8080"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config "./dev/webpack.config.js"

