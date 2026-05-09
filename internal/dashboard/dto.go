package dashboard

type DashboardResponse struct {
	TotalTasks       int64                    `json:"total_tasks"`
	CompletedTasks   int64                    `json:"completed_tasks"`
	OverdueTasks     int64                    `json:"overdue_tasks"`
	AssignedToMe     int64                    `json:"assigned_to_me"`
	ProjectProgress  []ProjectProgressSummary `json:"project_progress"`
}

type ProjectProgressSummary struct {
	ProjectID      string  `json:"project_id"`
	ProjectName    string  `json:"project_name"`
	TotalTasks     int64   `json:"total_tasks"`
	CompletedTasks int64   `json:"completed_tasks"`
	Progress       float64 `json:"progress"`
}