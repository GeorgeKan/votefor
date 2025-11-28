package db

import (
	"fmt"
	"log"
	"votefor/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Db *gorm.DB

func connectToDB() {
	db, err := gorm.Open(sqlite.Open("votefor.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})

	if err != nil {
		log.Fatal("err")
	}

	db.AutoMigrate(&models.User{}, &models.Votefor{}, &models.Choise{}, &models.Answer{})

	Db = db
}

func init() {
	fmt.Println("//////////////// Connect ot db ///////////////")
	connectToDB()
	if false {
		addData(Db)
	}
}
