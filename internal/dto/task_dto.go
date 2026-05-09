package dto

type CreateTaskRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	ProjectID   string  `json:"project_id"`
	AssignedTo  *string `json:"assigned_to"`
	DueDate     *string `json:"due_date"`
}

type UpdateTaskRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Status      *string `json:"status"`
	AssignedTo  *string `json:"assigned_to"`
	DueDate     *string `json:"due_date"`
}
