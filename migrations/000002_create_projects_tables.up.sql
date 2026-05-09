CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',

    joined_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, project_id)
);