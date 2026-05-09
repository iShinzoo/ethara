package task

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/service"
)

type TaskHandler struct {
	TaskService *service.TaskService
}

func NewTaskHandler(
	taskService *service.TaskService,
) *TaskHandler {

	return &TaskHandler{
		TaskService: taskService,
	}
}

func (h *TaskHandler) CreateTask(c *gin.Context) {

	var req dto.CreateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})
		return
	}

	userID := c.MustGet("user_id").(string)

	err := h.TaskService.CreateTask(req, userID)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "task created successfully",
	})
}

func (h *TaskHandler) UpdateTask(c *gin.Context) {

	var req dto.UpdateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request",
		})
		return
	}

	taskID := c.Param("id")

	userID := c.MustGet("user_id").(string)

	err := h.TaskService.UpdateTask(
		taskID,
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
		"message": "task updated successfully",
	})
}

func (h *TaskHandler) DeleteTask(c *gin.Context) {

	taskID := c.Param("id")

	userID := c.MustGet("user_id").(string)

	err := h.TaskService.DeleteTask(
		taskID,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "task deleted successfully",
	})
}

func (h *TaskHandler) GetTasks(c *gin.Context) {

	userID := c.MustGet("user_id").(string)

	filters := map[string]interface{}{}

	if projectID := c.Query("project_id"); projectID != "" {
		filters["project_id"] = projectID
	}

	if status := c.Query("status"); status != "" {
		filters["status"] = status
	}

	if assignee := c.Query("assigned_to"); assignee != "" {
		filters["assigned_to"] = assignee
	}

	tasks, err := h.TaskService.GetTasks(
		userID,
		filters,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, tasks)
}
