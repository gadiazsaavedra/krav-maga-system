// Sistema de control de suscripciones
const subscriptionControl = {
  // Verificar si el cliente está activo
  isClientActive: async (tenantId) => {
    const subscription = await db.get(
      'SELECT * FROM subscriptions WHERE tenant_id = ? AND status = "active" AND expires_at > datetime("now")',
      [tenantId]
    );
    return !!subscription;
  },

  // Middleware para verificar acceso
  checkAccess: async (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'] || req.subdomain;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID requerido' });
    }

    const isActive = await subscriptionControl.isClientActive(tenantId);
    
    if (!isActive) {
      return res.status(403).json({ 
        error: 'Suscripción vencida o inactiva',
        message: 'Contacte al administrador para renovar su suscripción'
      });
    }

    req.tenantId = tenantId;
    next();
  },

  // Suspender cliente por falta de pago
  suspendClient: async (tenantId) => {
    await db.run(
      'UPDATE subscriptions SET status = "suspended" WHERE tenant_id = ?',
      [tenantId]
    );
    
    // Opcional: Crear backup antes de suspender
    await createBackup(tenantId);
  },

  // Reactivar cliente
  reactivateClient: async (tenantId, months = 1) => {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);
    
    await db.run(
      'UPDATE subscriptions SET status = "active", expires_at = ? WHERE tenant_id = ?',
      [expiresAt.toISOString(), tenantId]
    );
  }
};

module.exports = subscriptionControl;