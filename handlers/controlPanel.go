package handlers

import (
	"votefor/db"
	"votefor/views"

	"github.com/gofiber/fiber/v2"
)

func ControlPanelAddVf(c *fiber.Ctx) error {
	return c.SendString("Add new VoteFor")
}

func ControlPanelHandler(c *fiber.Ctx) error {
	login, ok := c.Locals("login").(bool)
	if ok {
		vfs := db.GetVfByUserID(1)
		c.Set("Content-Type", "text/html")
		return views.ControlPanel(vfs, login).Render(c.Context(), c.Response().BodyWriter())
	} else {
		return c.Redirect("/")
	}

}
