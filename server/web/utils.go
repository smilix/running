package web

import (
	"github.com/gin-gonic/gin"
	"smilix/running/server/common"
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