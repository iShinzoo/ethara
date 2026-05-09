CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(50) NOT NULL DEFAULT 'TODO',

    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,

    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    due_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()
);