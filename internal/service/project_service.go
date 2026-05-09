package service

import (
	"errors"

	"github.com/iShinzoo/ethara/internal/dto"
	"github.com/iShinzoo/ethara/internal/project"
	"github.com/iShinzoo/ethara/internal/repository"
)

type ProjectService struct {
	ProjectRepo *repository.ProjectRepository
}

func NewProjectService(
	projectRepo *repository.ProjectRepository,
) *ProjectService {

	return &ProjectService{
		ProjectRepo: projectRepo,
	}
}

func (s *ProjectService) CreateProject(
	req dto.CreateProjectRequest,
	userID string,
) error {

	newProject := project.Project{
		Name:        req.Name,
		Description: req.Description,
		CreatedBy:   userID,
	}

	err := s.ProjectRepo.CreateProject(&newProject)

	if err != nil {
		return err
	}

	adminMember := project.ProjectMember{
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

	newMember := project.ProjectMember{
		UserID:    req.UserID,
		ProjectID: projectID,
		Role:      req.Role,
	}

	return s.ProjectRepo.AddProjectMember(&newMember)
}
