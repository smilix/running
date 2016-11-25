package routes

import (
	"github.com/gin-gonic/gin"
	"strings"
	"log"
	"golang.org/x/crypto/bcrypt"
	"smilix/running/server/config"
	"github.com/dgrijalva/jwt-go"
	"time"
)

const SESSION_LIFETIME_SEC = 12 * 60 * 60;
const SESSION_HEADER = "Session-Id"

type Auth struct {
}

func NewAuth(group *gin.RouterGroup) *Auth{
	a := new(Auth)

	//group.GET("", r.ListRuns)
	group.POST("", a.login)
	//group.GET("/:id", r.ShowRunDetail)
	//group.PUT("/:id", r.UpdateRun)
	//group.DELETE("/:id", r.DeleteRun)

	return a
}

func CheckAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := c.Request.Header.Get(SESSION_HEADER)
		if session == "" {
			log.Println("Invalid session")
			SendJsonError(c, 401, "Session is missing")
			return
		}

		token, err := jwt.Parse(session, func(token *jwt.Token) (interface{}, error) {
			return []byte(config.Get().SessionSecret), nil
		})
		if !token.Valid {
			logErrorDetail(err)
			SendJsonError(c, 401, "Invalid session")
			return
		}

		log.Println("alles ok")

		// everything is ok
		c.Next()
	}
}

// Checks that the given request has a valid session
func CheckAuth(c *gin.Context) {

}

func logErrorDetail(tokenError error) {
	if ve, ok := tokenError.(*jwt.ValidationError); ok {
		if ve.Errors&jwt.ValidationErrorMalformed != 0 {
			log.Println("Malformed token")
			return
		}
		if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
			log.Println("Token is expired")
		} else {
			log.Println("Token error ", tokenError)
		}
	} else {
		log.Println("Couldn't handle this token:", tokenError)
	}
}

func (a *Auth) login(c *gin.Context) {
	var input loginData

	err := c.Bind(&input) // This will infer what binder to use depending on the content-type header.
	if CheckErrRest(c, err, 400, "input error") {
		return
	}

	split := strings.SplitN(config.Get().Auth, ":", 2)
	if split == nil || len(split) != 2 {
		log.Println("Configuration error! config.Auth is invalid.")
		SendJsonError(c, 500, "config error")
		return
	}

	validUser := input.User == split[0]

	hash := []byte(split[1])
	err = bcrypt.CompareHashAndPassword(hash, []byte(input.Password))
	validPassword := err == nil

	if !validUser || !validPassword {
		SendJsonError(c, 401, "Invalid credentials")
		return
	}

	session, err := createSession()
	if err != nil {
		log.Println("Error during session creation: ", err)
		SendJsonError(c, 500, "jwt error")
		return
	}

	log.Println("Created session: " + session)

	content := gin.H{
		"result": "Success",
		"session": session,
	}
	c.JSON(201, content)
}

/* helper functions */


func createSession() (string, error) {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Unix() + SESSION_LIFETIME_SEC,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and get the complete encoded token as a string using the secret
	return token.SignedString([]byte(config.Get().SessionSecret))
}

type loginData struct {
	User string `json:"user" binding:"required"`
	Password string `json:"password" binding:"required"`
}