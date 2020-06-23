package web

import (
	"github.com/gin-gonic/gin"
	"github.com/smilix/running/server/config"
	"net/http"
	"os"
	"strings"
)

type (
	ngRoutesAwareFS struct {
		fs http.FileSystem
	}
	neuteredReaddirFile struct {
		http.File
	}
)

func NewStaticFiles(group *gin.RouterGroup) {
	fs := &ngRoutesAwareFS{http.Dir(config.Get().StaticFolder)}
	fileServer := http.StripPrefix(group.BasePath(), http.FileServer(fs))
	urlPattern :=  "/*filepath"
	group.GET(urlPattern, func(c *gin.Context) {
		fileServer.ServeHTTP(c.Writer, c.Request)
	})
}


// Conforms to http.Filesystem
func (fs ngRoutesAwareFS) Open(name string) (http.File, error) {
	f, err := fs.fs.Open(name)
	if err != nil {
		if strings.Contains(name, ".") {
			// a ng route has no point in it
			// (and this checks also for the 'index.html'
			return nil, err
		}

		return fs.Open("/index.html")
	}

	return neuteredReaddirFile{f}, nil
}

// (copied from gin/fs.go)
// Overrides the http.File default implementation
func (f neuteredReaddirFile) Readdir(count int) ([]os.FileInfo, error) {
	// this disables directory listing
	return nil, nil
}

