package models

import "gorm.io/gorm"

type Qtype int

const (
	Sort Qtype = iota
	Single
	Multiple
	DropDown
	Linear
	Rating
	DateTime
)

type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
	Uuid     string
	Votefor  []Votefor
}

type Votefor struct {
	gorm.Model
	Title       string
	Description string
	Url         string
	UserID      uint
	User        User
	Choise      []Choise
}

type Choise struct {
	gorm.Model
	Question      string
	Type          Qtype
	QestionNumber uint
	Answer        []Answer
	VoteforID     uint
	Votefor       Votefor
}

type Answer struct {
	gorm.Model
	Text     string
	ChoiseID uint
	Choise   Choise
}
