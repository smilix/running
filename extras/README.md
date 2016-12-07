# build_with_docker

A docker image that builds the server. Create the image with
```sh
docker build -t running-linux-build .
```

Now you can use the command from the make file to build the server for linux (amd64):
```sh
make build-linux-server
```

# myRunning.service

A Systemd service file to run the running service.