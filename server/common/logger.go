package common

import (
	"log"
	"os"
)

var logger = log.New(os.Stderr, "", log.LstdFlags)

func LOG() *log.Logger {
	return logger
}
