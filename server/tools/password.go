package main

import (
	"golang.org/x/crypto/bcrypt"
	"fmt"
	"strings"
	"log"
)

func main() {
	pw := "geheim"
	userPass := "holger:$2y$05$irBvCBbeXgvI6RBMTZh1JOjk.Hokozj1RoO6PWzMcPR6vmJXYmruy"

	split := strings.SplitN(userPass, ":", 2)
	if split == nil || len(split) != 2 {
		log.Panic("invalid input")
	}

	hash := []byte(split[1])
	password := []byte(pw)
	//hash := []byte("$2y$05$irBvCBbeXgvI6RBMTZh1JOjk.Hokozj1RoO6PWzMcPR6vmJXYmruy")
	err := bcrypt.CompareHashAndPassword(hash, password)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
	} else {
		fmt.Printf("password ok for %s\n", split[0])
	}

}
