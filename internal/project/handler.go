package project

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/service"
	"github.com/iShinzoo/ethara/pkg/response"
)

type ProjectHandler struct {
	ProjectService *service.ProjectService
}

func NewProjectHandler(
	projectService *service.ProjectService,
) *ProjectHandler {

	return &ProjectHandler{
		ProjectService: projectService,
	}
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {

	var req dto.CreateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})
		return
	}

	userID := c.MustGet("user_id").(string)

	err := h.ProjectService.CreateProject(req, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "project created successfully",
	})
}

func (h *ProjectHandler) AddMember(c *gin.Context) {

	var req dto.AddMemberRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})
		return
	}

	projectID := c.Param("id")

	userID := c.MustGet("user_id").(string)

	err := h.ProjectService.AddMember(
		projectID,
		req,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "member added successfully",
	})
}

func (h *ProjectHandler) GetProjects(c *gin.Context) {

	userID, exists := c.Get("user_id")

	if !exists {

		response.Error(
			c,
			http.StatusUnauthorized,
			"user not found",
		)

		return
	}

	projects, err := h.ProjectService.GetProjects(
		userID.(string),
	)

	if err != nil {

		response.Error(
			c,
			http.StatusInternalServerError,
			err.Error(),
		)

		return
	}

	response.Success(
		c,
		http.StatusOK,
		"projects fetched successfully",
		projects,
	)
}
