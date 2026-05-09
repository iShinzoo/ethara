package model

import "time"

type Task struct {
	ID          string `gorm:"type:uuid;primaryKey"`
	Title       string `gorm:"not null"`
	Description string
	Status      string
	ProjectID   string  `gorm:"type:uuid"`
	AssignedTo  *string `gorm:"type:uuid"`
	CreatedBy   string  `gorm:"type:uuid"`
	DueDate     *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
