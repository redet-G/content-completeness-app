import React from "react";
import { useEffect, useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { DataTableRow, DataTableCell, CircularLoader } from "@dhis2/ui";


const DataElementRow = ({
  dataElement,
  validOrgUnitCount,
  dataValues
}) => {
  const expectedValues =
    validOrgUnitCount *
    dataElement?.categoryCombo?.categoryOptionCombos *
    dataElement?.dataSetElements[0]?.dataSet?.categoryCombo
      ?.categoryOptionCombos;
  const actualValues = dataValues?.reduce((total,data)=>{
      if(data.dataElement==dataElement?.id)
        return total+1;
      else
        return total;
  },0)

  const completeness = (actualValues/expectedValues)*100;
  return (
    <>
      {false ? (
        <CircularLoader small />
      ) : (
        <DataTableRow key={dataElement?.id}>
          <DataTableCell key={dataElement?.id + "1"}>
            {dataElement.displayName}
          </DataTableCell>
          <DataTableCell key={dataElement?.id + "2"}>
            {(actualValues)}
          </DataTableCell>
          <DataTableCell key={dataElement?.id + "3"}>
            {(expectedValues)}
          </DataTableCell>
          <DataTableCell key={dataElement?.id + "4"}>
            {completeness.toFixed(1)}%
          </DataTableCell>
        </DataTableRow>
      )}
    </>
  );
};

export default DataElementRow;
