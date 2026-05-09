package dto

type CreateProjectRequest struct {
	Name        string `json:"name" validate:"required,min=3"`
	Description string `json:"description"`
}

type AddMemberRequest struct {
	UserID string `json:"user_id" validate:"required,uuid"`
	Role   string `json:"role" validate:"required,oneof=ADMIN MEMBER"`
}
