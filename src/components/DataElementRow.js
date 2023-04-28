import React from "react";
import { DataTableRow, DataTableCell, CircularLoader } from "@dhis2/ui";


const DataElementRow = ({
  dataElement,
  validOrgUnitCount,
  dataValues
}) => {
  const expectedValues =
    validOrgUnitCount ;

  const countedOrgUnits = []
  const actualValues = dataValues?.reduce((total,data)=>{
      if(data.dataElement==dataElement?.id && !countedOrgUnits.includes(data?.orgUnit)){
        countedOrgUnits.push(data?.orgUnit);
        return total+1;
      }else
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
