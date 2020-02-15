BIN_DIR ?= node_modules/.bin
P="\\033[32m[+]\\033[0m"

check-dep:
	@echo "$(P) Install dependencies of all packages"
	yarn install --frozen-lockfile

dev: check-dep
	@echo "$(P) Run \`npm run dev\` of all packages with \`scripts.dev\`"
	$(BIN_DIR)/lerna run --parallel dev

build: check-dep
	@echo "$(P) Run \`npm run build\` of all packages with \`scripts.build\`"
	$(BIN_DIR)/lerna run --stream build

clean:
	@echo "$(P) Run \`npm run clean\` of all packages with \`scripts.clean\`"
	$(BIN_DIR)/lerna run --stream clean

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