ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build - Transpile es6 and above to es5 files, and build webpack bundles"
	@echo "$(P) make test-embedded-code - Local build mock embedded codes to test"

build: clean build-default
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js

test-embedded-code: clean
	@echo "$(P) Build development mode webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack --config webpack.config.js
	@echo "$(P) Build testing embedded code and start express server to test it."
	$(ROOT_BIN_DIR)/babel-node dev/embedded-code-test-server --root-mode upward

clean:
	@echo "$(P) Clean lib/ dist/"
	$(ROOT_BIN_DIR)/rimraf lib/ dist/

.PHONY: build clean 
