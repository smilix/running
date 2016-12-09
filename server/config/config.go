package config

import (
	"io/ioutil"
	"github.com/smilix/running/server/common"
	"github.com/naoina/toml"
)

type Configuration struct {
	Host          string
	Port          int
	DbFile        string
	StaticFolder  string
	Auth          string
	SessionSecret string
}

var config Configuration

func Get() Configuration {
	return config
}

func init() {
	config = loadConfig("config.toml")
}

func loadConfig(path string) Configuration {
	buf, err := ioutil.ReadFile(path)
	if err != nil {
		common.LOG().Fatal("Config File Missing. ", err)
	}

	var config Configuration
	err = toml.Unmarshal(buf, &config)
	if err != nil {
		common.LOG().Fatal("Config Parse Error: ", err)
	}

	return config
}
