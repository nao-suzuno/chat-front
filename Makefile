.PHONY: build clean

build: 
	npm run build

clean:
	rm -rf ./bin

deploy: clean build