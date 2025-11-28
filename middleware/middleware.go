package middleware

import (
	"votefor/auth"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
	login := auth.AuthCheckCookie(c)
	if !login {
		return c.Redirect("/")
	} else {
		c.Locals("login", true)
		return c.Next()
	}
}
