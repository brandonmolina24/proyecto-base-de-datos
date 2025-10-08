const { Pago, Prestamo } = require('../models');
const { sequelize } = require('../models');

const crear = async (req, res) => {
  const t = await sequelize.transaction(); // Inicia una transacción
  try {
    const { PrestamoID, MontoPagado, MedioDePago } = req.body;
    const prestamo = await Prestamo.findByPk(PrestamoID, { transaction: t });

    if (!prestamo) {
      await t.rollback();
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    if (prestamo.EstadoPrestamo !== 'Activo') {
        await t.rollback();
        return res.status(400).json({ error: 'Solo se pueden registrar pagos a préstamos activos' });
    }

    // --- VALIDACIÓN AÑADIDA ---
    if (parseFloat(MontoPagado) > parseFloat(prestamo.SaldoPendiente)) {
      await t.rollback();
      return res.status(400).json({ 
        error: `El monto del pago ($${MontoPagado}) no puede ser mayor al saldo pendiente ($${prestamo.SaldoPendiente}).` 
      });
    }

    // 1. Crear el registro del pago
    const pago = await Pago.create({ PrestamoID, MontoPagado, MedioDePago }, { transaction: t });

    // 2. Actualizar el saldo del préstamo
    const nuevoSaldo = parseFloat(prestamo.SaldoPendiente) - parseFloat(MontoPagado);
    prestamo.SaldoPendiente = nuevoSaldo;

    // 3. Si el saldo es cero o menos, marcar como Pagado
    if (nuevoSaldo <= 0) {
      prestamo.EstadoPrestamo = 'Pagado';
    }

    await prestamo.save({ transaction: t });
    await t.commit(); // Confirma la transacción

    res.status(201).json(pago);
  } catch (error) {
    await t.rollback(); // Deshace todo si hay un error
    console.error("Error al crear el pago:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { crear };