package service

import (
	"errors"
	"time"

	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/model"
	"github.com/iShinzoo/ethara/internal/repository"
)

type TaskService struct {
	TaskRepo    *repository.TaskRepository
	ProjectRepo *repository.ProjectRepository
}

func NewTaskService(
	taskRepo *repository.TaskRepository,
	projectRepo *repository.ProjectRepository,
) *TaskService {

	return &TaskService{
		TaskRepo:    taskRepo,
		ProjectRepo: projectRepo,
	}
}

func (s *TaskService) CreateTask(
	req dto.CreateTaskRequest,
	userID string,
) error {

	_, err := s.ProjectRepo.GetProjectMember(
		userID,
		req.ProjectID,
	)

	if err != nil {
		return errors.New("not a project member")
	}

	var dueDate *time.Time

	if req.DueDate != nil {

		parsedTime, err := time.Parse(
			time.RFC3339,
			*req.DueDate,
		)

		if err == nil {
			dueDate = &parsedTime
		}
	}

	newTask := model.Task{
		Title:       req.Title,
		Description: req.Description,
		Status:      "TODO",
		ProjectID:   req.ProjectID,
		AssignedTo:  req.AssignedTo,
		CreatedBy:   userID,
		DueDate:     dueDate,
	}

	return s.TaskRepo.CreateTask(&newTask)
}

func (s *TaskService) UpdateTask(
	taskID string,
	req dto.UpdateTaskRequest,
	userID string,
) error {

	existingTask, err := s.TaskRepo.GetTaskByID(taskID)

	if err != nil {
		return errors.New("task not found")
	}

	_, err = s.ProjectRepo.GetProjectMember(
		userID,
		existingTask.ProjectID,
	)

	if err != nil {
		return errors.New("not authorized")
	}

	if req.Title != nil {
		existingTask.Title = *req.Title
	}

	if req.Description != nil {
		existingTask.Description = *req.Description
	}

	if req.Status != nil {
		existingTask.Status = *req.Status
	}

	if req.AssignedTo != nil {
		existingTask.AssignedTo = req.AssignedTo
	}

	return s.TaskRepo.UpdateTask(existingTask)
}

func (s *TaskService) DeleteTask(
	taskID string,
	userID string,
) error {

	existingTask, err := s.TaskRepo.GetTaskByID(taskID)

	if err != nil {
		return errors.New("task not found")
	}

	member, err := s.ProjectRepo.GetProjectMember(
		userID,
		existingTask.ProjectID,
	)

	if err != nil {
		return errors.New("not authorized")
	}

	if member.Role != "ADMIN" {
		return errors.New("only admins can delete tasks")
	}

	return s.TaskRepo.DeleteTask(taskID)
}

func (s *TaskService) GetTasks(
	userID string,
	filters map[string]interface{},
) ([]model.Task, error) {

	return s.TaskRepo.GetTasks(filters)
}
