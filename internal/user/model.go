package user

import "time"

type User struct {
	ID           string `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Name         string `gorm:"not null"`
	Email        string `gorm:"unique;not null"`
	PasswordHash string `gorm:"not null"`
	CreatedAt    time.Time
}
