package models

type Run struct {
    Id int `json:"id"`

    Length int16 `json:"length" binding:"required"`

    Date int64 `json:"date" binding:"required"`

    TimeUsed int64 `json:"timeUsed" binding:"required"`

    Comment string `json:"comment"`

    //CourseId int64 `json:"courseId"`

		Created int64 `json:"tscreated"`

}
