package dashboard

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iShinzoo/ethara/internal/service"
)

type DashboardHandler struct {
	DashboardService *service.DashboardService
}

func NewDashboardHandler(
	dashboardService *service.DashboardService,
) *DashboardHandler {

	return &DashboardHandler{
		DashboardService: dashboardService,
	}
}

func (h *DashboardHandler) GetDashboard(c *gin.Context) {

	userID := c.MustGet("user_id").(string)

	data, err := h.DashboardService.GetDashboardData(userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, data)
}