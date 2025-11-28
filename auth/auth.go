package auth

import (
	"time"
	"votefor/db"

	"github.com/gofiber/fiber/v2"
)

func GenerateCookie(c *fiber.Ctx, token string, name string) {
	authCookie := new(fiber.Cookie)
	authCookie.Name = "auth"
	authCookie.Value = token
	authCookie.Expires = time.Now().Add(time.Minute * 60)
	c.Cookie(authCookie)
	usernameCookie := new(fiber.Cookie)
	usernameCookie.Name = "username"
	usernameCookie.Value = name
	usernameCookie.Expires = time.Now().Add(time.Hour * 24)
	c.Cookie(usernameCookie)
}

func CookieGetUsername(c *fiber.Ctx) string {
	return c.Cookies("username", "")

}

func AuthCheckCookie(c *fiber.Ctx) bool {
	token := c.Cookies("auth", "notSet")
	if token == "notSet" {
		return false
	} else {
		isok := db.FindUserByToken(token)
		return isok
	}
}
