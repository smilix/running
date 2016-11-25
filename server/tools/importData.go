package main

import (
	m "smilix/running/server/models"
	"fmt"
	"log"
	"os"
	"encoding/csv"
	"bufio"
	"io"
	"time"
	"strconv"
	"regexp"
)


// 1:43:00
var durationRegex = regexp.MustCompile(`(\d+):(\d+):(\d+)`)

func main() {

	if len(os.Args) < 2 {
		log.Fatal("Missing file")
	}

	path := os.Args[1]

	f, _ := os.Open(path)
	r := csv.NewReader(bufio.NewReader(f))
	r.Comma = '\t'
	firstLine := true
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}

		if firstLine {
			firstLine = false
			continue
		}

		// some entries lack the time
		if len(record[1]) < 5 {
			record[1] = "00:00"
		}
		timeStr := fmt.Sprintf("%s %s", record[0], record[1])
		t, err := time.ParseInLocation("2006-01-02 15:04", timeStr, time.UTC)
		checkErr(err, "Can't parse time string")

		length, err := strconv.ParseFloat(record[4], 32)
		checkErr(err, "Can't parse legnth")
		lengthInMeter := int16(length * 1000)

		runFromCsv := m.Run{
			Created:  time.Now().UTC().Unix(),
			Length: lengthInMeter,
			Comment: record[19],
			Date: t.Unix(),
			TimeUsed: parseDuration(record[6]),
		}
		fmt.Println(runFromCsv)

		err = m.Dbm.Insert(&runFromCsv)
		checkErr(err, "Failed to persist")

		//fmt.Printf("%s, %s, %s, %s\n", timeStr, record[4], record[6], record[19])
	}
}

func parseDuration(value string) int64 {
	matches := durationRegex.FindStringSubmatch(value)

	hours, _ := strconv.ParseInt(matches[1], 10, 64)
	minutes, _ := strconv.ParseInt(matches[2], 10, 64)
	seconds, _ := strconv.ParseInt(matches[3], 10, 64)

	hour := int64(time.Hour)
	minute := int64(time.Minute)
	second := int64(time.Second)
	return time.Duration(hours * hour + minutes * minute + seconds * second).Nanoseconds() / second
}

func checkErr(err error, msg string) {
	if err != nil {
		log.Fatalln(msg, err)
	}
}