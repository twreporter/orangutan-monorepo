ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile
DEV_HOST ?= testtest.twreporter.org

build: clean build-default
	@echo "$(P) Build webpack chunks, bundles and webpack-assets.json"
	NODE_ENV=production $(ROOT_BIN_DIR)/webpack --config webpack.config.js

dev-server:
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config dev/webpack.config.js --host $(DEV_HOST)

clean:
	@echo "$(P) Clean lib/ dist/"
	$(ROOT_BIN_DIR)/rimraf lib/ dist/

.PHONY: build clean dev-server