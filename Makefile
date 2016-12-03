#
OUTPUT=build
STATIC_APP=$(OUTPUT)/static_app

all: check-client build-server build-client copy-client

build-server: server/** copy-tpl
	go build -o $(OUTPUT)/server server/server.go

copy-tpl:
	mkdir -p $(OUTPUT)
	test -e config.json && cp config.json $(OUTPUT)/ || cp config.template.json $(OUTPUT)/config.json

clean:
	rm -rf $(OUTPUT)

copy-client: check-client clean-client
	cp -r $(repo)/dist $(STATIC_APP)

build-client: check-client
	cd $(repo) && ng build --prod --base-href /app/

clean-client:
	rm -rf $(STATIC_APP)

check-client:
ifndef repo
		$(error client is undefined, use "repo=..." )
endif

.PHONY : build copy clean client
