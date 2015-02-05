all: development

clean:
	@test -d build && rm -r build || true

deps:
	@npm install

development: clean deps
	./node_modules/.bin/webpack-dev-server --inline --hot --content-base .

github: clean deps
	git checkout gh-pages
	rm -rf img/
	mv build/* .
	rmdir build
	git add .
	git commit -m "updated"
	git push origin gh-pages
	git checkout react
