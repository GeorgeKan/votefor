package main

import (
	"votefor/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "VoteFor",
	})

	routes.RootRoute(app.Group("/"))
	routes.AuthRoute(app.Group("/auth"))
	routes.ControlPanelRoute(app.Group("/cp"))

	app.Listen(":3000")
}
