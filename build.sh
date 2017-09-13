#!/usr/bin/env bash

OUTPUT=build
STATIC_APP=${OUTPUT}/static_app
# in this optional file is stored the path to the client repository
CLIENT_SOURCE_FILE=client-source

copyTpl() {
    mkdir -p ${OUTPUT}
	cp config.template.toml ${OUTPUT}/
}

usage() {
    echo "Usage $0 (server|linux-server|client)"
}

if [ "$1" == "" ]; then
    usage
    exit 1
fi

while (( "$#" )); do
    case "$1" in
        clean)
            rm -rf ${OUTPUT}
            ;;
        server)
            copyTpl
            mkdir -p ${OUTPUT}
            ( cd server && go build -o ../${OUTPUT}/server server.go )
            ;;
        linux-server)
            copyTpl
            mkdir -p ${OUTPUT}
            docker run -it --rm \
                -v "$(pwd)":/go/src/github.com/smilix/running \
                -w /go/src/github.com/smilix/running/server \
                golang:1.9 \
                go build -v -o ../${OUTPUT}/server server.go
            ;;
        client)
            CLIENT_SOURCE=$(test -e ${CLIENT_SOURCE_FILE} && cat ${CLIENT_SOURCE_FILE})
            if [ "$CLIENT_SOURCE" == "" ]; then
                echo "The running-client source is undefined, use the \"CLIENT_SOURCE=...\" parameter or put the path into the ${CLIENT_SOURCE_FILE} file."
                exit 1
            fi

            mkdir -p ${OUTPUT}
            ( cd ${CLIENT_SOURCE} && ng build --prod --base-href /app/ )
            cp -r ${CLIENT_SOURCE}/dist ${STATIC_APP}
            ;;
        *)
            usage
            exit 1
    esac
    shift
done