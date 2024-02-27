DEPCRUISE_CONFIG := .dependency-cruiser.cjs
DATA_VOLUME     := $(shell pwd)
GRAPHS_DIR      := graphs
IMAGE           := xpsurgery/simple-wiki-api
MK_IMAGE_BUILT  := .mk-built
MK_PUBLISHED    := .mk-published
MK_COMPILED     := .mk-compiled
MK_LINTED       := .mk-linted
MK_TESTED       := .mk-tested
SOURCES         := $(shell find src test -type f)

depcruise := npx depcruise --config $(DEPCRUISE_CONFIG)

.PHONY: all build-dev ci-* clean clobber dev lint test watch-*

# Software development - - - - - - - - - - - - - - - - - - - - - - - - - - - -

all: $(GRAPHS_DIR)/modules.svg $(GRAPHS_DIR)/arch.svg $(MK_TESTED) $(MK_LINTED)

watch-compiler: node_modules
	npx tsc --watch

watch-tests: node_modules
	npx jest --watch

$(MK_COMPILED): node_modules $(SOURCES) tsconfig.json
	npx tsc --noEmit
	@touch $@

$(MK_TESTED): node_modules $(SOURCES) jest.config.js
	npx jest
	@touch $@

$(MK_LINTED): node_modules .eslintrc.js $(SOURCES) $(DEPCRUISE_CONFIG)
	npx eslint src test --ext .ts
	npx ts-unused-exports tsconfig.json --silent --ignoreTestFiles
	$(depcruise) src
	@touch $@

$(GRAPHS_DIR)/modules.svg: $(SOURCES) $(GRAPHS_DIR) node_modules $(DEPCRUISE_CONFIG)
	$(depcruise) --validate -T dot src | dot -Tsvg > $@

$(GRAPHS_DIR)/arch.svg: $(SOURCES) $(GRAPHS_DIR) node_modules $(DEPCRUISE_CONFIG)
	$(depcruise) -T archi --collapse 2 src | dot -Tsvg > $@

# CI pipeline - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

ci-test: clean $(MK_COMPILED) $(MK_TESTED) $(MK_LINTED)

# Dev server - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

dev: build-dev
	docker run \
		--env-file ./.env \
		-e FORCE_COLOR=3 \
		-p 17000:8081 \
		-v /var/opt/zk:/var/opt/zk \
		-v $(DATA_VOLUME)/src:/home/wiki/src:ro \
		$(IMAGE):local-dev

build-dev: node_modules
	docker build -t $(IMAGE):local-dev . --target dev

# Artefacts - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

node_modules: package.json
	npm install

$(GRAPHS_DIR):
	mkdir -p $@

# Utilities - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

clean:
	rm -f $(MK_IMAGE_BUILT) $(MK_PUBLISHED) $(MK_LINTED) $(MK_TESTED)
	rm -rf $(GRAPHS_DIR) .jest

clobber: clean
	-rm -rf node_modules
	-docker rmi $$(docker images -f "dangling=true" -q)
	-docker volume rm $$(docker volume ls -f "dangling=true" -q)

