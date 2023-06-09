import React from "react";
import classes from "../App.module.css";
import { OrganisationUnitTree } from "@dhis2/ui";
import { useState, useEffect } from "react";
import DataElementGroupSelect from "../components/DataElementGroupSelect.js";
import PeroidSelect from "../components/PeriodSelect.js";
import getCurrentDate from "../memo/getCurrentDate.js";
import usePeriods from "../memo/usePeriod.js";

import { useDataQuery, useDataEngine } from "@dhis2/app-runtime";
import DataElementTable from "../components/DataElementTable";

const selectedDataElmentGroupQuery = {
  dataElements: {
    resource: "dataElementGroups",
    params: ({ selectedDataElementGroup }) => ({
      fields: [
        "dataElements[id,displayName,categoryCombo[categoryOptionCombos::size,],dataSetElements[dataSet[id,periodType,categoryCombo[categoryOptionCombos::size],]]]",
      ],
      filter: `id:eq:${selectedDataElementGroup}`,
      paging: false,
    }),
  },
};

//query orgunits that blong to a dataset and are memeber of an org unit and only facilities
const validOrgUnitsQuery = {
  orgUnits: ({ dataSetId, orgUnit, maxOrgUnitLevels }) => ({
    resource: `dataSets/${dataSetId}/organisationUnits/gist`,
    params: {
      fields: ["id"],
      filter: [`path:like:${orgUnit}`, `level:eq:${maxOrgUnitLevels}`],
      total: true,
      pageSize: 1,
    },
  }),
};

const dataValueSetQuery = {
  dataValues:({ period, dataElementGroup, orgUnit }) => ({
    resource: "dataValueSets",
    params: {
      period,
      orgUnit,
      dataElementGroup,
      children: true,
    },
  })
};

const Home = (props) => {
  const { me, maxOrgUnitLevels } = props;
  const engine = useDataEngine();

  const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
  const [selectedOrgUnits, setSelectedOrgUnits] = useState([]);
  const [selectedDataElementGroup, setSelectedDataElementGroup] = useState();


  const [dataValues,setDataValues]= useState([]);
  const [periodType, setPeriodtype] = useState("WEEKLY");
  const [dataSetId, setDataSetId] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [validOrgUnitCount, setValidOrgUnitCount] = useState();
  const currentYear = getCurrentDate();
  const [year, setYear] = useState(currentYear.getFullYear());
  const periods = usePeriods({
    periodType,
    generateYear: year,
    locale: me?.settings?.keyUiLocale,
  });
  const [dataElements, setDataElements] = useState(null);

  const handelDataElementLoadComplete = (data) => {
    setDataElements(data);
    let periodTypeData =
      data.dataElements?.dataElementGroups[0]?.dataElements[0]
        ?.dataSetElements[0]?.dataSet?.periodType;
    setPeriodtype(periodTypeData?.toUpperCase() ?? "WEEKLY");

    let dataset =
      data.dataElements?.dataElementGroups[0]?.dataElements[0]
        ?.dataSetElements[0]?.dataSet?.id;
    setDataSetId(dataset);
  };

  const { loading, error, data, refetch } = useDataQuery(
    selectedDataElmentGroupQuery,
    {
      variables: { selectedDataElementGroup },
      onComplete: handelDataElementLoadComplete,
    }
  );

  useEffect(() => {
    if (dataSetId && selectedOrgUnit)
      engine
        .query({
          orgUnits: validOrgUnitsQuery.orgUnits({
            dataSetId: dataSetId,
            orgUnit: selectedOrgUnit?.id,
            maxOrgUnitLevels,
          }),
        })
        .then((result) => {
          setValidOrgUnitCount(result?.orgUnits?.pager?.total);
        });
  }, [dataSetId, selectedOrgUnit?.id]);

  useEffect(() => {
    if (dataSetId && selectedOrgUnit && selectedPeriod)
      engine
        .query({
          dataValues: dataValueSetQuery.dataValues({
            period: selectedPeriod?.selected,
            dataElementGroup: selectedDataElementGroup,
            orgUnit: selectedOrgUnit?.id,
          }),
        })
        .then((data) => {
          setDataValues(data?.dataValues?.dataValues)
        });
  }, [dataSetId,selectedPeriod?.selected, selectedOrgUnit?.id]);

  const handelPeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handelPeriodTypeChange = (periodType) => {
    setPeriodtype(periodType);
  };

  const handelDataElementGroupChagne = (dataElementGroup) => {
    setSelectedDataElementGroup(dataElementGroup.selected);
    refetch({ selectedDataElementGroup: dataElementGroup.selected });
    //query data elements in the group and decide the period type here
  };

  const onChange = (org) => {
    let selected = [org.path];
    setSelectedOrgUnits(selected);
    setSelectedOrgUnit(org);
  };

  const roots = me?.organisationUnits?.map((org) => org?.id);

  return (
    <div>
      <h3 style={{ marginLeft: "20px" }}>Select OrgUnit</h3>
      <div className={classes.flexbreak}>
        <div className={classes.container} style={{ flex: "1 1 400px" }}>
          {roots ? (
            <OrganisationUnitTree
              singleSelection
              selected={selectedOrgUnits}
              onChange={onChange}
              name="main orgunit"
              roots={roots}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={classes.container}>
          <DataElementGroupSelect
            label=" Select data element group"
            selected={selectedDataElementGroup}
            dataElementGroups={props?.dataElementGroups}
            onChange={handelDataElementGroupChagne}
          ></DataElementGroupSelect>

          <PeroidSelect
            label=" Select period"
            selected={
              periods.map((el) => el.id).includes(selectedPeriod?.selected)
                ? selectedPeriod?.selected
                : undefined
            }
            periods={periods}
            onChange={setSelectedPeriod}
            year={year}
            onYearChange={setYear}
            maxYear={currentYear.getFullYear()}
            disabled={
              selectedOrgUnit && selectedDataElementGroup ? false : true
            }
          ></PeroidSelect>
          { dataSetId && selectedPeriod?.selected && selectedOrgUnit?.id ?
          <DataElementTable
            loading={loading}
            dataElements={
              dataElements?.dataElements?.dataElementGroups[0]?.dataElements
            }
            selectedOrgUnit={selectedOrgUnit}
            validOrgUnitCount={validOrgUnitCount}
            dataElementGroup={selectedDataElementGroup}
            dataValues={dataValues}
          ></DataElementTable>:<></>}
        </div>
      </div>
    </div>
  );
};

export default Home;
