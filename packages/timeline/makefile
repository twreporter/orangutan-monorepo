ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile
SHEET ?= 1f76OLdfZe3kyNOKiPthWNJWVGmY3bkm5KtxB4NYp9uU
DEV_HOST ?= testtest.twreporter.org

dev-fetch-data:
	SHEET=$(SHEET) $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/fetch-data.js"

dev-build-code:
	NODE_ENV=production $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/build-code.js"

build: print-package-info
	@echo "$(P) Babel transpile es6 and above to es5 at $(CURRENT_DIRNAME)/lib/"
	NODE_ENV=production $(ROOT_BIN_DIR)/babel src --out-dir lib --copy-files --root-mode upward

dev-server:
	@echo "$(P) Start webpack dev server"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server --config dev/webpack.config.js --host $(DEV_HOST)