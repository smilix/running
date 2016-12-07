#
OUTPUT=build
STATIC_APP=$(OUTPUT)/static_app
# in this optional file is stored the path to the client repository
CLIENT_SOURCE_FILE=client-source


CLIENT_SOURCE := $(shell test -e $(CLIENT_SOURCE_FILE) && cat $(CLIENT_SOURCE_FILE))

build-server: server/** copy-tpl
	go build -o $(OUTPUT)/server server/server.go

build-linux-server: server/** copy-tpl
	docker run -it --rm -v "$(shell pwd)":/go/src/smilix/running -w /go/src/smilix/running running-linux-build go build -v -o $(OUTPUT)/server server/server.go

copy-tpl: config.template.json
	mkdir -p $(OUTPUT)
	cp config.template.json $(OUTPUT)/

clean:
	rm -rf $(OUTPUT)

copy-client: check-client clean-client
	cp -r $(CLIENT_SOURCE)/dist $(STATIC_APP)

build-client: check-client
	cd $(CLIENT_SOURCE) && ng build --prod --base-href /app/

clean-client:
	rm -rf $(STATIC_APP)

check-client:
ifndef CLIENT_SOURCE
		$(error The running-client source is undefined, use the "CLIENT_SOURCE=..." parameter or put the path into the $(CLIENT_SOURCE_FILE) file.)
endif
	$(info Using $(CLIENT_SOURCE) as running-client source)

.PHONY : build copy clean client
