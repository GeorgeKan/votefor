package handlers

import (
	"time"
	"votefor/auth"
	"votefor/db"
	"votefor/models"
	"votefor/views"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)

func AuthRegisterPostHandler(c *fiber.Ctx) error {
	validate := validator.New()
	msg := views.Message{}
	validf := views.ValidForm{}
	c.Set("Content-Type", "text/html")
	var user models.User
	user.Name = c.FormValue("name")
	user.Email = c.FormValue("email")
	user.Password = c.FormValue("passwd")
	passwd2 := c.FormValue("passwd2")
	verrName := validate.Var(user.Name, "required,min=5,max=30")
	verrEmail := validate.Var(user.Email, "required,email")
	verrPassLevel := validate.Var(user.Password, "required,min=5")
	verrPasswd := validate.VarWithValue(user.Password, passwd2, "eqfield")

	if verrName != nil {
		msg.MsgText = "Name is too Short"
		msg.MsgType = "alert-danger"
		validf.Vname = true
	} else if verrEmail != nil {
		msg.MsgText = "Not valid email address"
		msg.MsgType = "alert-danger"
		validf.Vemail = true
	} else if db.FindUserByEmail(user.Email) {
		msg.MsgText = "Email is already Registered"
		msg.MsgType = "alert-danger"
		validf.Vemail = true
	} else if verrPassLevel != nil {
		msg.MsgText = "Password is not too strong"
		msg.MsgType = "alert-danger"
		validf.Vpasswd = true
	} else if verrPasswd != nil {
		msg.MsgText = "Password do not match"
		msg.MsgType = "alert-danger"
		validf.Vpasswd = true
	} else {
		user.Uuid = utils.UUIDv4()
		if db.RegisterUser(user) {
			msg.MsgText = "Register Succesfully."
			msg.MsgType = "alert-success"
			msg.LinkText = "Login"
			msg.LinkUrl = "/auth/login"
		} else {
			msg.MsgText = "Registration Failed."
			msg.MsgType = "alert-danger"
			msg.LinkText = "Try to Register again"
			msg.LinkUrl = "/auth/register"
		}
	}
	return views.Register(msg, user, validf, auth.AuthCheckCookie(c)).Render(c.Context(), c.Response().BodyWriter())
}

func AuthRegister(c *fiber.Ctx) error {
	msg := views.Message{}
	user := models.User{}
	isLogin := auth.AuthCheckCookie(c)
	if isLogin {
		msg.MsgText = "You are already login."
		msg.MsgType = "alert-danger"
		msg.LinkText = "Go to Control Panel"
		msg.LinkUrl = "/cp"
	}
	c.Set("Content-Type", "text/html")
	return views.Register(msg, user, views.ValidForm{}, isLogin).Render(c.Context(), c.Response().BodyWriter())
}

func AuthLoginPostHandler(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html")
	msg := views.Message{}
	email := c.FormValue("email", "err")
	passwd := c.FormValue("passwd", "err")
	user, isLogin := db.CheckLoginUser(email, passwd)
	if !isLogin {
		msg.MsgText = "Wrong email or Password. Try again."
		msg.MsgType = "alert-danger"
		return views.LoginForm(msg, isLogin).Render(c.Context(), c.Response().BodyWriter())
	} else {
		token := utils.UUIDv4()
		db.UpdateUuidCookie(user, token)
		auth.GenerateCookie(c, token, user.Name)
		msg.MsgText = "Login Successfuly."
		msg.MsgType = "alert-success"
		msg.LinkText = "Go to Control Panel"
		msg.LinkUrl = "/cp"
		return views.LoginForm(msg, isLogin).Render(c.Context(), c.Response().BodyWriter())
	}
}

func AuthLoginHandler(c *fiber.Ctx) error {
	isLogin := auth.AuthCheckCookie(c)
	msg := views.Message{}
	if isLogin {
		msg.MsgText = "You are already login"
		msg.MsgType = "alert-success"
		msg.LinkText = "Go to Control Panel"
		msg.LinkUrl = "/cp"
	}
	c.Set("Content-Type", "text/html")
	return views.LoginForm(msg, isLogin).Render(c.Context(), c.Response().BodyWriter())
}

func AuthLogoutHandler(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:    "auth",
		Value:   "",
		Expires: time.Now().Add(-3 * time.Hour),
	})
	return c.Redirect("/")
}
