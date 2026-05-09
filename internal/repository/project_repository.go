package repository

import (
	"github.com/iShinzoo/ethara/internal/project"
	"gorm.io/gorm"
)

type ProjectRepository struct {
	DB *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{
		DB: db,
	}
}

func (r *ProjectRepository) CreateProject(project *project.Project) error {
	return r.DB.Create(project).Error
}

func (r *ProjectRepository) AddProjectMember(member *project.ProjectMember) error {
	return r.DB.Create(member).Error
}

func (r *ProjectRepository) GetProjectMember(
	userID string,
	projectID string,
) (*project.ProjectMember, error) {

	var member project.ProjectMember

	err := r.DB.
		Where("user_id = ? AND project_id = ?", userID, projectID).
		First(&member).Error

	if err != nil {
		return nil, err
	}

	return &member, nil
}