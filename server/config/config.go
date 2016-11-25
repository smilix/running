package config

import (
	"io/ioutil"
	"log"
	"encoding/json"
)

type Configuration struct {
	Port   string `json:"port"`
	DbFile string `json:"dbFile"`
	Auth   string `json:"auth"`
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
		log.Fatal("Config File Missing. ", err)
	}

	var config Configuration
	err = json.Unmarshal(file, &config)
	if err != nil {
		log.Fatal("Config Parse Error: ", err)
	}

	return config
}
