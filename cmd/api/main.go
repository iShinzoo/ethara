package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/auth"
	"github.com/iShinzoo/ethara/internal/database"
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

	log.Println("Server running on port", cfg.AppPort)

	router.Run(":" + cfg.AppPort)
}
