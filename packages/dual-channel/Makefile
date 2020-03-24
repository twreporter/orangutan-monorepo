ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

P := "\\033[32m[+]\\033[0m"

help:
	@echo "$(P) make dev-server - Start webpack dev server and hot reload any change"
	@echo "$(P) make build - Transpile es6 and above to es5 files, and build webpack bundles"
	@echo "$(P) make test-embedded-code - Local build a mock embedded code to test"

dev-server: 
	@echo "$(P) Generate dev/index.html"
	$(BIN_DIR)/babel-node dev/create-index-html --root-mode upward
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(BIN_DIR)/webpack-dev-server --config dev/webpack.config.js

build-root-dist: 
	@echo "$(P) Create webpack bundles at $(ROOT_DIR)/dist/"
	cd $(ROOT_DIR) && $(MAKE) build-dist

copy-root-dist:
	@echo "$(P) cp -r $(ROOT_DIR)/dist $(CURRENT_DIRNAME)/dist"
	cp -rf $(ROOT_DIR)/dist .

build: clean build-default build-root-dist copy-root-dist

clean:
	@echo "$(P) Clean lib/ dist/"
	$(BIN_DIR)/rimraf lib/ dist/

test-embedded-code: build
	@echo "$(P) Build testing embedded code and start express server to test it."
	node lib/build-code/test-generated-embedded-code

.PHONY: build clean dev-server test-embedded-code
