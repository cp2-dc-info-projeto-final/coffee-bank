-- Tabela para logs de atividade dos administradores
CREATE TABLE IF NOT EXISTS "ActivityLogs" (
    id SERIAL PRIMARY KEY,
    "adminId" INTEGER NOT NULL REFERENCES "Admins"(id) ON DELETE CASCADE,
    "action" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "targetType" VARCHAR(100), -- 'admin', 'fundo_imobiliario', 'user', etc.
    "targetId" INTEGER, -- ID do objeto afetado
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
    "metadata" JSONB -- Dados adicionais em formato JSON
);

-- Tabela para sessões ativas dos administradores
CREATE TABLE IF NOT EXISTS "ActiveSessions" (
    id SERIAL PRIMARY KEY,
    "adminId" INTEGER NOT NULL REFERENCES "Admins"(id) ON DELETE CASCADE,
    "sessionToken" VARCHAR(500) NOT NULL UNIQUE,
    "ipAddress" VARCHAR(45) NOT NULL,
    "userAgent" TEXT,
    "loginTime" TIMESTAMP NOT NULL DEFAULT NOW(),
    "lastActivity" TIMESTAMP NOT NULL DEFAULT NOW(),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON "ActivityLogs"("adminId");
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON "ActivityLogs"("timestamp");
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON "ActivityLogs"("action");
CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON "ActivityLogs"("targetType", "targetId");

CREATE INDEX IF NOT EXISTS idx_active_sessions_admin_id ON "ActiveSessions"("adminId");
CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON "ActiveSessions"("sessionToken");
CREATE INDEX IF NOT EXISTS idx_active_sessions_active ON "ActiveSessions"("isActive");
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires ON "ActiveSessions"("expiresAt");

-- Trigger para limpar sessões expiradas automaticamente
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE "ActiveSessions" 
    SET "isActive" = false 
    WHERE "expiresAt" < NOW() AND "isActive" = true;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar atividade
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id INTEGER,
    p_action VARCHAR(255),
    p_description TEXT DEFAULT NULL,
    p_target_type VARCHAR(100) DEFAULT NULL,
    p_target_id INTEGER DEFAULT NULL,
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO "ActivityLogs" (
        "adminId", "action", "description", "targetType", "targetId", 
        "ipAddress", "userAgent", "metadata"
    ) VALUES (
        p_admin_id, p_action, p_description, p_target_type, p_target_id,
        p_ip_address, p_user_agent, p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar login
CREATE OR REPLACE FUNCTION log_admin_login(
    p_admin_id INTEGER,
    p_session_token VARCHAR(500),
    p_ip_address VARCHAR(45),
    p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
BEGIN
    -- Desativar sessões anteriores do mesmo admin
    UPDATE "ActiveSessions" 
    SET "isActive" = false 
    WHERE "adminId" = p_admin_id AND "isActive" = true;
    
    -- Criar nova sessão
    INSERT INTO "ActiveSessions" (
        "adminId", "sessionToken", "ipAddress", "userAgent", "expiresAt"
    ) VALUES (
        p_admin_id, p_session_token, p_ip_address, p_user_agent, 
        NOW() + INTERVAL '30 minutes'
    ) RETURNING id INTO session_id;
    
    -- Registrar no log de atividade
    PERFORM log_admin_activity(
        p_admin_id, 
        'LOGIN', 
        'Administrador fez login no sistema',
        'admin',
        p_admin_id,
        p_ip_address,
        p_user_agent,
        jsonb_build_object('sessionId', session_id)
    );
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar última atividade
CREATE OR REPLACE FUNCTION update_last_activity(
    p_session_token VARCHAR(500)
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE "ActiveSessions" 
    SET "lastActivity" = NOW(),
        "expiresAt" = NOW() + INTERVAL '30 minutes'
    WHERE "sessionToken" = p_session_token AND "isActive" = true;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
