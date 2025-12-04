package db

import (
	"errors"
	"votefor/hash"
	"votefor/models"

	"gorm.io/gorm"
)

func RegisterUser(user models.User) bool {
	user.Password, _ = hash.HashPassword(user.Password)
	res := Db.Create(&user)
	return res.Error == nil
}

func FindUserByEmail(email string) bool {
	var user models.User
	res := Db.Where("email = ?", email).First(&user)
	return !errors.Is(res.Error, gorm.ErrRecordNotFound)
}

func UpdateUuidCookie(user models.User, token string) {
	Db.Model(&user).Update("uuid", token)
}

func CheckLoginUser(email, password string) (models.User, bool) {
	var user models.User
	res := Db.Where("email = ?", email).First(&user)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return models.User{}, false
	} else {
		if hash.VerifyHashPassword(user.Password, password) {
			return user, true
		} else {
			return models.User{}, false
		}
	}
}

func FindUserByToken(token string) bool {
	var user models.User
	res := Db.Where("uuid = ?", token).First(&user)
	return !errors.Is(res.Error, gorm.ErrRecordNotFound)
}
