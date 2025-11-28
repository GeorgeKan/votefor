package db

import (
	"votefor/models"
)

func GetVfByUserID(userID uint) []models.Votefor {
	var votefors []models.Votefor
	Db.Where("user_id == ?", userID).Find(&votefors)
	return votefors

}
