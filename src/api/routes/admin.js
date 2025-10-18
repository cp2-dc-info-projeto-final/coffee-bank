var express = require('express');
var {verifyToken,isAdmin}=require("../middlewares/auth")
var router = express.Router();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const ValidationCPF = require('../Functions/CPFValidation');
const jwt = require('jsonwebtoken');
// Função para gerar senha aleatória de 12 dígitos
function generateRandomPassword() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Login de administrador
router.get("/validation",async function(req, res, next) {
  return res.json({
    success: true,
    message: 'Acesso autorizado'
  });
})
router.post('/login',async function(req, res, next) {
  try {
    const { CPF, Senha12 } = req.body;
    
    if (!CPF || !Senha12) {
      return res.status(400).json({
        success: false,
        message: 'CPF e senha são obrigatórios'
      });
    }

    if (!ValidationCPF(CPF)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }

    const result = await pool.query(
      'SELECT * FROM "Admins" WHERE "CPF" = $1',
      [CPF]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'CPF incorreto'
      });
    }

    const isValidPassword = await bcrypt.compare(Senha12, result.rows[0].Senha12);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    const adminData = {
      id: result.rows[0].id,
      CPF: result.rows[0].CPF,
      Nome: result.rows[0].Nome,
      DataCriacao: result.rows[0].DataCriacao,
      role:"admin"
    };
    const token = jwt.sign(
    adminData, 
    process.env.JWT_SECRET, //chave secreta, nunca exponha!! >>> PERIGO <<<
    { expiresIn: '30min' } 
  );

    // Registrar login no sistema de atividade unificada
    try {
      await pool.query('SELECT log_unified_activity($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
        result.rows[0].id,
        'admin',
        'LOGIN',
        'Administrador fez login no sistema',
        'account',
        result.rows[0].id,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent'),
        JSON.stringify({ loginTime: new Date().toISOString() })
      ]);
    } catch (logError) {
      console.error('Erro ao registrar login:', logError);
    }

    return res.json({
      success: true,
      message: 'Login bem-sucedido',
      data: token
    });
  } catch (err) {
    console.error('Erro no login do admin:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Listar todos os administradores
router.get('/', async function(req, res, next) {
  try {
    const result = await pool.query('SELECT id, "CPF", "Nome", "DataCriacao" FROM "Admins" ORDER BY "DataCriacao" DESC');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criar novo administrador
router.post('/', async function(req, res, next) {
  try {
    const { CPF, Nome} = req.body;
    console.log(CPF,Nome)
    if (!CPF || !Nome) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (!ValidationCPF(CPF)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido'
      });
    }

    // Verificar se CPF já existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE "CPF" = $1', [CPF]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    // Gerar senha aleatória de 12 dígitos
    const novaSenha = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    const result = await pool.query(
      'INSERT INTO "Admins" ("CPF", "Nome", "Senha12") VALUES ($1, $2, $3) RETURNING id, "CPF", "Nome", "DataCriacao"',
      [CPF, Nome, hashedPassword]
    );

    res.json({
      success: true,
      message: 'Administrador criado com sucesso',
      data: {
        admin: result.rows[0],
        senhaGerada: novaSenha
      }
    });
  } catch (err) {
    console.error('Erro ao criar administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Atualizar administrador
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { Nome, Senha12Confirmacao } = req.body;
    
    if (!Nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }

    // Verificar se admin existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE id = $1', [id]);
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador não encontrado'
      });
    }

    const result = await pool.query(
      'UPDATE "Admins" SET "Nome" = $1 WHERE id = $2 RETURNING id, "CPF", "Nome", "DataCriacao"',
      [Nome, id]
    );

    res.json({
      success: true,
      message: 'Administrador atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Erro ao atualizar administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Excluir administrador
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se admin existe
    const existingAdmin = await pool.query('SELECT id FROM "Admins" WHERE id = $1', [id]);
    if (existingAdmin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador não encontrado'
      });
    }

    await pool.query('DELETE FROM "Admins" WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Administrador excluído com sucesso'
    });
  } catch (err) {
    console.error('Erro ao excluir administrador:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar usuários (para gerenciamento)
router.get('/users', async function(req, res, next) {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT id, "CPF", "Nome", "Saldo", "DataCriacao" FROM "Users"';
    let params = [];
    let paramCount = 0;

    if (search) {
      query += ' WHERE "Nome" ILIKE $1 OR "CPF" ILIKE $1';
      params.push(`%${search}%`);
      paramCount = 1;
    }

    query += ` ORDER BY "DataCriacao" DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Buscar total de usuários para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM "Users"';
    let countParams = [];
    
    if (search) {
      countQuery += ' WHERE "Nome" ILIKE $1 OR "CPF" ILIKE $1';
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Excluir usuário
router.delete('/users/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    
    // Verificar se usuário existe
    const existingUser = await pool.query('SELECT id FROM "Users" WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Excluir usuário (cascade irá excluir transferências relacionadas)
    await pool.query('DELETE FROM "Users" WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Estatísticas gerais
router.get('/stats', async function(req, res, next) {
  try {
    // Total de usuários
    const totalUsers = await pool.query('SELECT COUNT(*) as total FROM "Users"');
    
    // Total de administradores
    const totalAdmins = await pool.query('SELECT COUNT(*) as total FROM "Admins"');
    
    // Total de transferências
    const totalTransfers = await pool.query('SELECT COUNT(*) as total FROM "Transferencias"');
    
    // Saldo total do sistema
    const totalBalance = await pool.query('SELECT SUM("Saldo") as total FROM "Users"');
    
    // Usuários criados hoje
    const todayUsers = await pool.query(`
      SELECT COUNT(*) as total FROM "Users" 
      WHERE DATE("DataCriacao") = CURRENT_DATE
    `);
    
    // Transferências hoje
    const todayTransfers = await pool.query(`
      SELECT COUNT(*) as total FROM "Transferencias" 
      WHERE DATE("Data") = CURRENT_DATE
    `);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(totalUsers.rows[0].total),
        totalAdmins: parseInt(totalAdmins.rows[0].total),
        totalTransfers: parseInt(totalTransfers.rows[0].total),
        totalBalance: parseInt(totalBalance.rows[0].total) || 0,
        todayUsers: parseInt(todayUsers.rows[0].total),
        todayTransfers: parseInt(todayTransfers.rows[0].total)
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

// Dados para gráfico de crescimento de usuários
router.get('/charts/user-growth', async function(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', "DataCriacao") as month,
        COUNT(*) as users_count
      FROM "Users"
      WHERE "DataCriacao" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "DataCriacao")
      ORDER BY month
    `);
    
    const data = result.rows.map(row => ({
      month: row.month.toISOString().substring(0, 7), // YYYY-MM
      count: parseInt(row.users_count)
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar dados de crescimento de usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Dados para gráfico de distribuição por perfil
router.get('/charts/user-distribution', async function(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT 
        CASE 
          WHEN "Saldo" < 100 THEN 'Iniciante'
          WHEN "Saldo" >= 100 AND "Saldo" < 500 THEN 'Intermediário'
          WHEN "Saldo" >= 500 AND "Saldo" < 1000 THEN 'Avançado'
          ELSE 'Expert'
        END as profile_type,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Users")), 2) as percentage
      FROM "Users"
      GROUP BY profile_type
      ORDER BY count DESC
    `);
    
    const data = result.rows.map(row => ({
      label: row.profile_type,
      value: parseInt(row.count),
      percentage: parseFloat(row.percentage)
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar dados de distribuição de usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Dados para gráfico de volume de transferências
router.get('/charts/transfer-volume', async function(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('day', "Data") as day,
        COUNT(*) as transfers_count,
        SUM("Valor") as total_volume
      FROM "Transferencias"
      WHERE "Data" >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "Data")
      ORDER BY day
    `);
    
    const data = result.rows.map(row => ({
      day: row.day.toISOString().substring(0, 10), // YYYY-MM-DD
      transfers: parseInt(row.transfers_count),
      volume: parseFloat(row.total_volume) || 0
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar dados de volume de transferências:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Dados para gráfico de tendência temporal
router.get('/charts/temporal-trend', async function(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('week', "Data") as week,
        COUNT(*) as transfers_count,
        AVG("Valor") as avg_value
      FROM "Transferencias"
      WHERE "Data" >= CURRENT_DATE - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', "Data")
      ORDER BY week
    `);
    
    const data = result.rows.map(row => ({
      week: row.week.toISOString().substring(0, 10),
      transfers: parseInt(row.transfers_count),
      avgValue: parseFloat(row.avg_value) || 0
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar dados de tendência temporal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Dados para gráfico de receitas
router.get('/charts/revenue', async function(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', "Data") as month,
        COUNT(*) as transactions_count,
        SUM("Valor") as total_revenue
      FROM "Transferencias"
      WHERE "Data" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "Data")
      ORDER BY month
    `);
    
    const data = result.rows.map(row => ({
      month: row.month.toISOString().substring(0, 7),
      transactions: parseInt(row.transactions_count),
      revenue: parseFloat(row.total_revenue) || 0
    }));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar dados de receitas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Dados para dashboard de métricas avançadas
router.get('/charts/analytics', async function(req, res, next) {
  try {
    // Métricas de performance
    const performanceMetrics = await pool.query(`
      SELECT 
        'users_per_day' as metric,
        ROUND(COUNT(*)::numeric / NULLIF(EXTRACT(days FROM MAX("DataCriacao") - MIN("DataCriacao")), 0), 2) as value
      FROM "Users"
      UNION ALL
      SELECT 
        'avg_transfer_value' as metric,
        ROUND(AVG("Valor"), 2) as value
      FROM "Transferencias"
      UNION ALL
      SELECT 
        'total_balance' as metric,
        ROUND(SUM("Saldo"), 2) as value
      FROM "Users"
    `);
    
    // Análise comparativa (últimos 6 meses vs anteriores)
    const comparativeAnalysis = await pool.query(`
      SELECT 
        CASE 
          WHEN "Data" >= CURRENT_DATE - INTERVAL '6 months' THEN 'recent'
          ELSE 'previous'
        END as period,
        COUNT(*) as transactions,
        SUM("Valor") as total_value,
        AVG("Valor") as avg_value
      FROM "Transferencias"
      WHERE "Data" >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY period
    `);

    const performance = {};
    performanceMetrics.rows.forEach(row => {
      performance[row.metric] = parseFloat(row.value) || 0;
    });

    const comparative = {};
    comparativeAnalysis.rows.forEach(row => {
      comparative[row.period] = {
        transactions: parseInt(row.transactions),
        totalValue: parseFloat(row.total_value) || 0,
        avgValue: parseFloat(row.avg_value) || 0
      };
    });

    res.json({
      success: true,
      data: {
        performance,
        comparative
      }
    });
  } catch (error) {
    console.error('Erro ao buscar dados de analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para exportar relatório PDF
router.get('/export/pdf', async function(req, res, next) {
  try {
    const { startDate, endDate, type = 'full' } = req.query;
    
    // Buscar dados baseado no tipo de relatório
    let data = {};
    
    if (type === 'full' || type === 'users') {
      // Dados de usuários
      const usersResult = await pool.query(`
        SELECT 
          u.id,
          u."CPF",
          u."Nome",
          u."Saldo",
          u."DataCriacao",
          COUNT(t.id) as total_transfers,
          COALESCE(SUM(t."Valor"), 0) as total_volume
        FROM "Users" u
        LEFT JOIN "Transferencias" t ON u.id = t."UsuarioOrigem"
        ${startDate && endDate ? 'WHERE u."DataCriacao" BETWEEN $1 AND $2' : ''}
        GROUP BY u.id, u."CPF", u."Nome", u."Saldo", u."DataCriacao"
        ORDER BY u."DataCriacao" DESC
      `, startDate && endDate ? [startDate, endDate] : []);
      
      data.users = usersResult.rows;
    }
    
    if (type === 'full' || type === 'transfers') {
      // Dados de transferências
      const transfersResult = await pool.query(`
        SELECT 
          t.id,
          t."Valor",
          t."Data",
          uo."Nome" as origem_nome,
          ud."Nome" as destino_nome,
          t."Descricao"
        FROM "Transferencias" t
        JOIN "Users" uo ON t."UsuarioOrigem" = uo.id
        JOIN "Users" ud ON t."UsuarioDestino" = ud.id
        ${startDate && endDate ? 'WHERE t."Data" BETWEEN $1 AND $2' : ''}
        ORDER BY t."Data" DESC
      `, startDate && endDate ? [startDate, endDate] : []);
      
      data.transfers = transfersResult.rows;
    }
    
    if (type === 'full' || type === 'stats') {
      // Estatísticas gerais
      const statsResult = await pool.query(`
        SELECT 
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT t.id) as total_transfers,
          COALESCE(SUM(u."Saldo"), 0) as total_balance,
          COALESCE(SUM(t."Valor"), 0) as total_volume
        FROM "Users" u
        LEFT JOIN "Transferencias" t ON u.id = t."UsuarioOrigem"
        ${startDate && endDate ? 'WHERE u."DataCriacao" BETWEEN $1 AND $2' : ''}
      `, startDate && endDate ? [startDate, endDate] : []);
      
      data.stats = statsResult.rows[0];
    }
    
    // Configurar headers para download
    const filename = `relatorio_coffee_bank_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.json({
      success: true,
      data: {
        reportType: type,
        generatedAt: new Date().toISOString(),
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        },
        ...data
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para exportar relatório Excel
router.get('/export/excel', async function(req, res, next) {
  try {
    const { startDate, endDate, type = 'full' } = req.query;
    
    // Buscar dados estruturados para Excel
    let excelData = [];
    
    if (type === 'users' || type === 'full') {
      const usersResult = await pool.query(`
        SELECT 
          u."CPF",
          u."Nome",
          u."Saldo",
          u."DataCriacao",
          COUNT(t.id) as total_transfers,
          COALESCE(SUM(t."Valor"), 0) as total_volume
        FROM "Users" u
        LEFT JOIN "Transferencias" t ON u.id = t."UsuarioOrigem"
        ${startDate && endDate ? 'WHERE u."DataCriacao" BETWEEN $1 AND $2' : ''}
        GROUP BY u.id, u."CPF", u."Nome", u."Saldo", u."DataCriacao"
        ORDER BY u."DataCriacao" DESC
      `, startDate && endDate ? [startDate, endDate] : []);
      
      excelData.push({
        sheet: 'Usuários',
        headers: ['CPF', 'Nome', 'Saldo', 'Data Criação', 'Total Transferências', 'Volume Total'],
        data: usersResult.rows.map(row => [
          row.CPF,
          row.Nome,
          parseFloat(row.Saldo),
          new Date(row.DataCriacao).toLocaleDateString('pt-BR'),
          parseInt(row.total_transfers),
          parseFloat(row.total_volume)
        ])
      });
    }
    
    if (type === 'transfers' || type === 'full') {
      const transfersResult = await pool.query(`
        SELECT 
          t."Valor",
          t."Data",
          uo."Nome" as origem_nome,
          ud."Nome" as destino_nome,
          t."Descricao"
        FROM "Transferencias" t
        JOIN "Users" uo ON t."UsuarioOrigem" = uo.id
        JOIN "Users" ud ON t."UsuarioDestino" = ud.id
        ${startDate && endDate ? 'WHERE t."Data" BETWEEN $1 AND $2' : ''}
        ORDER BY t."Data" DESC
      `, startDate && endDate ? [startDate, endDate] : []);
      
      excelData.push({
        sheet: 'Transferências',
        headers: ['Valor', 'Data', 'Origem', 'Destino', 'Descrição'],
        data: transfersResult.rows.map(row => [
          parseFloat(row.Valor),
          new Date(row.Data).toLocaleDateString('pt-BR'),
          row.origem_nome,
          row.destino_nome,
          row.Descricao
        ])
      });
    }
    
    // Configurar headers para download
    const filename = `relatorio_excel_coffee_bank_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.json({
      success: true,
      data: {
        reportType: type,
        generatedAt: new Date().toISOString(),
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        },
        excelData
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Endpoint para relatório mensal
router.get('/export/monthly', async function(req, res, next) {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    
    // Dados do mês específico
    const monthlyData = await pool.query(`
      SELECT 
        DATE_TRUNC('day', "Data") as day,
        COUNT(*) as transfers_count,
        SUM("Valor") as daily_volume,
        AVG("Valor") as avg_value
      FROM "Transferencias"
      WHERE EXTRACT(YEAR FROM "Data") = $1 
        AND EXTRACT(MONTH FROM "Data") = $2
      GROUP BY DATE_TRUNC('day', "Data")
      ORDER BY day
    `, [year, month]);
    
    // Estatísticas do mês
    const monthStats = await pool.query(`
      SELECT 
        COUNT(DISTINCT u.id) as new_users,
        COUNT(t.id) as total_transfers,
        SUM(t."Valor") as total_volume,
        AVG(t."Valor") as avg_transfer_value
      FROM "Users" u
      LEFT JOIN "Transferencias" t ON u.id = t."UsuarioOrigem"
      WHERE EXTRACT(YEAR FROM u."DataCriacao") = $1 
        AND EXTRACT(MONTH FROM u."DataCriacao") = $2
        OR EXTRACT(YEAR FROM t."Data") = $1 
        AND EXTRACT(MONTH FROM t."Data") = $2
    `, [year, month]);
    
    // Configurar headers para download
    const filename = `relatorio_mensal_${year}_${month.toString().padStart(2, '0')}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.json({
      success: true,
      data: {
        reportType: 'monthly',
        period: { year: parseInt(year), month: parseInt(month) },
        generatedAt: new Date().toISOString(),
        dailyData: monthlyData.rows,
        statistics: monthStats.rows[0]
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
