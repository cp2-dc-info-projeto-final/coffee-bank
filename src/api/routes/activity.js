const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Middleware para registrar atividade
const logActivity = (action, description, targetType = null, targetId = null) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.id) {
        await pool.query(
          'SELECT log_admin_activity($1, $2, $3, $4, $5, $6, $7, $8)',
          [
            req.user.id,
            action,
            description,
            targetType,
            targetId,
            req.ip || req.connection.remoteAddress,
            req.get('User-Agent'),
            JSON.stringify({
              method: req.method,
              url: req.originalUrl,
              timestamp: new Date().toISOString()
            })
          ]
        );
      }
    } catch (err) {
      console.error('Erro ao registrar atividade:', err);
    }
    next();
  };
};

// GET - Listar logs de atividade
router.get('/logs', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, action, adminId, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        al.id,
        al.action,
        al.description,
        al."targetType",
        al."targetId",
        al."ipAddress",
        al."userAgent",
        al.timestamp,
        al.metadata,
        a."Nome" as "adminName",
        a."CPF" as "adminCPF"
      FROM "ActivityLogs" al
      JOIN "Admins" a ON al."adminId" = a.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (action) {
      paramCount++;
      query += ` AND al.action ILIKE $${paramCount}`;
      params.push(`%${action}%`);
    }

    if (adminId) {
      paramCount++;
      query += ` AND al."adminId" = $${paramCount}`;
      params.push(adminId);
    }

    if (startDate) {
      paramCount++;
      query += ` AND al.timestamp >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND al.timestamp <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY al.timestamp DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Contar total de registros
    let countQuery = `
      SELECT COUNT(*) as total
      FROM "ActivityLogs" al
      JOIN "Admins" a ON al."adminId" = a.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamCount = 0;

    if (action) {
      countParamCount++;
      countQuery += ` AND al.action ILIKE $${countParamCount}`;
      countParams.push(`%${action}%`);
    }

    if (adminId) {
      countParamCount++;
      countQuery += ` AND al."adminId" = $${countParamCount}`;
      countParams.push(adminId);
    }

    if (startDate) {
      countParamCount++;
      countQuery += ` AND al.timestamp >= $${countParamCount}`;
      countParams.push(startDate);
    }

    if (endDate) {
      countParamCount++;
      countQuery += ` AND al.timestamp <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar logs de atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET - Estatísticas de atividade
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = '';
    switch (period) {
      case '1d':
        dateFilter = "AND timestamp >= NOW() - INTERVAL '1 day'";
        break;
      case '7d':
        dateFilter = "AND timestamp >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "AND timestamp >= NOW() - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "AND timestamp >= NOW() - INTERVAL '90 days'";
        break;
    }

    // Total de ações
    const totalActions = await pool.query(`
      SELECT COUNT(*) as total
      FROM "ActivityLogs"
      WHERE 1=1 ${dateFilter}
    `);

    // Ações por tipo
    const actionsByType = await pool.query(`
      SELECT action, COUNT(*) as count
      FROM "ActivityLogs"
      WHERE 1=1 ${dateFilter}
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `);

    // Ações por administrador
    const actionsByAdmin = await pool.query(`
      SELECT 
        a."Nome" as "adminName",
        a."CPF" as "adminCPF",
        COUNT(al.id) as count
      FROM "ActivityLogs" al
      JOIN "Admins" a ON al."adminId" = a.id
      WHERE 1=1 ${dateFilter}
      GROUP BY a.id, a."Nome", a."CPF"
      ORDER BY count DESC
      LIMIT 10
    `);

    // Atividade por dia (últimos 7 dias)
    const activityByDay = await pool.query(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM "ActivityLogs"
      WHERE timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `);

    res.json({
      success: true,
      data: {
        totalActions: parseInt(totalActions.rows[0].total),
        actionsByType: actionsByType.rows,
        actionsByAdmin: actionsByAdmin.rows,
        activityByDay: activityByDay.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET - Sessões ativas
router.get('/sessions', verifyToken, isAdmin, async (req, res) => {
  try {
    // Limpar sessões expiradas
    await pool.query('SELECT cleanup_expired_sessions()');

    const result = await pool.query(`
      SELECT 
        s.id,
        s."sessionToken",
        s."ipAddress",
        s."userAgent",
        s."loginTime",
        s."lastActivity",
        s."expiresAt",
        a."Nome" as "adminName",
        a."CPF" as "adminCPF"
      FROM "ActiveSessions" s
      JOIN "Admins" a ON s."adminId" = a.id
      WHERE s."isActive" = true
      ORDER BY s."lastActivity" DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar sessões ativas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST - Registrar atividade manual
router.post('/log', verifyToken, isAdmin, logActivity('MANUAL_LOG', 'Atividade registrada manualmente'), async (req, res) => {
  try {
    const { action, description, targetType, targetId } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        message: 'Ação e descrição são obrigatórios'
      });
    }

    const result = await pool.query(
      'SELECT log_admin_activity($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        req.user.id,
        action,
        description,
        targetType || null,
        targetId || null,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent'),
        JSON.stringify(req.body.metadata || {})
      ]
    );

    res.json({
      success: true,
      message: 'Atividade registrada com sucesso',
      logId: result.rows[0].log_admin_activity
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE - Encerrar sessão
router.delete('/sessions/:sessionId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      'UPDATE "ActiveSessions" SET "isActive" = false WHERE id = $1 AND "isActive" = true RETURNING *',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sessão não encontrada ou já encerrada'
      });
    }

    // Registrar no log
    await pool.query(
      'SELECT log_admin_activity($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        req.user.id,
        'SESSION_END',
        'Sessão encerrada manualmente',
        'session',
        sessionId,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent'),
        JSON.stringify({ sessionId })
      ]
    );

    res.json({
      success: true,
      message: 'Sessão encerrada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao encerrar sessão:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET - Limpar logs antigos (manutenção)
router.delete('/cleanup', verifyToken, isAdmin, async (req, res) => {
  try {
    const { days = 90 } = req.query;

    const result = await pool.query(
      'DELETE FROM "ActivityLogs" WHERE timestamp < NOW() - INTERVAL $1',
      [`${days} days`]
    );

    res.json({
      success: true,
      message: `Logs antigos removidos (mais de ${days} dias)`,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
