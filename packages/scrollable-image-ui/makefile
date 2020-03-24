ROOT_DIR ?= $(abspath ../..)
include $(ROOT_DIR)/dev/base.makefile

build: clean
	@echo "$(P) Build dist/ files"
	$(ROOT_BIN_DIR)/webpack

clean:
	@echo "$(P) Clean dist/"
	$(ROOT_BIN_DIR)/rimraf dist/

dev:
	@echo "$(P) Running dev server on port 8080"
	NODE_ENV=development $(ROOT_BIN_DIR)/webpack-dev-server

.PHONY: dev build clean
