const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// GET - Histórico unificado de atividades
router.get('/history', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      userType, 
      startDate, 
      endDate 
    } = req.query;
    
    const offset = (page - 1) * limit;

    // Obter histórico usando a função SQL
    const result = await pool.query(
      'SELECT * FROM get_unified_activity_history($1, $2, $3, $4, $5, $6)',
      [
        parseInt(limit),
        parseInt(offset),
        action || null,
        userType || null,
        startDate || null,
        endDate || null
      ]
    );

    // Contar total de registros
    const countResult = await pool.query(
      'SELECT count_unified_activity($1, $2, $3, $4) as total',
      [action || null, userType || null, startDate || null, endDate || null]
    );

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
    console.error('Erro ao buscar histórico unificado:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET - Estatísticas unificadas
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = '';
    switch (period) {
      case '1d':
        dateFilter = "AND \"createdAt\" >= NOW() - INTERVAL '1 day'";
        break;
      case '7d':
        dateFilter = "AND \"createdAt\" >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "AND \"createdAt\" >= NOW() - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "AND \"createdAt\" >= NOW() - INTERVAL '90 days'";
        break;
    }

    // Total de ações
    const totalActions = await pool.query(`
      SELECT COUNT(*) as total
      FROM "UnifiedActivityLogs"
      WHERE 1=1 ${dateFilter}
    `);

    // Ações por tipo
    const actionsByType = await pool.query(`
      SELECT action, COUNT(*) as count
      FROM "UnifiedActivityLogs"
      WHERE 1=1 ${dateFilter}
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `);

    // Ações por tipo de usuário
    const actionsByUserType = await pool.query(`
      SELECT "userType", COUNT(*) as count
      FROM "UnifiedActivityLogs"
      WHERE 1=1 ${dateFilter}
      GROUP BY "userType"
      ORDER BY count DESC
    `);

    // Atividade por dia (últimos 7 dias)
    const activityByDay = await pool.query(`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "UnifiedActivityLogs"
      WHERE "createdAt" >= NOW() - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `);

    // Top usuários mais ativos
    const topUsers = await pool.query(`
      SELECT 
        "userId",
        "userType",
        CASE 
          WHEN "userType" = 'admin' THEN a."Nome"
          ELSE u."Nome"
        END as "userName",
        COUNT(*) as count
      FROM "UnifiedActivityLogs" ual
      LEFT JOIN "Admins" a ON ual."userId" = a.id AND ual."userType" = 'admin'
      LEFT JOIN "Users" u ON ual."userId" = u.id AND ual."userType" = 'user'
      WHERE 1=1 ${dateFilter}
      GROUP BY "userId", "userType", a."Nome", u."Nome"
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        totalActions: parseInt(totalActions.rows[0].total),
        actionsByType: actionsByType.rows,
        actionsByUserType: actionsByUserType.rows,
        activityByDay: activityByDay.rows,
        topUsers: topUsers.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas unificadas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST - Registrar atividade manual
router.post('/log', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      userId, 
      userType, 
      action, 
      description, 
      targetType, 
      targetId, 
      metadata 
    } = req.body;

    if (!userId || !userType || !action || !description) {
      return res.status(400).json({
        success: false,
        message: 'userId, userType, action e description são obrigatórios'
      });
    }

    const result = await pool.query(
      'SELECT log_unified_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        userId,
        userType,
        action,
        description,
        targetType || null,
        targetId || null,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent'),
        JSON.stringify(metadata || {})
      ]
    );

    res.json({
      success: true,
      message: 'Atividade registrada com sucesso',
      logId: result.rows[0].log_unified_activity
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
