TESTS=test/spec/*.js

all: npm test

npm:
	@npm install

test:
	@./node_modules/mocha/bin/mocha --reporter dot $(TESTS)
	@rm ./test/fixtures/rnd_*

.PHONY: all npm test
