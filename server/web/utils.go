package web

import (
	"github.com/gin-gonic/gin"
	"github.com/smilix/running/server/common"
	"strconv"
)


// returns true for an error and handles the error in that case
func CheckErrRest(c *gin.Context, err error, status int, msg string) bool {
	if err == nil {
		return false
	}
	common.LOG().Println(msg, err)
	SendJsonError(c, status, msg + " - " + err.Error())
	return true
}

// Sends the default error result with the given http status and message.
// Aborts also the current request
func SendJsonError(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{
		"result": "error",
		"reason": msg,
	})
	c.Abort()
}

// the id, check second return value for error (is already handled)
func getIdParam(c *gin.Context) (int, bool) {
	idParam := c.Params.ByName("id")
	id, idErr := strconv.Atoi(idParam)
	if idErr != nil {
		c.JSON(400, gin.H{
			"result": "error",
			"reason": "invalid id",
		})
		return 0, false
	}

	return id, true
}
