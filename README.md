# Build 

## Install dependencies

You need the dependency manager glide ( https://github.com/Masterminds/glide ). 

```
cd server
glide install
glide rebuild
cd ..
```

## Install front end 

Put the client somewhere
```
cd $SOME_PATH
git clone <client>
```

## Build server

```
export CLIENT_SOURCE=$SOME_PATH/running-client
./build.sh client server
# or using docker: 
./build.sh client linux-server 
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

# Used libs

See the `server/glide.yaml`. 