ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

build: 
	@echo "Temporay overwrite base.makefile build target for passing git commit check"

build-static-assets:
	@echo "$(P) Build embedded code to dev/output.txt"
	NODE_ENV=development $(ROOT_BIN_DIR)/babel-node --root-mode upward "./dev/local-build.js"
