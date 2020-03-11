BIN_DIR ?= node_modules/.bin
P="\\033[32m[+]\\033[0m"

check-dep:
	@echo "$(P) Install dependencies of all packages"
	yarn install --frozen-lockfile

dev: check-dep
	@echo "$(P) Run \`npm run dev\` of all packages with \`scripts.dev\`"
	$(BIN_DIR)/lerna run --parallel dev

build: clean build-lib build-dist 

build-lib: check-dep
	@echo "$(P) Run \`npm run build\` of all packages with \`scripts.build\`"
	$(BIN_DIR)/lerna run --stream build
	NODE_ENV=production $(BIN_DIR)/babel packages/index.js --out-dir lib --root-mode upward

build-dist:
	$(BIN_DIR)/webpack

clean:
	@echo "$(P) Clean lib/ dist/"
	$(BIN_DIR)/rimraf lib/* dist/*

changed-packages-unit-test:
	@echo "$(P) Run tests of changed packages"
	NODE_ENV=test $(BIN_DIR)/lerna run test --since --stream --include-merged-tags

integration-test:
	@echo "$(P) Run integration tests among packages"
	NODE_ENV=test $(BIN_DIR)/jest dev

test: integration-test changed-packages-unit-test

prettier:
	@echo "$(P) Run prettier"
	$(BIN_DIR)/prettier --write "**/*.{js,json,css,md,html,htm}"

lint: build
	@echo "$(P) Run eslint with --fix"
	$(BIN_DIR)/eslint --fix "**/*.js"

dep-intersect:
	@echo "$(P) Find dependency version intersection among packages"
	$(BIN_DIR)/babel-node dev/print-dep-intersections.js"

.PHONY: check-dep dev build clean changed-packages-unit-test integration-test test prettier lint dep-intersect
