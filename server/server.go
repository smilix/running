package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/smilix/running/server/config"
	"github.com/smilix/running/server/web"
)

func main() {
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(web.CORSMiddleware("/api"))

	api := router.Group("/api")
	web.NewAuth(api.Group("/auth"))
	web.NewRuns(api.Group("/runs"))
	api.GET("/status", sendStatus)

	web.NewStaticFiles(router.Group("/app"))
	router.GET("/", redirectToApp)

	router.Run(config.Get().Host + ":" + strconv.Itoa(config.Get().Port))
}

func redirectToApp(c *gin.Context) {
	c.Redirect(http.StatusTemporaryRedirect, "/app")
}

func sendStatus(c *gin.Context) {
	content := gin.H{
		"result": "Success",
	}
	c.JSON(200, content)
}
