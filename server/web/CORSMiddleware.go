package web

import (
	"github.com/gin-gonic/gin"
	"strings"
)

// allows the client to make cross origin requests to this api
func CORSMiddleware(path string) gin.HandlerFunc {
	if !strings.HasSuffix(path, "/") {
		path = path + "/"
	}

	return func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, path) {
			c.Next()
			return
		}
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, " + SESSION_HEADER)
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}

