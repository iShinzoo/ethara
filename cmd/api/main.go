package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/auth"
	"github.com/iShinzoo/ethara/internal/dashboard"
	"github.com/iShinzoo/ethara/internal/database"
	"github.com/iShinzoo/ethara/internal/middleware"
	"github.com/iShinzoo/ethara/internal/project"
	"github.com/iShinzoo/ethara/internal/repository"
	"github.com/iShinzoo/ethara/internal/service"
	"github.com/iShinzoo/ethara/internal/task"
	"github.com/iShinzoo/ethara/pkg/config"
)

func main() {

	// Load application configuration
	cfg := config.LoadConfig()

	// Connect database
	db := database.ConnectDB(cfg)

	// Initialize Gin router
	router := gin.Default()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	dashboardRepo := repository.NewDashboardRepository(db)

	// Initialize services
	authService := service.NewAuthService(
		userRepo,
		cfg,
	)

	projectService := service.NewProjectService(
		projectRepo,
	)

	taskService := service.NewTaskService(
		taskRepo,
		projectRepo,
	)

	dashboardService := service.NewDashboardService(
		dashboardRepo,
	)

	// Initialize handlers
	authHandler := auth.NewAuthHandler(authService)

	projectHandler := project.NewProjectHandler(
		projectService,
	)

	taskHandler := task.NewTaskHandler(
		taskService,
	)

	dashboardHandler := dashboard.NewDashboardHandler(
		dashboardService,
	)

	// Public routes
	router.POST("/signup", authHandler.Signup)
	router.POST("/login", authHandler.Login)

	// Protected routes
	protected := router.Group("/api")

	protected.Use(middleware.AuthMiddleware(cfg))

	protected.GET("/me", func(c *gin.Context) {

		userID, _ := c.Get("user_id")

		email, _ := c.Get("email")

		c.JSON(http.StatusOK, gin.H{
			"user_id": userID,
			"email":   email,
		})
	})

	// Project routes
	protected.POST(
		"/projects",
		projectHandler.CreateProject,
	)

	protected.POST(
		"/projects/:id/members",
		projectHandler.AddMember,
	)

	// Task routes
	protected.POST(
		"/tasks",
		taskHandler.CreateTask,
	)

	protected.GET(
		"/tasks",
		taskHandler.GetTasks,
	)

	protected.PATCH(
		"/tasks/:id",
		taskHandler.UpdateTask,
	)

	protected.DELETE(
		"/tasks/:id",
		taskHandler.DeleteTask,
	)

	// Dashboard route
	protected.GET(
		"/dashboard",
		dashboardHandler.GetDashboard,
	)

	// Create HTTP server
	server := &http.Server{
		Addr:    ":" + cfg.AppPort,
		Handler: router,
	}

	// Run server in goroutine
	go func() {

		log.Println("Server running on port", cfg.AppPort)

		if err := server.ListenAndServe(); err != nil &&
			err != http.ErrServerClosed {

			log.Fatal("Server failed:", err)
		}
	}()

	// Graceful shutdown channel
	quit := make(chan os.Signal, 1)

	signal.Notify(
		quit,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	// Wait for shutdown signal
	<-quit

	log.Println("Shutting down server...")

	// Shutdown timeout context
	ctx, cancel := context.WithTimeout(
		context.Background(),
		5*time.Second,
	)

	defer cancel()

	// Shutdown server gracefully
	if err := server.Shutdown(ctx); err != nil {

		log.Fatal("Forced to shutdown:", err)
	}

	log.Println("Server exited gracefully")
}
