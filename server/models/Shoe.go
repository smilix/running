package models

type Shoe struct {
	Id int `json:"id"`

	// unix timestamp
	Bought int64 `json:"bought" binding:"required"`

	Comment string `json:"comment"`

	Created int64 `json:"tscreated"`
}

type ShoeUsedView struct {
	Id int `json:"id"`

	// unix timestamp
	Bought int64 `json:"bought"`

	Comment string `json:"comment"`

	Used uint `json:"used"`

	TotalLength uint `json:"totalLength"`
}

const ShoeUsedView_Join string = `
select S.Id, S.Bought, S.Comment, count(R.Id) Used, ifnull(sum(R."Length"), 0) TotalLength  
from Shoes S left join Runs R on S.Id = R.ShoeId
group by S.Id, S.Bought, S.Comment
order by S.Bought desc`

const ShoeUsedView_Join_With_Id string = `
select S.Id, S.Bought, S.Comment, count(R.Id) Used, ifnull(sum(R."Length"), 0) TotalLength  
from Shoes S left join Runs R on S.Id = R.ShoeId
where S.Id = ? 
group by S.Id, S.Bought, S.Comment
order by S.Bought desc`
