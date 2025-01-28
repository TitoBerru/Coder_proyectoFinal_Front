'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Facturador() {
  const [view, setView] = useState("home"); // Tracks current view
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "clientes") fetchClientes();
    if (view === "productos") fetchProductos();
    if (view === "facturas") fetchFacturas();
    if (view === "comprar" && clientes.length === 0) fetchClientes();
  }, [view]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/facturas");
      setFacturas(response.data);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  };

  const agregarProducto = () => {
    if (selectedProducto && cantidad > 0) {
      const producto = productos.find((p) => p.id === parseInt(selectedProducto));
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...producto, cantidad },
      ]);
      setSelectedProducto(null);
      setCantidad(1);
    }
  };

  const realizarCompra = async () => {
    if (selectedCliente && productosSeleccionados.length > 0) {
      const detalles = productosSeleccionados.map((producto) => ({
        productoId: producto.id,
        cantidad: producto.cantidad,
      }));

      const compra = {
        clienteId: parseInt(selectedCliente),
        detalles,
      };

      try {
        setLoading(true);
        await axios.post("http://localhost:8080/api/v1/compras", compra);
        alert("Compra realizada con éxito");
        setProductosSeleccionados([]);
        setSelectedCliente(null);
      } catch (error) {
        console.error("Error realizando la compra:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Selecciona un cliente y al menos un producto.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Facturador</h1>
        <ul>
          <li className="mb-4">
            <button className="w-full text-left" onClick={() => setView("home")}>Inicio</button>
          </li>
          <li className="mb-4">
            <button className="w-full text-left" onClick={() => setView("clientes")}>Clientes</button>
          </li>
          <li className="mb-4">
            <button className="w-full text-left" onClick={() => setView("productos")}>Productos</button>
          </li>
          <li className="mb-4">
            <button className="w-full text-left" onClick={() => setView("facturas")}>Facturas</button>
          </li>
          <li className="mb-4">
            <button className="w-full text-left" onClick={() => setView("comprar")}>Comprar</button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="w-3/4 p-8">
        {view === "home" && (
          <div>
            <h2 className="text-3xl font-bold">Bienvenidos al Facturador</h2>
            <p className="mt-4 text-lg">Proyecto Final de CoderHouse - Hector Berrutti</p>
            <p className="mt-4 text-lg">Selecciona una opción en el menú para comenzar.</p>
          </div>
        )}

        {view === "clientes" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Clientes</h2>
            {clientes.length === 0 ? (
              <p>Cargando clientes...</p>
            ) : (
              <ul className="border rounded p-4">
                {clientes.map((cliente) => (
                  <li key={cliente.id} className="mb-2">
                    {cliente.nombre} {cliente.apellido} - DNI: {cliente.dni}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "productos" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Productos</h2>
            {productos.length === 0 ? (
              <p>Cargando productos...</p>
            ) : (
              <ul className="border rounded p-4">
                {productos.map((producto) => (
                  <li key={producto.id} className="mb-2">
                    {producto.nombreProducto} - Precio: ${producto.precioVentaProducto}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "facturas" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Facturas</h2>
            {facturas.length === 0 ? (
              <p>Cargando facturas...</p>
            ) : (
              <ul className="border rounded p-4">
                {facturas.map((factura) => (
                  <li key={factura.id} className="mb-2">
                    Factura #{factura.id} - Cliente: {factura.nombreCliente} {factura.apellidoCliente} - Total: ${factura.totalFactura}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === "comprar" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Realizar Compra</h2>
            <div className="mb-4">
              <label className="block mb-2">Seleccionar Cliente:</label>
              <select
                className="border rounded p-2 w-full bg-gray-100 text-gray-900"
                onChange={(e) => setSelectedCliente(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Seleccionar Producto:</label>
              <select
                className="border rounded p-2 w-full bg-gray-100 text-gray-900"
                onChange={(e) => setSelectedProducto(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </select>
              <label className="block mt-2">Cantidad:</label>
              <input
                type="number"
                className="border rounded p-2 w-full bg-gray-100 text-gray-900"
                value={cantidad}
                min="1"
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={agregarProducto}
            >
              Agregar Producto
            </button>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Productos Seleccionados:</h3>
              <ul className="border rounded p-4">
                {productosSeleccionados.map((producto, index) => (
                  <li key={index} className="mb-2">
                    {producto.nombreProducto} - Cantidad: {producto.cantidad} - Precio: ${producto.precioVentaProducto}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
              onClick={realizarCompra}
              disabled={loading}
            >
              {loading ? "Realizando Compra..." : "Realizar Compra"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
