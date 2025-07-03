import React, { useState, useEffect } from 'react';
import AlumnoTableRow from './AlumnoTableRow';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockProductos } from '../data/mockData';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Grid, Autocomplete, TableSortLabel
} from '@mui/material';
import { Add } from '@mui/icons-material';

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
}

// Interface comentada porque no se usa
// interface Producto {
//   id: number;
//   tipo: string;
//   talle: string;
//   precio: number;
//   stock?: number;
//   stock_minimo?: number;
// }

interface Pedido {
  id: number;
  nombre: string;
  apellido: string;
  tipo: string;
  talle: string;
  precio: number;
  cantidad: number;
  estado: string;
  fecha_pedido: string;
  fecha_entrega: string;
  monto: number;
  pagado: boolean;
}

const IndumentariaTab: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [open, setOpen] = useState(false);
  
  // Hook personalizado para localStorage
  const [productosLocal, setProductosLocal] = useLocalStorage('productos-krav-maga', mockProductos);
  
  const productos = productosLocal;
  const stockBajo = productosLocal.filter((p: any) => p.stock <= p.stock_minimo);
  // Variables no utilizadas comentadas
  // const productosLoading = false;
  // const createProductoMutation = useCreateProducto();
  // const updateProductoMutation = useUpdateProducto();
  
  // Refrescar alumnos cuando se abre el modal
  useEffect(() => {
    if (open) {
      fetchAlumnos();
    }
  }, [open]);
  const [preciosOpen, setPreciosOpen] = useState(false);
  const [nuevoProductoOpen, setNuevoProductoOpen] = useState(false);
  const [editandoPrecio, setEditandoPrecio] = useState<{id: number, precio: number} | null>(null);
  const [editandoStock, setEditandoStock] = useState<{id: number, stock: number} | null>(null);
  const [editandoMinimo, setEditandoMinimo] = useState<{id: number, minimo: number} | null>(null);
  
  // Estados para ordenamiento de pedidos
  const [orderBy, setOrderBy] = useState<'alumno' | 'producto' | 'estado' | 'fecha_pedido'>('fecha_pedido');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [nuevoProducto, setNuevoProducto] = useState({ tipo: '', talle: '', precio: 0, stock: 0, stock_minimo: 5 });
  const [formData, setFormData] = useState({
    alumno_id: '',
    producto_id: '',
    cantidad: 1,
    monto: ''
  });

  useEffect(() => {
    fetchAlumnos();
    fetchPedidos();
  }, []);
  
  // Funciones dummy para compatibilidad
  // const setProductos = () => {};
  // const setStockBajo = () => {};

  const fetchAlumnos = () => {
    // Cargar alumnos desde localStorage (mismo que AlumnosTab)
    const saved = localStorage.getItem('alumnos-krav-maga');
    const alumnosLocal = saved ? JSON.parse(saved) : [];
    setAlumnos(alumnosLocal);
  };

  // Funciones no utilizadas comentadas
  // const fetchStockBajo = async () => {};
  // const fetchProductos = async () => {};

  const fetchPedidos = async () => {
    // Demo: Usar datos mock de pedidos
    const pedidosMock = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        tipo: 'Remera',
        talle: 'M',
        precio: 2500,
        cantidad: 2,
        estado: 'Pedido',
        fecha_pedido: '2024-12-15',
        fecha_entrega: '',
        monto: 5000,
        pagado: false
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        tipo: 'Short',
        talle: 'L',
        precio: 3000,
        cantidad: 1,
        estado: 'Recibido en Club',
        fecha_pedido: '2024-12-10',
        fecha_entrega: '',
        monto: 3000,
        pagado: true
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        tipo: 'Guantes',
        talle: 'Único',
        precio: 4500,
        cantidad: 1,
        estado: 'Entregado',
        fecha_pedido: '2024-12-05',
        fecha_entrega: '2024-12-20',
        monto: 4500,
        pagado: true
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'López',
        tipo: 'Remera',
        talle: 'S',
        precio: 2500,
        cantidad: 1,
        estado: 'Pedido',
        fecha_pedido: '2024-12-18',
        fecha_entrega: '',
        monto: 2500,
        pagado: false
      },
      {
        id: 5,
        nombre: 'Pedro',
        apellido: 'Martín',
        tipo: 'Short',
        talle: 'M',
        precio: 3000,
        cantidad: 2,
        estado: 'Recibido en Club',
        fecha_pedido: '2024-12-12',
        fecha_entrega: '',
        monto: 6000,
        pagado: true
      }
    ];
    
    setPedidos(pedidosMock);
  };

  const handleSubmit = async () => {
    if (!formData.alumno_id || !formData.producto_id) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const alumnoSeleccionado = alumnos.find(a => a.id === Number(formData.alumno_id));
    const productoSeleccionado = productos.find((p: any) => p.id === Number(formData.producto_id));
    
    if (!alumnoSeleccionado || !productoSeleccionado) {
      alert('Error: Alumno o producto no encontrado');
      return;
    }
    
    const nuevoPedido = {
      id: Math.max(...pedidos.map(p => p.id)) + 1,
      nombre: alumnoSeleccionado.nombre,
      apellido: alumnoSeleccionado.apellido,
      tipo: productoSeleccionado.tipo,
      talle: productoSeleccionado.talle,
      precio: productoSeleccionado.precio,
      cantidad: formData.cantidad,
      estado: 'Pedido',
      fecha_pedido: new Date().toISOString().split('T')[0],
      fecha_entrega: '',
      monto: Number(formData.monto),
      pagado: false
    };
    
    setPedidos([...pedidos, nuevoPedido]);
    alert('✅ Pedido creado exitosamente');
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      alumno_id: '',
      producto_id: '',
      cantidad: 1,
      monto: ''
    });
  };

  const handleEstadoChange = async (pedidoId: number, nuevoEstado: string) => {
    // Actualizar estado localmente
    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: nuevoEstado, fecha_entrega: nuevoEstado === 'Entregado' ? new Date().toISOString().split('T')[0] : pedido.fecha_entrega }
          : pedido
      )
    );
  };

  const handlePrecioChange = (productoId: number, nuevoPrecio: number) => {
    // Actualizar precio en localStorage
    setProductosLocal((prevProductos: any[]) => 
      prevProductos.map((p: any) => 
        p.id === productoId ? { ...p, precio: nuevoPrecio } : p
      )
    );
    setEditandoPrecio(null);
    alert('✅ Precio actualizado exitosamente');
  };

  const handlePrecioMasivo = (tipo: string, nuevoPrecio: number) => {
    // Actualizar precios masivos en localStorage
    setProductosLocal((prevProductos: any[]) => 
      prevProductos.map((p: any) => 
        p.tipo === tipo ? { ...p, precio: nuevoPrecio } : p
      )
    );
    setEditandoPrecio(null);
    const cantidad = productos.filter((p: any) => p.tipo === tipo).length;
    alert(`✅ ${cantidad} productos de tipo "${tipo}" actualizados`);
  };

  const handleStockChange = (productoId: number, nuevoStock: number) => {
    // Actualizar stock en localStorage
    setProductosLocal((prevProductos: any[]) => 
      prevProductos.map((p: any) => 
        p.id === productoId ? { ...p, stock: nuevoStock } : p
      )
    );
    setEditandoStock(null);
    alert('✅ Stock actualizado exitosamente');
  };

  const handleMinimoChange = (productoId: number, nuevoMinimo: number) => {
    // Actualizar stock mínimo en localStorage
    setProductosLocal((prevProductos: any[]) => 
      prevProductos.map((p: any) => 
        p.id === productoId ? { ...p, stock_minimo: nuevoMinimo } : p
      )
    );
    setEditandoMinimo(null);
    alert('✅ Stock mínimo actualizado exitosamente');
  };

  const handleEliminarProducto = (productoId: number) => {
    if (window.confirm('¿Eliminar este producto?')) {
      // Eliminar producto de localStorage
      setProductosLocal((prevProductos: any[]) => 
        prevProductos.filter((p: any) => p.id !== productoId)
      );
      alert('✅ Producto eliminado exitosamente');
    }
  };

  const handleCrearProducto = () => {
    if (!nuevoProducto.tipo || !nuevoProducto.talle) {
      alert('Por favor complete el tipo y talle del producto');
      return;
    }
    
    // Crear producto en localStorage
    const productoConId = {
      ...nuevoProducto,
      id: Math.max(...productosLocal.map((p: any) => p.id)) + 1
    };
    
    setProductosLocal((prevProductos: any[]) => [...prevProductos, productoConId]);
    
    setNuevoProductoOpen(false);
    setNuevoProducto({ tipo: '', talle: '', precio: 0, stock: 0, stock_minimo: 5 });
    
    alert('✅ Producto creado exitosamente');
  };

  // Función para manejar ordenamiento
  const handleRequestSort = (property: 'alumno' | 'producto' | 'estado' | 'fecha_pedido') => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Ordenar pedidos
  const pedidosOrdenados = React.useMemo(() => {
    return [...pedidos].sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (orderBy) {
        case 'alumno':
          aValue = `${a.apellido}, ${a.nombre}`;
          bValue = `${b.apellido}, ${b.nombre}`;
          break;
        case 'producto':
          aValue = a.tipo;
          bValue = b.tipo;
          break;
        case 'estado':
          aValue = a.estado;
          bValue = b.estado;
          break;
        case 'fecha_pedido':
          aValue = a.fecha_pedido;
          bValue = b.fecha_pedido;
          break;
      }
      
      if (order === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [pedidos, order, orderBy]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pedido': return 'warning';
      case 'Recibido en Club': return 'info';
      case 'Entregado': return 'success';
      default: return 'default';
    }
  };

  const selectedProducto = productos.find((p: any) => p.id === Number(formData.producto_id));

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2,
        p: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontWeight: 600,
            color: 'primary.main',
            mb: { xs: 1, sm: 0 }
          }}>
            🛍️ Gestión de Indumentaria
          </Typography>
          {stockBajo.length > 0 && (
            <Chip 
              label={`${stockBajo.length} productos con stock bajo`} 
              color="error" 
              size="small"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setPreciosOpen(true)}
          >
            Gestionar Precios
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            size="large"
            sx={{ 
              minHeight: { xs: 56, sm: 48 },
              fontSize: { xs: '1rem', sm: '1rem' },
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-1px)'
              }
            }}
          >
            Nuevo Pedido
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ 
        overflowX: 'auto',
        borderRadius: 3,
        boxShadow: 3,
        '& .MuiTable-root': {
          minWidth: { xs: 800, sm: 'auto' },
          tableLayout: 'fixed',
          width: '100%'
        },
        '& .MuiTableHead-root': {
          backgroundColor: 'primary.dark',
          '& .MuiTableCell-head': {
            color: 'black',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            letterSpacing: '0.5px',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'primary.dark !important'
          }
        },
        '& .MuiTableCell-head, & .MuiTableCell-body': {
          padding: '12px 16px !important',
          textAlign: 'left',
          verticalAlign: 'middle',
          borderRight: '1px solid #e0e0e0',
          wordWrap: 'break-word',
          overflow: 'hidden'
        },
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: 'grey.50'
        },
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'grey.100'
        }
      }}>
        <Table>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '17%' }} />
          </colgroup>
          <TableHead>
            <AlumnoTableRow isHeader>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'alumno'}
                  direction={orderBy === 'alumno' ? order : 'asc'}
                  onClick={() => handleRequestSort('alumno')}
                >
                  Alumno
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'producto'}
                  direction={orderBy === 'producto' ? order : 'asc'}
                  onClick={() => handleRequestSort('producto')}
                >
                  Producto
                </TableSortLabel>
              </TableCell>
              <TableCell>Talle</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'estado'}
                  direction={orderBy === 'estado' ? order : 'asc'}
                  onClick={() => handleRequestSort('estado')}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fecha_pedido'}
                  direction={orderBy === 'fecha_pedido' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha_pedido')}
                >
                  Fecha Pedido
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Acciones</TableCell>
            </AlumnoTableRow>
          </TableHead>
          <TableBody>
            {pedidosOrdenados.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {`${pedido.apellido}, ${pedido.nombre}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {pedido.tipo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {pedido.talle}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {pedido.cantidad}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    ${pedido.monto?.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={pedido.estado}
                    color={getEstadoColor(pedido.estado) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {new Date(pedido.fecha_pedido).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Select
                    size="small"
                    value={pedido.estado}
                    onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Pedido">Pedido</MenuItem>
                    <MenuItem value="Recibido en Club">Recibido en Club</MenuItem>
                    <MenuItem value="Entregado">Entregado</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Pedido de Indumentaria</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={alumnos}
                getOptionLabel={(alumno) => `${alumno.apellido}, ${alumno.nombre}`}
                renderInput={(params) => <TextField {...params} label="Buscar Alumno" />}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, alumno_id: newValue ? newValue.id.toString() : '' });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={formData.producto_id}
                  onChange={(e) => {
                    const producto = productos.find((p: any) => p.id === Number(e.target.value));
                    setFormData({ 
                      ...formData, 
                      producto_id: e.target.value,
                      monto: producto ? (producto.precio * formData.cantidad).toString() : ''
                    });
                  }}
                >
                  {productos.map((producto: any) => (
                    <MenuItem key={producto.id} value={producto.id}>
                      {`${producto.tipo} - Talle ${producto.talle} - $${producto.precio.toLocaleString()}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={formData.cantidad}
                onChange={(e) => {
                  const cantidad = Number(e.target.value);
                  setFormData({ 
                    ...formData, 
                    cantidad,
                    monto: selectedProducto ? (selectedProducto.precio * cantidad).toString() : ''
                  });
                }}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto Total"
                type="number"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Crear Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gestionar precios */}
      <Dialog open={preciosOpen} onClose={() => setPreciosOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Gestionar Indumentaria
            <Button variant="contained" size="small" onClick={() => setNuevoProductoOpen(true)}>+ Agregar</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Talle</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Mín</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto: any) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.tipo}</TableCell>
                    <TableCell>{producto.talle}</TableCell>
                    <TableCell>
                      {editandoPrecio?.id === producto.id ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editandoPrecio!.precio}
                          onChange={(e) => setEditandoPrecio({...editandoPrecio!, precio: Number(e.target.value)})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handlePrecioChange(producto.id, editandoPrecio!.precio);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        `$${producto.precio.toLocaleString()}`
                      )}
                    </TableCell>
                    <TableCell sx={{ color: (producto.stock || 0) <= (producto.stock_minimo || 5) ? 'error.main' : 'inherit' }}>
                      {editandoStock?.id === producto.id ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editandoStock!.stock}
                          onChange={(e) => setEditandoStock({...editandoStock!, stock: Number(e.target.value)})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleStockChange(producto.id, editandoStock!.stock);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        producto.stock || 0
                      )}
                    </TableCell>
                    <TableCell>
                      {editandoMinimo?.id === producto.id ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editandoMinimo!.minimo}
                          onChange={(e) => setEditandoMinimo({...editandoMinimo!, minimo: Number(e.target.value)})}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleMinimoChange(producto.id, editandoMinimo!.minimo);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        producto.stock_minimo || 5
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {editandoPrecio?.id === producto.id ? (
                          <>
                            <Button size="small" onClick={() => handlePrecioChange(producto.id, editandoPrecio!.precio)} title="Solo este">✓</Button>
                            <Button size="small" onClick={() => handlePrecioMasivo(producto.tipo, editandoPrecio!.precio)} title="Todos" color="warning">✓✓</Button>
                            <Button size="small" onClick={() => setEditandoPrecio(null)}>✗</Button>
                          </>
                        ) : editandoStock?.id === producto.id ? (
                          <>
                            <Button size="small" onClick={() => handleStockChange(producto.id, editandoStock!.stock)}>✓</Button>
                            <Button size="small" onClick={() => setEditandoStock(null)}>✗</Button>
                          </>
                        ) : editandoMinimo?.id === producto.id ? (
                          <>
                            <Button size="small" onClick={() => handleMinimoChange(producto.id, editandoMinimo!.minimo)}>✓</Button>
                            <Button size="small" onClick={() => setEditandoMinimo(null)}>✗</Button>
                          </>
                        ) : (
                          <>
                            <Button size="small" onClick={() => setEditandoPrecio({id: producto.id, precio: producto.precio})}>$</Button>
                            <Button size="small" onClick={() => setEditandoStock({id: producto.id, stock: producto.stock || 0})}>📦</Button>
                            <Button size="small" onClick={() => setEditandoMinimo({id: producto.id, minimo: producto.stock_minimo || 5})}>⚠</Button>
                            <Button size="small" color="error" onClick={() => handleEliminarProducto(producto.id)}>🗑</Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreciosOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para nuevo producto */}
      <Dialog open={nuevoProductoOpen} onClose={() => setNuevoProductoOpen(false)}>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Complete todos los campos para agregar un nuevo producto al inventario.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo de Producto"
                value={nuevoProducto.tipo}
                onChange={(e) => setNuevoProducto({...nuevoProducto, tipo: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Talle"
                value={nuevoProducto.talle}
                onChange={(e) => setNuevoProducto({...nuevoProducto, talle: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({...nuevoProducto, precio: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Inicial"
                type="number"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({...nuevoProducto, stock: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Mínimo"
                type="number"
                value={nuevoProducto.stock_minimo}
                onChange={(e) => setNuevoProducto({...nuevoProducto, stock_minimo: Number(e.target.value)})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNuevoProductoOpen(false)}>Cancelar</Button>
          <Button onClick={handleCrearProducto} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IndumentariaTab;