FROM golang:1.6
ENV GOOS linux
ENV GOARCH amd64
RUN go get github.com/gin-gonic/gin \
  && go get github.com/dgrijalva/jwt-go \
  && go get github.com/mattn/go-sqlite3 \
  && go get gopkg.in/gorp.v1 \
  && go get golang.org/x/crypto/bcrypt \
  && go get github.com/naoina/toml

WORKDIR /go/src/smilix/running
