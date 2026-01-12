# Crear Usuario Empleado

Este documento explica cómo crear una cuenta de usuario con rol "empleado".

## Requisitos Previos

1. Ejecutar la migración para agregar el rol 'empleado' al ENUM de la base de datos:
   ```bash
   node -e "import('./migrations/20241201_add_empleado_role.js').then(m => m.up().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }))"
   ```

2. O ejecutar directamente el script de migración:
   ```bash
   npm run migrate:empleado
   ```

## Crear Usuario Empleado

Ejecuta el siguiente comando para crear un usuario empleado:

```bash
npm run create-empleado
```

O directamente:

```bash
node scripts/createEmpleado.js
```

## Credenciales por Defecto

El script crea un usuario con las siguientes credenciales:

- **Email**: `empleado@lowcost.com`
- **Password**: `empleado123`
- **Rol**: `empleado`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer inicio de sesión.

## Permisos del Rol Empleado

Los usuarios con rol "empleado" tienen los siguientes permisos:

### ✅ Pueden:
- Ver lista de pedidos
- Ver detalles de pedidos (solo lectura)
- Generar códigos de barras/etiquetas
- Ver lista de usuarios (solo lectura)
- Buscar pedidos

### ❌ No pueden:
- Modificar el estado de pedidos
- Eliminar pedidos
- Ver estadísticas
- Modificar usuarios
- Crear o eliminar usuarios

## Personalizar Credenciales

Si deseas crear un empleado con credenciales diferentes, edita el archivo `scripts/createEmpleado.js` y modifica las variables:

```javascript
const nombre = 'Nombre del Empleado';
const email = 'email@ejemplo.com';
const password = 'contraseña_segura';
const telefono = '1123456789';
```
