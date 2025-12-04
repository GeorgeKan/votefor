package db

import (
	"fmt"
	"log"
	"os"
	"votefor/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Db *gorm.DB

func connectToDB() {
	// db, err := gorm.Open(sqlite.Open("votefor.db"), &gorm.Config{
	// 	Logger: logger.Default.LogMode(logger.Silent),
	// })
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dns := os.Getenv("DB_USER") + ":" + os.Getenv("DB_PASS") + "@tcp(" + os.Getenv("DB_IP") + ":3306)/votefor?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dns), &gorm.Config{
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
