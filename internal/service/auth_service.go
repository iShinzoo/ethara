package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/iShinzoo/ethara/internal/auth"
	"github.com/iShinzoo/ethara/internal/repository"
	"github.com/iShinzoo/ethara/internal/user"
	"github.com/iShinzoo/ethara/pkg/config"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserRepo *repository.UserRepository
	Config   *config.Config
}

func NewAuthService(
	userRepo *repository.UserRepository,
	cfg *config.Config,
) *AuthService {
	return &AuthService{
		UserRepo: userRepo,
		Config:   cfg,
	}
}

func (s *AuthService) Signup(req auth.SignupRequest) error {

	_, err := s.UserRepo.GetUserByEmail(req.Email)

	if err == nil {
		return errors.New("email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	user := user.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
	}

	return s.UserRepo.CreateUser(&user)
}

func (s *AuthService) Login(req auth.LoginRequest) (string, error) {

	user, err := s.UserRepo.GetUserByEmail(req.Email)

	if err != nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(req.Password),
	)

	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(
		[]byte(s.Config.JWTSecret),
	)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
