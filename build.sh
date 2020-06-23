#!/usr/bin/env bash

OUTPUT=build
STATIC_APP=${OUTPUT}/static_app
CLIENT_SOURCE=webapp

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
        server-docker)
            copyTpl
            mkdir -p ${OUTPUT}
            docker run -it --rm \
                -v "$(pwd)":/go/src/github.com/smilix/running \
                --workdir /go/src/github.com/smilix/running/server \
                golang:1.13 \
                go build -v -o ../${OUTPUT}/server server.go
            ;;
        client)
            rm -rf ${STATIC_APP}
            mkdir -p ${OUTPUT}
            ( cd ${CLIENT_SOURCE} && npm ci && npm run build )
            ;;
        *)
            usage
            exit 1
    esac
    shift
done
