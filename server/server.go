package main

import (
	"github.com/gin-gonic/gin"
	"smilix/running/server/config"
	"smilix/running/server/web"
	"net/http"
)

func main() {
	router := gin.Default()
	//router.Use(CORSMiddleware())

	api := router.Group("/api")
	api.Use(CORSMiddleware())

	web.NewAuth(api.Group("/auth"))
	web.NewRuns(api.Group("/runs"))

	api.GET("/status", sendStatus)

	web.NewStaticFiles(router.Group("/app"))

	router.GET("/", redirectToApp)

	router.Run(config.Get().Host + ":" + config.Get().Port)
}

func redirectToApp(c *gin.Context) {
	c.Redirect(http.StatusTemporaryRedirect, "/app")
	//http.Redirect(c.Writer, c.Request, "app/", http.StatusTemporaryRedirect)
}

// allows the client to make cross origin requests to this api
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "application/json")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, " + web.SESSION_HEADER)
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}

func sendStatus(c *gin.Context) {
	content := gin.H{
		"result": "Success",
	}
	c.JSON(200, content)
}
