package main

import (
	"log"

	"github.com/iShinzoo/ethara/internal/database"
	"github.com/iShinzoo/ethara/pkg/config"
)

func main() {

	cfg := config.LoadConfig()

	db := database.ConnectDB(cfg)

	log.Println("Application started successfully")

	_ = db
}
