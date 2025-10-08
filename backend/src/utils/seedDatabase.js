require('dotenv').config();
const { 
  sequelize, 
  UsuarioInterno, 
  Cliente, 
  SolicitudCredito 
} = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos OK\n');

    // 1. Crear usuarios internos
    console.log('👥 Creando usuarios internos...');
    
    const usuarios = await UsuarioInterno.bulkCreate([
      {
        NombreCompleto: 'Administrador Sistema',
        Email: 'admin@pymecredito.com',
        PasswordHash: 'Admin123!',
        Rol: 'Admin',
        Estado: 'Activo'
      },
      {
        NombreCompleto: 'Ana García',
        Email: 'ana.garcia@pymecredito.com',
        PasswordHash: 'Analista123!',
        Rol: 'Analista',
        Estado: 'Activo'
      },
      {
        NombreCompleto: 'Carlos Ruiz',
        Email: 'carlos.ruiz@pymecredito.com',
        PasswordHash: 'Cartera123!',
        Rol: 'Cartera',
        Estado: 'Activo'
      },
      {
        NombreCompleto: 'María López',
        Email: 'maria.lopez@pymecredito.com',
        PasswordHash: 'Supervisor123!',
        Rol: 'Supervisor',
        Estado: 'Activo'
      }
    ], { 
      individualHooks: true // IMPORTANTE: Para que ejecute el hook de hasheo
    });
    
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // 2. Crear clientes
    console.log('\n🏢 Creando clientes...');
    
    const clientes = await Cliente.bulkCreate([
      {
        NIT: '900123456-1',
        RazonSocial: 'Comercializadora ABC SAS',
        FechaConstitucion: '2020-03-15',
        SectorEconomico: 'Comercio',
        EmailContacto: 'gerencia@comercializadoraabc.com',
        Telefono: '3101234567',
        Direccion: 'Calle 100 #15-20, Bogotá',
        CanalAdquisicion: 'Web',
        Estado: 'Activo'
      },
      {
        NIT: '800987654-2',
        RazonSocial: 'Industrias XYZ LTDA',
        FechaConstitucion: '2018-07-22',
        SectorEconomico: 'Manufactura',
        EmailContacto: 'contacto@industriasxyz.com',
        Telefono: '3109876543',
        Direccion: 'Carrera 50 #30-45, Medellín',
        CanalAdquisicion: 'Referido',
        Estado: 'Activo'
      },
      {
        NIT: '700555444-3',
        RazonSocial: 'Servicios Tech Solutions SAS',
        FechaConstitucion: '2021-11-10',
        SectorEconomico: 'Tecnología',
        EmailContacto: 'info@techsolutions.com',
        Telefono: '3155554444',
        Direccion: 'Zona Rosa, Bogotá',
        CanalAdquisicion: 'Marketing Digital',
        Estado: 'Activo'
      },
      {
        NIT: '600444333-4',
        RazonSocial: 'Distribuidora del Norte SAS',
        FechaConstitucion: '2019-05-20',
        SectorEconomico: 'Comercio',
        EmailContacto: 'ventas@distribuidoranorte.com',
        Telefono: '3144443333',
        Direccion: 'Calle 80 #20-30, Barranquilla',
        CanalAdquisicion: 'Web',
        Estado: 'Activo'
      },
      {
        NIT: '500333222-5',
        RazonSocial: 'Alimentos Frescos Colombia LTDA',
        FechaConstitucion: '2017-02-14',
        SectorEconomico: 'Alimentos',
        EmailContacto: 'contacto@alimentosfrescos.com',
        Telefono: '3133332222',
        Direccion: 'Km 5 Vía Cali, Cali',
        CanalAdquisicion: 'Referido',
        Estado: 'Activo'
      }
    ]);
    
    console.log(`✅ ${clientes.length} clientes creados`);

    // 3. Crear solicitudes de crédito
    console.log('\n📋 Creando solicitudes de crédito...');
    
    const solicitudes = await SolicitudCredito.bulkCreate([
      {
        ClienteID: clientes[0].ClienteID,
        MontoSolicitado: 50000000,
        PlazoMeses: 12,
        PropositoCredito: 'Compra de inventario para temporada alta',
        EstadoSolicitud: 'Recibida'
      },
      {
        ClienteID: clientes[1].ClienteID,
        MontoSolicitado: 120000000,
        PlazoMeses: 24,
        PropositoCredito: 'Adquisición de maquinaria industrial',
        EstadoSolicitud: 'En_Analisis',
        UsuarioAsignado: usuarios[1].UsuarioID
      },
      {
        ClienteID: clientes[2].ClienteID,
        MontoSolicitado: 30000000,
        PlazoMeses: 12,
        PropositoCredito: 'Expansión de oficinas y contratación de personal',
        EstadoSolicitud: 'Aprobada',
        UsuarioAsignado: usuarios[1].UsuarioID
      },
      {
        ClienteID: clientes[3].ClienteID,
        MontoSolicitado: 80000000,
        PlazoMeses: 18,
        PropositoCredito: 'Apertura de nueva sucursal',
        EstadoSolicitud: 'Recibida'
      },
      {
        ClienteID: clientes[4].ClienteID,
        MontoSolicitado: 45000000,
        PlazoMeses: 12,
        PropositoCredito: 'Renovación de flota de vehículos refrigerados',
        EstadoSolicitud: 'En_Analisis',
        UsuarioAsignado: usuarios[1].UsuarioID
      }
    ]);
    
    console.log(`✅ ${solicitudes.length} solicitudes creadas`);

    console.log('\n✅ ¡Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${usuarios.length} usuarios internos`);
    console.log(`   - ${clientes.length} clientes`);
    console.log(`   - ${solicitudes.length} solicitudes de crédito`);
    console.log('\n🔑 Credenciales de prueba:');
    console.log('   Admin: admin@pymecredito.com / Admin123!');
    console.log('   Analista: ana.garcia@pymecredito.com / Analista123!');
    console.log('   Cartera: carlos.ruiz@pymecredito.com / Cartera123!');
    console.log('   Supervisor: maria.lopez@pymecredito.com / Supervisor123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();