package routes

import (
	"votefor/handlers"
	"votefor/middleware"

	"github.com/gofiber/fiber/v2"
)

func ControlPanelRoute(router fiber.Router) {
	router.Get("/", middleware.AuthMiddleware, handlers.ControlPanelHandler)
	router.Get("/addNew", middleware.AuthMiddleware, handlers.ControlPanelAddVf)
}

func AuthRoute(router fiber.Router) {
	router.Get("/login", handlers.AuthLoginHandler)
	router.Post("/login", handlers.AuthLoginPostHandler)
	router.Get("/logout", handlers.AuthLogoutHandler)
	router.Get("/register", handlers.AuthRegister)
	router.Post("/register", handlers.AuthRegisterPostHandler)
}

func RootRoute(router fiber.Router) {
	router.Get("/", handlers.RootHandler)
}
