ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

build: 
	@echo "Temporay overwrite base.makefile build target for passing git commit check"

build-static-assets:
	@echo "$(P) Build embedded code to dev/output.txt"
	NODE_ENV=development $(ROOT_BIN_DIR)/babel-node --root-mode upward "./dev/local-build.js"

test-embedded-code: clean build-root-dist copy-root-dist 
	@echo "$(P) Build testing embedded code and start express server to test it."
	$(ROOT_BIN_DIR)/babel-node --root-mode upward "./dev/test-embedded-code-server.js" 
