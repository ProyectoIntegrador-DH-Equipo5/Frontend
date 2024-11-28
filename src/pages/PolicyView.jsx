import React from "react";
import "../styles/App.css";

const PolicyView = () => {
  
  const policies = [
    {
      title: "Preservación de las Obras de Arte",
      description:
        "Las obras de arte alquiladas deben ser cuidadas con el máximo respeto y preservación. Está estrictamente prohibido realizar cualquier tipo de modificación en las obras...",
    },
    {
      title: "Transporte y Manipulación",
      description:
        "El transporte y manipulación de las obras de arte deben realizarse exclusivamente a través de personal especializado en el manejo de piezas de alto valor...",
    },
    {
      title: "Devolución de Obras",
      description:
        "La obra debe ser devuelta en las mismas condiciones en las que fue entregada. En caso de daño, se debe notificar de inmediato a la administración, y el cliente será responsable de los costos de restauración...",
    },
    {
      title: "Duración del Alquiler",
      description:
        "El tiempo máximo de alquiler de las obras de arte será de 30 días. Cualquier extensión debe ser solicitada con al menos 3 días de anticipación y estará sujeta a la disponibilidad de la obra...",
    },
    {
      title: "Uso Exclusivo",
      description:
        "Las obras alquiladas deben ser usadas solo en los fines indicados en el contrato. Está prohibido usarlas para fines comerciales sin la autorización explícita de la galería...",
    },
  ];

  return (
    <div className="policy-container">
      <h2 className="policy-title">Política de Uso</h2>
      <div className="policy-columns">
        {policies.map((policy, index) => (
          <div className="policy" key={index}>
            <h3 className="policy-subtitle">{policy.title}</h3>
            <p className="policy-description">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyView;