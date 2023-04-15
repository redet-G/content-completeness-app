
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import moment from 'moment';
import { useMemo } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'


export default function useDataElements({dataElementGroup}){
   
    return useMemo(() => {

        const query = {
            dataElements:{
                resource: 'dataElementGroups',
                params: {
                    feilds:'dataElements[id,displayName,dataSetElements[dataSet[periodType]]]',
                    paging: false,
                  },
            }
        }

        const {loading, error, data } = useDataQuery(query);

        console.log(data);

        return data;
    },[dataElementGroup]);
}
