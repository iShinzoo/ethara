package repository

import (
	"github.com/iShinzoo/ethara/internal/model"
	"gorm.io/gorm"
)

type TaskRepository struct {
	DB *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{
		DB: db,
	}
}

func (r *TaskRepository) CreateTask(task *model.Task) error {
	return r.DB.Create(task).Error
}

func (r *TaskRepository) GetTaskByID(taskID string) (*model.Task, error) {

	var task model.Task

	err := r.DB.First(&task, "id = ?", taskID).Error

	if err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *TaskRepository) UpdateTask(task *model.Task) error {
	return r.DB.Save(task).Error
}

func (r *TaskRepository) DeleteTask(taskID string) error {
	return r.DB.Delete(&model.Task{}, "id = ?", taskID).Error
}

func (r *TaskRepository) GetTasks(filters map[string]interface{}) ([]model.Task, error) {

	var tasks []model.Task

	query := r.DB.Model(&model.Task{})

	for key, value := range filters {
		query = query.Where(key+" = ?", value)
	}

	err := query.Find(&tasks).Error

	return tasks, err
}
