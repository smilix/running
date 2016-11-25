package main

import (
	"github.com/gin-gonic/gin"
	"smilix/running/server/config"
	"smilix/running/server/routes"
)

func main() {
	router := gin.Default()
	router.Use(CORSMiddleware())

	routes.NewAuth(router.Group("/auth"))
	routes.NewRuns(router.Group("/runs"))

	router.Run(":" + config.Get().Port)
}

// allows the client to make cross origin requests to this api
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Writer.Header().Set("Content-Type", "application/json")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, " + routes.SESSION_HEADER)
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}


