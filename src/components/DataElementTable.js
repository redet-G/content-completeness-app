import React from "react";
import classes from "../App.module.css";
import { SingleSelectOption, SingleSelectField } from "@dhis2/ui";
import YearNavigator from "./YearNavigator.js";
import DataElementRow from "../components/DataElementRow.js";
import {
  DataTable,
  TableHead,
  DataTableRow,
  DataTableColumnHeader,
  TableBody,
  DataTableCell,
  TableFoot,
  spacers,
  CircularLoader,
} from "@dhis2/ui";

const DataElementTable = ({ loading, dataElements, selectedOrgUnit,validOrgUnitCount,dataValues}) => {
  const rows = dataElements?.map((element) => (
    <DataElementRow
      selectedOrgUnit={selectedOrgUnit}
      key={element?.id}
      dataElement={element}
      validOrgUnitCount={validOrgUnitCount}
      dataValues={dataValues}
    ></DataElementRow>
  ));

  return (
    <div
      style={{
        marginTop: spacers.dp24,
        marginRight: "auto",
        minWidth: spacers.dp384,
      }}
    >
      {loading ? (
        <CircularLoader small />
      ) : (
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader>Data Elements</DataTableColumnHeader>
              <DataTableColumnHeader>Acutal Values</DataTableColumnHeader>
              <DataTableColumnHeader>Excpected Values</DataTableColumnHeader>
              <DataTableColumnHeader>Completenes</DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
          <TableFoot>
            <DataTableRow>
              <DataTableCell colSpan="2">
                Data Element completeness
              </DataTableCell>
            </DataTableRow>
          </TableFoot>
        </DataTable>
      )}
    </div>
  );
};

export default DataElementTable;
