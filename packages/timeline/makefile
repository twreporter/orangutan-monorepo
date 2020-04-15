ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile
SHEET ?= 1f76OLdfZe3kyNOKiPthWNJWVGmY3bkm5KtxB4NYp9uU
DEV_HOST ?= localhost

dev-fetch-data:
	SHEET=$(SHEET) $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/fetch-data.js"

dev-build-code:
	NODE_ENV=production $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/build-code.js"

dev-server:
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config dev/webpack.config.js --host $(DEV_HOST)

build: clean build-default

clean:
	@echo "$(P) Clean lib/"
	$(ROOT_BIN_DIR)/rimraf lib/

.PHONY: build clean dev-server dev-build-code dev-fetch-data