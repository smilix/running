package config

import (
	"io/ioutil"
	"encoding/json"
	"github.com/smilix/running/server/common"
)

type Configuration struct {
	Host          string `json:"host"`
	Port          string `json:"port"`
	DbFile        string `json:"dbFile"`
	StaticFolder  string `json:"staticFolder"`
	Auth          string `json:"auth"`
	SessionSecret string `json:"sessionSecret"`
}

var config Configuration

func Get() Configuration {
	return config
}

func init() {
	config = loadConfig("config.json")
}

func loadConfig(path string) Configuration {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		common.LOG().Fatal("Config File Missing. ", err)
	}

	var config Configuration
	err = json.Unmarshal(file, &config)
	if err != nil {
		common.LOG().Fatal("Config Parse Error: ", err)
	}

	return config
}
