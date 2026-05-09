package dto

type CreateTaskRequest struct {
	Title       string  `json:"title" validate:"required,min=3"`
	Description string  `json:"description"`
	ProjectID   string  `json:"project_id" validate:"required,uuid"`
	AssignedTo  *string `json:"assigned_to,omitempty"`
	DueDate     *string `json:"due_date,omitempty"`
}

type UpdateTaskRequest struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Status      *string `json:"status,omitempty"`
	AssignedTo  *string `json:"assigned_to,omitempty"`
	DueDate     *string `json:"due_date,omitempty"`
}
