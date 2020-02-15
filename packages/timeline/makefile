ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile
SHEET ?= 1f76OLdfZe3kyNOKiPthWNJWVGmY3bkm5KtxB4NYp9uU
DATA ?= 

dev-fetch-data:
	SHEET=$(SHEET) $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/fetch-data.js"

dev-build-code:
	NODE_ENV=production $(ROOT_DIR)/node_modules/.bin/babel-node --root-mode upward "./dev/build-code.js"

build: print-package-info
	@echo "$(P) Babel transpile es6 and above to es5 at $(CURRENT_DIRNAME)/lib/"
	NODE_ENV=production $(ROOT_BIN_DIR)/babel src --out-dir lib --copy-files --root-mode upward
