package web

import (
	m "smilix/running/server/models"
	"github.com/gin-gonic/gin"
	"strconv"
	"fmt"
	"time"
)

type Runs struct {
}

func NewRuns(group *gin.RouterGroup) *Runs {
	r := new(Runs)

	group.Use(CheckAuthMiddleware())

	group.GET("", r.listRuns)
	group.POST("", r.createRun)
	group.GET("/:id", r.showRunDetail)
	group.PUT("/:id", r.updateRun)
	group.DELETE("/:id", r.deleteRun)

	return r
}

func (r *Runs) listRuns(c *gin.Context) {
	count, err := m.Dbm.SelectInt("select count(*) from Runs")
	CheckErrRest(c, err, 500, "Count failed")

	// pagination params
	limit := ""
	var start, _ = strconv.Atoi(c.DefaultQuery("start", "0"))
	var max, _ = strconv.Atoi(c.DefaultQuery("max", "0"))
	if start > 0 {
		if max == 0 {
			c.JSON(400, gin.H{
				"result": "error",
				"reason": "'start' requires the 'max' parameter.",
			})
			return;
		}

		rowCount := start + max
		limit = fmt.Sprintf(" limit %d, %d", start, rowCount)
	} else {
		if max > 0 {
			limit = fmt.Sprintf(" limit %d", max)
		}
	}

	// date from/to limits
	where := ""
	fromStr := c.Query("from")
	toStr := c.Query("to")

	namedParams := map[string]interface{}{}

	// add a time range if from or to is provided
	if len(fromStr) > 0 && len(toStr) > 0 {
		var to time.Time
		var from time.Time
		//var err
		from, err = time.ParseInLocation("2006-01-02", fromStr, time.UTC)
		if CheckErrRest(c, err, 400, "'from'") {
			return
		}
		to, err = time.ParseInLocation("2006-01-02", toStr, time.UTC)
		if CheckErrRest(c, err, 400, "'to'") {
			return
		}

		where = " where Date > :from and Date < :to"
		namedParams["from"] = from.Unix()
		namedParams["to"] = to.Unix()
	}

	var Runs []m.Run
	_, err = m.Dbm.Select(&Runs, "select * from Runs " + where + " order by Date desc" + limit, namedParams)
	if CheckErrRest(c, err, 500, "Select failed") {
		return
	}

	content := gin.H{
		"result": "Success",
		"runs": Runs,
		"count": count,
	}
	c.JSON(200, content)
}

func (r *Runs) showRunDetail(c *gin.Context) {
	id, valid := getRunId(c)
	if !valid {
		return
	}
	runFromDb := m.Run{}
	var err error
	if (id == -1) {
		// just get the last one
		err = m.Dbm.SelectOne(&runFromDb, "select * from Runs order by id desc limit 1")
	} else {
		err = m.Dbm.SelectOne(&runFromDb, "select * from Runs where id=?", id)
	}
	if err != nil {
		c.JSON(404, gin.H{})
		return
	}
	c.JSON(200, runFromDb)
}

func (r *Runs) createRun(c *gin.Context) {
	var json m.Run

	err := c.Bind(&json) // This will infer what binder to use depending on the content-type header.
	if CheckErrRest(c, err, 400, "input error") {
		return
	}
	Run := m.Run{
		Created:  time.Now().Unix(),
		Length: json.Length,
		Comment: json.Comment,
		Date: json.Date,
		TimeUsed: json.TimeUsed,
	}

	err = m.Dbm.Insert(&Run)
	CheckErrRest(c, err, 500, "Insert failed")

	content := gin.H{
		"result": "Success",
		"id": Run.Id,
	}
	c.JSON(201, content)
}

// note no partial updates are allowed
func (r *Runs) updateRun(c *gin.Context) {
	id, valid := getRunId(c)
	if !valid {
		return
	}
	runFromDb := m.Run{}
	err := m.Dbm.SelectOne(&runFromDb, "select * from Runs where id=?", id)
	if err != nil {
		c.JSON(404, gin.H{})
		return
	}

	var inputRun m.Run
	err = c.Bind(&inputRun) // This will infer what binder to use depending on the content-type header.
	if CheckErrRest(c, err, 400, "input error") {
		return
	}

	runFromDb.Length = inputRun.Length
	runFromDb.Comment = inputRun.Comment
	runFromDb.Date = inputRun.Date
	runFromDb.TimeUsed = inputRun.TimeUsed

	_, err = m.Dbm.Update(&runFromDb)
	if CheckErrRest(c, err, 500, "update error") {
		return
	}

	c.JSON(200, runFromDb)
}

func (r *Runs) deleteRun(c *gin.Context) {
	id, valid := getRunId(c)
	if !valid {
		return
	}

	result, err := m.Dbm.Exec("delete from Runs where id=?", id)
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

/* helper functions */

// the id, check second return value for error (is already handled)
func getRunId(c *gin.Context) (int, bool) {
	Run_id := c.Params.ByName("id")
	id, idErr := strconv.Atoi(Run_id)
	if idErr != nil {
		c.JSON(400, gin.H{
			"result": "error",
			"reason": "invalid id",
		})
		return 0, false
	}

	return id, true
}
