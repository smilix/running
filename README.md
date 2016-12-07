# install

```
go get github.com/gin-gonic/gin \
  && go get github.com/dgrijalva/jwt-go \
  && go get github.com/mattn/go-sqlite3 \
  && go get gopkg.in/gorp.v1 \
  && go get golang.org/x/crypto/bcrypt
```

# running

Create the server and client with
```
cd $SOME_PATH
git clone <client>
make clean all CLIENT_SOURCE=$SOME_PATH/running-client
```

## Authentication

Create a new login credentials for `$USER` with
```
htpasswd -B -C 5 -n $USER
```
and put the output into the `config.json` at the `auth` key.



## Testing requests
```bash
# list runs
curl -v --header "Content-Type:application/json" 'localhost:8080/runs?max=5'

# add new run
curl -vX POST --header "Content-Type:application/json" -d @new.json localhost:8080/runs

# update run
curl -vX PUT --header "Content-Type:application/json" -d @update.json localhost:8080/runs/1

# delete run
curl -vX DELETE --header "Content-Type:application/json" localhost:8080/runs/
```

# Used libs

* https://github.com/gin-gonic/gin
* https://github.com/go-gorp/gorp
* https://github.com/dgrijalva/jwt-go
* https://github.com/mattn/go-sqlite3
