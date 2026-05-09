package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/auth"
	"github.com/iShinzoo/ethara/internal/database"
	"github.com/iShinzoo/ethara/internal/middleware"
	"github.com/iShinzoo/ethara/internal/repository"
	"github.com/iShinzoo/ethara/internal/service"
	"github.com/iShinzoo/ethara/pkg/config"
)

func main() {

	cfg := config.LoadConfig()

	db := database.ConnectDB(cfg)

	router := gin.Default()

	userRepo := repository.NewUserRepository(db)

	authService := service.NewAuthService(
		userRepo,
		cfg,
	)

	authHandler := auth.NewAuthHandler(authService)

	router.POST("/signup", authHandler.Signup)
	router.POST("/login", authHandler.Login)

	protected := router.Group("/api")

	protected.Use(middleware.AuthMiddleware(cfg))

	protected.GET("/me", func(c *gin.Context) {

		userID, _ := c.Get("user_id")

		email, _ := c.Get("email")

		c.JSON(200, gin.H{
			"user_id": userID,
			"email":   email,
		})
	})

	log.Println("Server running on port", cfg.AppPort)

	router.Run(":" + cfg.AppPort)
}
