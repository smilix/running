package models

type Run struct {
	Id int `json:"id"`
	// in meter
	Length int16 `json:"length" binding:"required"`

	// unix timestamp
	Date int64 `json:"date" binding:"required"`
	// in seconds
	TimeUsed int64 `json:"timeUsed" binding:"required"`

	Comment string `json:"comment"`

	Created int64 `json:"tscreated"`

	ShoeId int `json:"shoeId" binding:"required"`
}
