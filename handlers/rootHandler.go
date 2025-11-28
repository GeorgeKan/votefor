package handlers

import (
	"votefor/auth"
	"votefor/views"

	"github.com/gofiber/fiber/v2"
)

func RootHandler(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	return views.RootMain(auth.AuthCheckCookie(c)).Render(c.Context(), c.Response().BodyWriter())
}
