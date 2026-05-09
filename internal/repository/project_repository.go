package repository

import (
	"github.com/iShinzoo/ethara/internal/model"
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

func (r *ProjectRepository) CreateProject(project *model.Project) error {
	return r.DB.Create(project).Error
}

func (r *ProjectRepository) AddProjectMember(member *model.ProjectMember) error {
	return r.DB.Create(member).Error
}

func (r *ProjectRepository) GetProjectMember(
	userID string,
	projectID string,
) (*model.ProjectMember, error) {

	var member model.ProjectMember

	err := r.DB.
		Where("user_id = ? AND project_id = ?", userID, projectID).
		First(&member).Error

	if err != nil {
		return nil, err
	}

	return &member, nil
}

func (r *ProjectRepository) GetProjectsByUserID(userID string) ([]model.Project, error) {

	var projects []model.Project

	err := r.DB.
		Table("projects").
		Select("projects.*").
		Joins("JOIN project_members pm ON pm.project_id = projects.id").
		Where("pm.user_id = ?", userID).
		Find(&projects).Error

	if err != nil {
		return nil, err
	}

	return projects, nil
}
