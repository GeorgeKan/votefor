package db

import (
	"votefor/hash"
	"votefor/models"

	"github.com/gofiber/fiber/v2/utils"
	"gorm.io/gorm"
)

func addData(db *gorm.DB) {
	pass, err := hash.HashPassword("gkan123")
	if err != nil {
		panic(err)
	}
	db.Create(&models.User{
		Name:     "George Kanellos",
		Email:    "gkan@uniwa.gr",
		Password: pass,
		Uuid:     utils.UUIDv4(),
		Votefor: []models.Votefor{
			{Title: "How Easy is to learn Golang",
				Description: "Is Realy Easy to learn Golang as developer",
				Url:         "golangeasy",
				Choise: []models.Choise{
					{
						Question:      "Time to learn golang",
						Type:          models.Single,
						QestionNumber: 1,
						Answer: []models.Answer{
							{Text: "1 Week"}, {Text: "2 Months"}, {Text: "More than 6 Months"},
						},
					},
					{
						Question:      "Difficulties in Learning Go",
						Type:          models.Multiple,
						QestionNumber: 2,
						Answer: []models.Answer{
							{Text: "No good Resources"}, {Text: "Lack of good Courses"}, {Text: "No many books"},
						},
					},
				}},
			{Title: "Best Css FrameWork",
				Description: "Is Bootstrap or tailwind css framework thw Best",
				Url:         "cssframework",
				Choise: []models.Choise{
					{
						Question:      "Best Fitures in css Framework",
						Type:          models.Single,
						QestionNumber: 1,
						Answer: []models.Answer{
							{Text: "Bootstrap Css"}, {Text: "Bulma Css"}, {Text: "Tailwind Css"},
						},
					},
					{
						Question:      "More is to Learn is",
						Type:          models.Multiple,
						QestionNumber: 2,
						Answer: []models.Answer{
							{Text: "Css classes"}, {Text: "Short Css classes"}, {Text: "Pure Css commands"},
						},
					},
				}},
		}})

}
