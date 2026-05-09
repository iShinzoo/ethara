package model

import "time"

type Project struct {
	ID          string `gorm:"type:uuid;primaryKey"`
	Name        string `gorm:"not null"`
	Description string
	CreatedBy   string `gorm:"type:uuid"`
	CreatedAt   time.Time
}

type ProjectMember struct {
	ID        string `gorm:"type:uuid;primaryKey"`
	UserID    string `gorm:"type:uuid"`
	ProjectID string `gorm:"type:uuid"`
	Role      string
	JoinedAt  time.Time
}
