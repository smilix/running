package main

import (
	m "running/server/models"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
	"log"
	"running/server/config"
)

func main() {
	router := gin.Default()

	router.GET("/runs", RunsList)
	router.POST("/runs", CreateRun)
	router.GET("/runs/:id", RunDetail)

	router.Run(":" + config.Get().Port)
}

func RunsList(c *gin.Context) {
	var Runs []m.Run
	_, err := m.Dbm.Select(&Runs, "select * from Runs")
	checkErr(err, "Select failed")
	content := gin.H{}
	for k, v := range Runs {
		content[strconv.Itoa(k)] = v
	}
	c.JSON(200, content)
}

func RunDetail(c *gin.Context) {
	Run_id := c.Params.ByName("id")
	id, idErr := strconv.Atoi(Run_id)
	if idErr != nil {
		c.JSON(400, gin.H{
			"result": "error",
			"reason": "invalid id",
		})
		return
	}
	runFromDb := m.Run{}
	err := m.Dbm.SelectOne(&runFromDb, "select * from Runs where id=?", id)
	if err != nil {
		c.JSON(404, gin.H{})
		return
	}
	c.JSON(200, runFromDb)
}

func CreateRun(c *gin.Context) {
	var json m.Run

	err := c.Bind(&json) // This will infer what binder to use depending on the content-type header.
	if err != nil {
		log.Println("input error", err)
		c.JSON(400, gin.H{
			"result": "error",
			"reason": err.Error(),
		})
		return
	}
	Run := createRun(json)

	content := gin.H{
		"result": "Success",
		"id": Run.Id,
	}
	c.JSON(201, content)
}

func createRun(run m.Run) m.Run {
	Run := m.Run{
		Created:  time.Now().Unix(),
		Length: run.Length,
		Comment: run.Comment,
		Date: run.Date,
		TimeUsed: run.TimeUsed,
	}

	err := m.Dbm.Insert(&Run)
	checkErr(err, "Insert failed")
	return Run
}

func checkErr(err error, msg string) {
	if err != nil {
		log.Fatalln(msg, err)
	}
}