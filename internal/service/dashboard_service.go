package service

import (
	"github.com/iShinzoo/ethara/internal/dashboard"
	"github.com/iShinzoo/ethara/internal/repository"
)

type DashboardService struct {
	DashboardRepo *repository.DashboardRepository
}

func NewDashboardService(
	dashboardRepo *repository.DashboardRepository,
) *DashboardService {

	return &DashboardService{
		DashboardRepo: dashboardRepo,
	}
}

func (s *DashboardService) GetDashboardData(
	userID string,
) (*dashboard.DashboardResponse, error) {

	totalTasks, err := s.DashboardRepo.CountTotalTasks(userID)

	if err != nil {
		return nil, err
	}

	completedTasks, err := s.DashboardRepo.CountCompletedTasks(userID)

	if err != nil {
		return nil, err
	}

	overdueTasks, err := s.DashboardRepo.CountOverdueTasks(userID)

	if err != nil {
		return nil, err
	}

	assignedTasks, err := s.DashboardRepo.CountAssignedTasks(userID)

	if err != nil {
		return nil, err
	}

	projectProgress, err := s.DashboardRepo.GetProjectProgress(userID)

	if err != nil {
		return nil, err
	}

	response := dashboard.DashboardResponse{
		TotalTasks:      totalTasks,
		CompletedTasks:  completedTasks,
		OverdueTasks:    overdueTasks,
		AssignedToMe:    assignedTasks,
		ProjectProgress: projectProgress,
	}

	return &response, nil
}
