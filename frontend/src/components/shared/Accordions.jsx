import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

export default function Accordions({ data }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontWeight: 'bold' }}>{data.expenseName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Created By : {data.createdBy}</Typography>
        <Typography>Total Amount : {data.totalAmount}</Typography>
        <Typography>Total Shares : {data.totalShares}</Typography>
        <Typography>Type: {data.type}</Typography>
        <Typography>Splits: {data.splits}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
