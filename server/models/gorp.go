package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"reflect"
	"time"
	"gopkg.in/gorp.v1"
	_ "github.com/mattn/go-sqlite3"
	"os"
	"github.com/smilix/running/server/config"
	"github.com/gin-gonic/gin"
	"github.com/smilix/running/server/common"
)

const (
	dbFormat = "2006-01-02 15:04:05"
	jsonFormat = "2006-01-02"
)

var (
	Dbm *gorp.DbMap
)

type JDate time.Time
type CustomTypeConverter struct{}

func init() {
	common.LOG().Println("Opening db: ", config.Get().DbFile)
	db, err := sql.Open("sqlite3", config.Get().DbFile)
	checkErr(err, "opening db failed")
	Dbm = &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
	//Dbm.TypeConverter = CustomTypeConverter{}

	if gin.IsDebugging() {
		// Will log all SQL statements + args as they are run
		// The first arg is a string prefix to prepend to all log messages
		Dbm.TraceOn("[gorp]", log.New(os.Stdout, "myapp:", log.Lmicroseconds))
	}

	Dbm.AddTableWithName(Run{}, "Runs").SetKeys(true, "Id")
	Dbm.AddTableWithName(Shoe{}, "Shoes").SetKeys(true, "Id")


	//Dbm.TraceOn("[gorp]", r.INFO)
	err = Dbm.CreateTablesIfNotExists()
	checkErr(err, "create tables failed")
}

func (d JDate) MarshalJSON() ([]byte, error) {
	return json.Marshal((*time.Time)(&d).Format(jsonFormat))
}

func (d *JDate) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	t, err := time.Parse(jsonFormat, s)
	if err != nil {
		return err
	}
	*d = JDate(t)
	return nil
}

func (me CustomTypeConverter) ToDb(val interface{}) (interface{}, error) {
	switch t := val.(type) {
	case JDate:
		return time.Time(t), nil
	}
	return val, nil
}

func (me CustomTypeConverter) FromDb(target interface{}) (gorp.CustomScanner, bool) {
	switch target.(type) {
	case *JDate:
		binder := func(holder, target interface{}) error {
			// time.Time is returned from db as string
			s, ok := holder.(*string)
			if !ok {
				return errors.New("FromDb: Unable to convert JDate to *string")
			}
			st, ok := target.(*JDate)
			if !ok {
				return errors.New(fmt.Sprint("FromDb: Unable to convert target to *JDate: ", reflect.TypeOf(target)))
			}
			t, _ := time.Parse(dbFormat, *s)
			*st = JDate(t)
			return nil
		}
		return gorp.CustomScanner{new(string), target, binder}, true
	}
	return gorp.CustomScanner{}, false
}

func checkErr(err error, msg string) {
	if err != nil {
		common.LOG().Fatalln(msg, err)
	}
}
