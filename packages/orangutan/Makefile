ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make build - Transpile es6 and above to es5 files, and build webpack bundles"

build: clean build-default
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js

clean:
	@echo "$(P) Clean lib/ dist/"
	$(ROOT_BIN_DIR)/rimraf lib/ dist/

.PHONY: build clean 
