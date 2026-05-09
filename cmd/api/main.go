package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/auth"
	"github.com/iShinzoo/ethara/internal/database"
	"github.com/iShinzoo/ethara/internal/middleware"
	"github.com/iShinzoo/ethara/internal/project"
	"github.com/iShinzoo/ethara/internal/repository"
	"github.com/iShinzoo/ethara/internal/service"
	"github.com/iShinzoo/ethara/internal/task"
	"github.com/iShinzoo/ethara/pkg/config"
)

func main() {

	cfg := config.LoadConfig()

	db := database.ConnectDB(cfg)

	router := gin.Default()

	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)

	authService := service.NewAuthService(
		userRepo,
		cfg,
	)
	projectService := service.NewProjectService(projectRepo)
	taskService := service.NewTaskService(
		taskRepo,
		projectRepo,
	)

	authHandler := auth.NewAuthHandler(authService)
	projectHandler := project.NewProjectHandler(projectService)
	taskHandler := task.NewTaskHandler(taskService)

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

	protected.POST("/projects", projectHandler.CreateProject)

	protected.POST(
		"/projects/:id/members",
		projectHandler.AddMember,
	)

	protected.POST("/tasks", taskHandler.CreateTask)

	protected.GET("/tasks", taskHandler.GetTasks)

	protected.PATCH("/tasks/:id", taskHandler.UpdateTask)

	protected.DELETE("/tasks/:id", taskHandler.DeleteTask)

	log.Println("Server running on port", cfg.AppPort)

	router.Run(":" + cfg.AppPort)
}
