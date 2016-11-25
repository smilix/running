# running

...

## Authentication

Create a new login credentials for `$USER` with
```
htpasswd -B -C 5 -n $USER
```
and put the output into the `config.json` at the `auth` key.


## get runs
```
curl -v --header "Content-Type:application/json" 'localhost:8080/runs?max=5'
```

## new run
```
curl -vX POST --header "Content-Type:application/json" -d @new.json localhost:8080/runs
```

## update run
```
curl -vX PUT --header "Content-Type:application/json" -d @update.json localhost:8080/runs/1
```


## delete run
```
curl -vX DELETE --header "Content-Type:application/json" localhost:8080/runs/
```

# Libs

* https://github.com/gin-gonic/gin
* https://github.com/go-gorp/gorp
* https://github.com/dgrijalva/jwt-go
