package model

import "time"

type User struct {
	ID           string `gorm:"type:uuid;primaryKey"`
	Name         string `gorm:"not null"`
	Email        string `gorm:"unique;not null"`
	PasswordHash string `gorm:"not null"`
	CreatedAt    time.Time
}
