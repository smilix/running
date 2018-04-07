package web

import "github.com/gin-gonic/gin"
import (
	m "github.com/smilix/running/server/models"
	"time"
)

const LAST_RUNS = 10;

type Shoes struct {
}

func NewShoes(group *gin.RouterGroup) *Shoes {
	s := new(Shoes)

	group.Use(CheckAuthMiddleware())

	group.GET("", s.listShoes)
	group.POST("", s.createShoe)
	group.GET("/:id", s.getShowDetails)
	group.PUT("/:id", s.updateShoe)
	group.DELETE("/:id", s.deleteShoe)

	return s
}

func (r *Shoes) listShoes(c *gin.Context) {
	var shoes []m.ShoeUsedView
	_, err := m.Dbm.Select(&shoes, m.ShoeUsedView_Join)
	if CheckErrRest(c, err, 500, "Select failed") {
		return
	}

	content := gin.H{
		"result": "Success",
		"shoes":   shoes,
	}
	c.JSON(200, content)
}

func (r * Shoes) getShowDetails(c *gin.Context) {
	id, valid := getIdParam(c)
	if !valid {
		return
	}
	shoeFromDb := m.ShoeUsedView{}
	err := m.Dbm.SelectOne(&shoeFromDb, m.ShoeUsedView_Join_With_Id, id)
	if err != nil {
		c.JSON(404, gin.H{})
		return
	}

	var lastRuns []m.Run
	m.Dbm.Select(&lastRuns, "select * from Runs where ShoeId = ? order by Date desc limit ?", id, LAST_RUNS)

	c.JSON(200, gin.H{
		"result": "Success",
		"shoe": shoeFromDb,
		"lastRuns": lastRuns,
	})
}

func (r *Shoes) createShoe(c *gin.Context) {
	var json m.Shoe

	err := c.Bind(&json) // This will infer what binder to use depending on the content-type header.
	if CheckErrRest(c, err, 400, "input error") {
		return
	}
	shoe := m.Shoe{
		Created:  time.Now().Unix(),
		Bought: json.Bought,
		Comment: json.Comment,
	}

	err = m.Dbm.Insert(&shoe)
	CheckErrRest(c, err, 500, "Insert failed")

	content := gin.H{
		"result": "Success",
		"id": shoe.Id,
	}
	c.JSON(201, content)
}

func (r *Shoes) updateShoe(c *gin.Context) {
	id, valid := getIdParam(c)
	if !valid {
		return
	}
	shoeFromDb := m.Shoe{}
	err := m.Dbm.SelectOne(&shoeFromDb, "select * from Shoes where id=?", id)
	if err != nil {
		c.JSON(404, gin.H{})
		return
	}

	var inputShoe m.Shoe
	err = c.Bind(&inputShoe) // This will infer what binder to use depending on the content-type header.
	if CheckErrRest(c, err, 400, "input error") {
		return
	}

	shoeFromDb.Comment = inputShoe.Comment
	shoeFromDb.Bought = inputShoe.Bought

	_, err = m.Dbm.Update(&shoeFromDb)
	if CheckErrRest(c, err, 500, "update error") {
		return
	}

	c.JSON(200, shoeFromDb)
}

func (r *Shoes) deleteShoe(c *gin.Context) {
	id, valid := getIdParam(c)
	if !valid {
		return
	}

	result, err := m.Dbm.Exec("delete from Shoes where id=?", id)
	if CheckErrRest(c, err, 500, "deletion error") {
		return
	}

	rows, _ := result.RowsAffected()
	if rows != 1 {
		c.JSON(404, gin.H{});
		return
	}

	c.JSON(200, gin.H{
		"result": "ok",
	})
}
