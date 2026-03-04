-- YFlow Database Migration Script
-- Add YFlow specific fields to existing Yflowtables

-- Add YFlow branding fields to Platform table
ALTER TABLE platform
ADD COLUMN IF NOT EXISTS yflow_domain VARCHAR(255),
ADD COLUMN IF NOT EXISTS yflow_branding_config TEXT;

-- Add YFlow specific fields to User table
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS yflow_external_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS yflow_role VARCHAR(50);

-- Add YKassa fields to PlatformPlan table
ALTER TABLE platform_plan
ADD COLUMN IF NOT EXISTS ykassa_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ykassa_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ykassa_subscription_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS ykassa_subscription_start_date BIGINT,
ADD COLUMN IF NOT EXISTS ykassa_subscription_end_date BIGINT,
ADD COLUMN IF NOT EXISTS ykassa_subscription_cancel_date BIGINT;

-- Create indexes for YFlow fields
CREATE INDEX IF NOT EXISTS idx_platform_yflow_domain ON platform(yflow_domain);
CREATE INDEX IF NOT EXISTS idx_user_yflow_external_id ON "user"(yflow_external_id);
CREATE INDEX IF NOT EXISTS idx_platform_plan_ykassa_customer_id ON platform_plan(ykassa_customer_id);

-- Insert default YFlow platform configuration
INSERT INTO platform (id, "created", "updated", owner_id, name, primary_color, logo_icon_url, full_logo_url, fav_icon_url, filtered_piece_names, filtered_piece_behavior, cloud_auth_enabled, enforce_allowed_auth_domains, allowed_auth_domains, email_auth_enabled, pinned_pieces, yflow_domain, yflow_branding_config)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    'yflow-admin',
    'YFlow',
    '#9675FF',
    'https://cdn.yflow.ru/logo-icon.png',
    'https://cdn.yflow.ru/logo-full.png',
    'https://cdn.yflow.ru/favicon.ico',
    ARRAY[]::VARCHAR[],
    'ALLOWED',
    true,
    false,
    ARRAY[]::VARCHAR[],
    true,
    ARRAY[]::VARCHAR[],
    'app.yflow.ru',
    '{"theme": "yflow", "locale": "ru"}'
) ON CONFLICT DO NOTHING;

-- Create YFlow specific roles
INSERT INTO "user" (id, "created", "updated", platform_role, status, identity_id, external_id, platform_id, last_active_date, yflow_external_id, yflow_role)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    'ADMIN',
    'ACTIVE',
    'yflow-admin@yflow.ru',
    NULL,
    (SELECT id FROM platform WHERE name = 'YFlow'),
    NOW(),
    'yflow-admin-001',
    'SUPER_ADMIN'
) ON CONFLICT DO NOTHING;

-- Create YFlow billing plans
INSERT INTO platform_plan (id, "created", "updated", platform_id, plan, included_ai_credits, tables_enabled, event_streaming_enabled, ai_credits_auto_top_up_state, environments_enabled, analytics_enabled, show_powered_by, audit_log_enabled, embedding_enabled, manage_pieces_enabled, manage_templates_enabled, custom_appearance_enabled, team_projects_limit, project_roles_enabled, custom_domains_enabled, global_connections_enabled, custom_roles_enabled, api_keys_enabled, sso_enabled, projects_limit, active_flows_limit)
VALUES
(
    gen_random_uuid(),
    NOW(),
    NOW(),
    (SELECT id FROM platform WHERE name = 'YFlow'),
    'yflow-starter',
    1000,
    false,
    false,
    'disabled',
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    'NONE',
    false,
    false,
    false,
    false,
    false,
    false,
    5,
    10
),
(
    gen_random_uuid(),
    NOW(),
    NOW(),
    (SELECT id FROM platform WHERE name = 'YFlow'),
    'yflow-professional',
    10000,
    true,
    true,
    'enabled',
    true,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    'UNLIMITED',
    true,
    true,
    true,
    true,
    true,
    true,
    50,
    100
),
(
    gen_random_uuid(),
    NOW(),
    NOW(),
    (SELECT id FROM platform WHERE name = 'YFlow'),
    'yflow-enterprise',
    100000,
    true,
    true,
    'enabled',
    true,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    'UNLIMITED',
    true,
    true,
    true,
    true,
    true,
    true,
    NULL,
    NULL
) ON CONFLICT DO NOTHING;

-- Create YFlow audit log table
CREATE TABLE IF NOT EXISTS yflow_audit_log (
    id VARCHAR(255) PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255) NOT NULL,
    platform_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (platform_id) REFERENCES platform(id)
);

-- Create index for audit log queries
CREATE INDEX IF NOT EXISTS idx_yflow_audit_log_user_id ON yflow_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_yflow_audit_log_platform_id ON yflow_audit_log(platform_id);
CREATE INDEX IF NOT EXISTS idx_yflow_audit_log_created ON yflow_audit_log(created);

-- Create YFlow custom domains table
CREATE TABLE IF NOT EXISTS yflow_custom_domain (
    id VARCHAR(255) PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    platform_id VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'PENDING',
    ssl_certificate TEXT,
    ssl_private_key TEXT,
    dns_verified BOOLEAN DEFAULT false,
    FOREIGN KEY (platform_id) REFERENCES platform(id)
);

-- Create index for custom domains
CREATE INDEX IF NOT EXISTS idx_yflow_custom_domain_platform_id ON yflow_custom_domain(platform_id);
CREATE INDEX IF NOT EXISTS idx_yflow_custom_domain_domain ON yflow_custom_domain(domain);

COMMIT;
