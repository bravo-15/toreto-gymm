import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "./AdminPage.css";
import api from "../../services/api";

export default function Reportes() {
  const fechaActual = new Date().toLocaleDateString("es-PE");

  const exportarExcel = async (endpoint, nombreArchivo, nombreHoja) => {
    try {
      const res = await api.get(endpoint);

      const hoja = XLSX.utils.json_to_sheet(res.data);
      const libro = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
      XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);

      toast.success(`Reporte ${nombreArchivo} exportado correctamente.`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo exportar el reporte Excel.");
    }
  };

  const generarEncabezadoPDF = (doc, titulo) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 212, 0);
    doc.setFontSize(20);
    doc.text("⚡ TORETO GYM", 14, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("Sistema de Gestión de Gimnasio", 14, 23);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(16);
    doc.text(titulo, 14, 45);

    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${fechaActual}`, 14, 53);
  };

  const exportarPagosPDF = async () => {
    try {
      const res = await api.get("/pagos");

      const doc = new jsPDF();

      generarEncabezadoPDF(doc, "Reporte de Pagos");

      const total = res.data.reduce(
        (suma, p) => suma + Number(p.monto || 0),
        0
      );

      autoTable(doc, {
        startY: 62,
        head: [["Cliente", "Membresía", "Monto", "Método", "Fecha", "Estado"]],
        body: res.data.map((p) => [
          p.cliente || "-",
          p.membresia || "-",
          `S/ ${Number(p.monto || 0).toFixed(2)}`,
          p.metodo_pago || "-",
          p.fecha_pago?.slice(0, 10) || "-",
          p.estado || "-",
        ]),
        headStyles: {
          fillColor: [20, 20, 20],
          textColor: [255, 212, 0],
        },
        styles: {
          fontSize: 9,
        },
      });

      const finalY = doc.lastAutoTable.finalY + 12;

      doc.setFillColor(255, 212, 0);
      doc.rect(120, finalY, 75, 14, "F");
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(12);
      doc.text(`TOTAL: S/ ${total.toFixed(2)}`, 126, finalY + 9);

      doc.save("reporte_pagos_toreto_gym.pdf");
      toast.success("Reporte PDF de pagos generado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF de pagos.");
    }
  };

  const exportarClientesPDF = async () => {
    try {
      const res = await api.get("/clientes");

      const doc = new jsPDF();

      generarEncabezadoPDF(doc, "Reporte de Clientes");

      autoTable(doc, {
        startY: 62,
        head: [["Nombre", "DNI", "Teléfono", "Correo", "Estado"]],
        body: res.data.map((c) => [
          c.nombre || "-",
          c.dni || "-",
          c.telefono || c.celular || "-",
          c.correo || "-",
          c.estado || "-",
        ]),
        headStyles: {
          fillColor: [20, 20, 20],
          textColor: [255, 212, 0],
        },
        styles: {
          fontSize: 9,
        },
      });

      doc.save("reporte_clientes_toreto_gym.pdf");
      toast.success("Reporte PDF de clientes generado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF de clientes.");
    }
  };

  const exportarAsistenciasPDF = async () => {
    try {
      const res = await api.get("/asistencias");

      const doc = new jsPDF();

      generarEncabezadoPDF(doc, "Reporte de Asistencias");

      autoTable(doc, {
        startY: 62,
        head: [["Cliente", "Fecha", "Entrada", "Salida", "Estado"]],
        body: res.data.map((a) => [
          a.cliente || a.nombre_cliente || "-",
          a.fecha?.slice(0, 10) || "-",
          a.hora_ingreso || "-",
          a.hora_salida || "Sin salida",
          a.estado || "-",
        ]),
        headStyles: {
          fillColor: [20, 20, 20],
          textColor: [255, 212, 0],
        },
        styles: {
          fontSize: 9,
        },
      });

      doc.save("reporte_asistencias_toreto_gym.pdf");
      toast.success("Reporte PDF de asistencias generado correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF de asistencias.");
    }
  };

  return (
    <div className="admin-page reportes-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-label">Centro de reportes</span>
          <h1>Reportes TORETO GYM</h1>
          <p>
            Exporta información importante del sistema en formato Excel y PDF
            para control administrativo, financiero y operativo.
          </p>
        </div>

        <div className="dashboard-income">
          <span>Fecha de emisión</span>
          <strong>{fechaActual}</strong>
          <small>Reportes listos para presentación</small>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card premium-card">
          <span>Clientes Excel</span>
          <h2>👥</h2>
          <p>Exportar todos los clientes registrados.</p>
          <button
            onClick={() =>
              exportarExcel("/clientes", "clientes_toreto_gym", "Clientes")
            }
          >
            Descargar Excel
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Pagos Excel</span>
          <h2>💰</h2>
          <p>Exportar historial completo de pagos.</p>
          <button
            onClick={() =>
              exportarExcel("/pagos", "pagos_toreto_gym", "Pagos")
            }
          >
            Descargar Excel
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Asistencias Excel</span>
          <h2>✅</h2>
          <p>Exportar asistencias registradas.</p>
          <button
            onClick={() =>
              exportarExcel(
                "/asistencias",
                "asistencias_toreto_gym",
                "Asistencias"
              )
            }
          >
            Descargar Excel
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Membresías Excel</span>
          <h2>💳</h2>
          <p>Exportar planes de membresía.</p>
          <button
            onClick={() =>
              exportarExcel(
                "/membresias",
                "membresias_toreto_gym",
                "Membresias"
              )
            }
          >
            Descargar Excel
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Pagos PDF</span>
          <h2>📄</h2>
          <p>Generar reporte PDF financiero.</p>
          <button onClick={exportarPagosPDF}>
            Descargar PDF
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Clientes PDF</span>
          <h2>🧾</h2>
          <p>Generar reporte PDF de clientes.</p>
          <button onClick={exportarClientesPDF}>
            Descargar PDF
          </button>
        </div>

        <div className="dashboard-card premium-card">
          <span>Asistencias PDF</span>
          <h2>📋</h2>
          <p>Generar reporte PDF de asistencias.</p>
          <button onClick={exportarAsistenciasPDF}>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}