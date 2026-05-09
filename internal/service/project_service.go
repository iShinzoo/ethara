package service

import (
	"errors"

	"github.com/google/uuid"
	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/model"
	"github.com/iShinzoo/ethara/internal/repository"
)

type ProjectService struct {
	ProjectRepo *repository.ProjectRepository
	UserRepo    *repository.UserRepository
}

func NewProjectService(
	projectRepo *repository.ProjectRepository,
	userRepo *repository.UserRepository,
) *ProjectService {

	return &ProjectService{
		ProjectRepo: projectRepo,
		UserRepo:    userRepo,
	}
}

func (s *ProjectService) CreateProject(
	req dto.CreateProjectRequest,
	userID string,
) error {

	newProject := model.Project{
		ID:          uuid.New().String(),
		Name:        req.Name,
		Description: req.Description,
		CreatedBy:   userID,
	}

	err := s.ProjectRepo.CreateProject(&newProject)

	if err != nil {
		return err
	}

	adminMember := model.ProjectMember{
		ID:        uuid.New().String(),
		UserID:    userID,
		ProjectID: newProject.ID,
		Role:      "ADMIN",
	}

	return s.ProjectRepo.AddProjectMember(&adminMember)
}

func (s *ProjectService) AddMember(
	projectID string,
	req dto.AddMemberRequest,
	requestUserID string,
) error {

	member, err := s.ProjectRepo.GetProjectMember(
		requestUserID,
		projectID,
	)

	if err != nil {
		return errors.New("not a project member")
	}

	if member.Role != "ADMIN" {
		return errors.New("only admins can add members")
	}
	// Find user by email
	user, err := s.UserRepo.GetUserByEmail(req.Email)

	if err != nil {
		return errors.New("user not found")
	}

	newMember := model.ProjectMember{
		ID:        uuid.New().String(),
		UserID:    user.ID,
		ProjectID: projectID,
		Role:      req.Role,
	}

	return s.ProjectRepo.AddProjectMember(&newMember)
}

func (s *ProjectService) GetProjects(userID string) ([]model.Project, error) {

	return s.ProjectRepo.GetProjectsByUserID(userID)
}
