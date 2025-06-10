// components/LinkDescarga.jsx
import React from "react";
import { Box } from '@adminjs/design-system'

const LinkDescarga = (props) => {
  const { record } = props;
  const fileName = record.params.archivo;

  if (!fileName) return <Box>No subido</Box>;

  const url = `/uploads/${fileName}`;

  return (
    <Box>
      <a href={url} target="_blank" rel="noopener noreferrer">
      Descargar PDF
      </a>
    </Box>
  );
};

export default LinkDescarga;
