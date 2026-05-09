package repository

import (
	"github.com/iShinzoo/ethara/internal/user"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *user.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) GetUserByEmail(email string) (*user.User, error) {

	var user user.User

	err := r.DB.Where("email = ?", email).First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}
