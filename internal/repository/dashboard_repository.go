package repository

import (
	"time"

	"github.com/iShinzoo/ethara/internal/dashboard"
	"gorm.io/gorm"
)

type DashboardRepository struct {
	DB *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) *DashboardRepository {
	return &DashboardRepository{
		DB: db,
	}
}

func (r *DashboardRepository) CountTotalTasks(userID string) (int64, error) {

	var count int64

	err := r.DB.
		Table("tasks").
		Joins("JOIN project_members pm ON pm.project_id = tasks.project_id").
		Where("pm.user_id = ?", userID).
		Count(&count).Error

	return count, err
}

func (r *DashboardRepository) CountCompletedTasks(userID string) (int64, error) {

	var count int64

	err := r.DB.
		Table("tasks").
		Joins("JOIN project_members pm ON pm.project_id = tasks.project_id").
		Where("pm.user_id = ?", userID).
		Where("tasks.status = ?", "DONE").
		Count(&count).Error

	return count, err
}

func (r *DashboardRepository) CountOverdueTasks(userID string) (int64, error) {

	var count int64

	err := r.DB.
		Table("tasks").
		Joins("JOIN project_members pm ON pm.project_id = tasks.project_id").
		Where("pm.user_id = ?", userID).
		Where("tasks.due_date < ?", time.Now()).
		Where("tasks.status != ?", "DONE").
		Count(&count).Error

	return count, err
}

func (r *DashboardRepository) CountAssignedTasks(userID string) (int64, error) {

	var count int64

	err := r.DB.
		Table("tasks").
		Where("assigned_to = ?", userID).
		Count(&count).Error

	return count, err
}

func (r *DashboardRepository) GetProjectProgress(
	userID string,
) ([]dashboard.ProjectProgressSummary, error) {

	var result []dashboard.ProjectProgressSummary

	query := `
	SELECT
		p.id as project_id,
		p.name as project_name,

		COUNT(t.id) as total_tasks,

		COUNT(
			CASE
				WHEN t.status = 'DONE'
				THEN 1
			END
		) as completed_tasks,

		COALESCE(
			(
				COUNT(
					CASE
						WHEN t.status = 'DONE'
						THEN 1
					END
				)::float
				/
				NULLIF(COUNT(t.id), 0)
			) * 100,
			0
		) as progress

	FROM projects p

	JOIN project_members pm
		ON pm.project_id = p.id

	LEFT JOIN tasks t
		ON t.project_id = p.id

	WHERE pm.user_id = ?

	GROUP BY p.id, p.name
	`

	err := r.DB.Raw(query, userID).Scan(&result).Error

	return result, err
}