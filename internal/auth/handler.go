package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/service"

	"github.com/iShinzoo/ethara/pkg/response"
	customValidator "github.com/iShinzoo/ethara/pkg/validator"
)

type AuthHandler struct {
	AuthService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		AuthService: authService,
	}
}

func (h *AuthHandler) Signup(c *gin.Context) {

	var req dto.SignupRequest

	// Parse JSON
	if err := c.ShouldBindJSON(&req); err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid request body",
		)

		return
	}

	// Validate DTO
	err := customValidator.Validate.Struct(req)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			customValidator.FormatValidationError(err),
		)

		return
	}

	// Business logic
	err = h.AuthService.Signup(req)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusCreated,
		"user created successfully",
		nil,
	)
}

func (h *AuthHandler) Login(c *gin.Context) {

	var req dto.LoginRequest

	// Parse JSON
	if err := c.ShouldBindJSON(&req); err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			"invalid request body",
		)

		return
	}

	// Validate DTO
	err := customValidator.Validate.Struct(req)

	if err != nil {

		response.Error(
			c,
			http.StatusBadRequest,
			customValidator.FormatValidationError(err),
		)

		return
	}

	// Login logic
	token, err := h.AuthService.Login(req)

	if err != nil {

		response.Error(
			c,
			http.StatusUnauthorized,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		"login successful",
		gin.H{
			"token": token,
		},
	)
}
