# Build 

## Install dependencies

You need the dependency manager dep ( https://github.com/golang/dep ). 

```
cd server
dep ensure
cd ..
```

## Build front end

You need node & npm. 

Put the client somewhere
```
./build.sh client
```

## Build server

```
export CLIENT_SOURCE=$SOME_PATH/running-client
./build.sh server
# or using docker: 
./build.sh server-docker
```

## Configuration

Copy the `build/config.template.toml` to `build/config.toml` and edit the configuration.


# Run

Just run the executable. 


# Testing requests
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
