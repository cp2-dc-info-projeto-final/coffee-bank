-- Tabela unificada para logs de atividade de usuários e administradores
CREATE TABLE IF NOT EXISTS "UnifiedActivityLogs" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER, -- Pode ser ID de usuário ou admin
    "userType" VARCHAR(20) NOT NULL CHECK ("userType" IN ('user', 'admin')), -- Tipo do usuário
    "action" VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, UPDATE_PROFILE, CREATE_FUNDO, DELETE_ACCOUNT, DELETE_FUNDO, END_SESSION
    "description" TEXT NOT NULL,
    "targetType" VARCHAR(50), -- 'profile', 'fundo_imobiliario', 'account', 'session'
    "targetId" INTEGER, -- ID do objeto afetado
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "metadata" JSONB -- Dados adicionais
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_unified_activity_user ON "UnifiedActivityLogs"("userId", "userType");
CREATE INDEX IF NOT EXISTS idx_unified_activity_timestamp ON "UnifiedActivityLogs"("createdAt");
CREATE INDEX IF NOT EXISTS idx_unified_activity_action ON "UnifiedActivityLogs"("action");
CREATE INDEX IF NOT EXISTS idx_unified_activity_target ON "UnifiedActivityLogs"("targetType", "targetId");

-- Função para registrar atividade unificada
CREATE OR REPLACE FUNCTION log_unified_activity(
    p_user_id INTEGER,
    p_user_type VARCHAR(20),
    p_action VARCHAR(50),
    p_description TEXT,
    p_target_type VARCHAR(50) DEFAULT NULL,
    p_target_id INTEGER DEFAULT NULL,
    p_ip_address VARCHAR(45) DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO "UnifiedActivityLogs" (
        "userId", "userType", "action", "description", "targetType", "targetId", 
        "ipAddress", "userAgent", "metadata"
    ) VALUES (
        p_user_id, p_user_type, p_action, p_description, p_target_type, p_target_id,
        p_ip_address, p_user_agent, p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter histórico completo com informações do usuário
CREATE OR REPLACE FUNCTION get_unified_activity_history(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_action_filter VARCHAR(50) DEFAULT NULL,
    p_user_type_filter VARCHAR(20) DEFAULT NULL,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    "userId" INTEGER,
    "userType" VARCHAR(20),
    "userName" VARCHAR(255),
    "userCPF" VARCHAR(14),
    action VARCHAR(50),
    description TEXT,
    "targetType" VARCHAR(50),
    "targetId" INTEGER,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ual.id,
        ual."userId",
        ual."userType",
        CASE 
            WHEN ual."userType" = 'admin' THEN a."Nome"
            ELSE u."Nome"
        END as "userName",
        CASE 
            WHEN ual."userType" = 'admin' THEN a."CPF"
            ELSE u."CPF"
        END as "userCPF",
        ual.action,
        ual.description,
        ual."targetType",
        ual."targetId",
        ual."ipAddress",
        ual."userAgent",
        ual."createdAt",
        ual.metadata
    FROM "UnifiedActivityLogs" ual
    LEFT JOIN "Admins" a ON ual."userId" = a.id AND ual."userType" = 'admin'
    LEFT JOIN "Users" u ON ual."userId" = u.id AND ual."userType" = 'user'
    WHERE 
        (p_action_filter IS NULL OR ual.action = p_action_filter)
        AND (p_user_type_filter IS NULL OR ual."userType" = p_user_type_filter)
        AND (p_start_date IS NULL OR ual."createdAt" >= p_start_date)
        AND (p_end_date IS NULL OR ual."createdAt" <= p_end_date)
    ORDER BY ual."createdAt" DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Função para contar total de registros
CREATE OR REPLACE FUNCTION count_unified_activity(
    p_action_filter VARCHAR(50) DEFAULT NULL,
    p_user_type_filter VARCHAR(20) DEFAULT NULL,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count
    FROM "UnifiedActivityLogs" ual
    WHERE 
        (p_action_filter IS NULL OR ual.action = p_action_filter)
        AND (p_user_type_filter IS NULL OR ual."userType" = p_user_type_filter)
        AND (p_start_date IS NULL OR ual."createdAt" >= p_start_date)
        AND (p_end_date IS NULL OR ual."createdAt" <= p_end_date);
    
    RETURN total_count;
END;
$$ LANGUAGE plpgsql;
